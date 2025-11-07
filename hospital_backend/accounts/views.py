from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
import razorpay
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import hmac, hashlib, json

from .models import CustomUser , Service,  Booking
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, ServiceSerializer, BookingSerializer


# 🔑 Helper function to generate JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# 🧩 REGISTER USER
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response(
            {
                "message": "Registration successful",
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status=status.HTTP_201_CREATED,
        )


# 🔐 LOGIN USER
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        tokens = get_tokens_for_user(user)
        return Response(
            {
                "message": "Login successful",
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status=status.HTTP_200_OK,
        )


# 🧭 ADMIN USER LIST / DETAIL / DELETE
class AdminUserListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # ✅ Get all users (Admin only)
    def get(self, request):
        if request.user.role != "admin":
            return Response(
                {"detail": "Access denied. Admins only."},
                status=status.HTTP_403_FORBIDDEN,
            )

        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ✅ Delete user by ID (Admin only)
    def delete(self, request, pk=None):
        if request.user.role != "admin":
            return Response(
                {"detail": "Access denied. Admins only."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if not pk:
            return Response(
                {"detail": "User ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = get_object_or_404(CustomUser, pk=pk)

        # Prevent deleting another admin
        if user.role == "admin":
            return Response(
                {"detail": "Cannot delete another admin."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.delete()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    # ✅ Update user (optional)
    def put(self, request, pk=None):
        if request.user.role != "admin":
            return Response(
                {"detail": "Access denied. Admins only."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user = get_object_or_404(CustomUser, pk=pk)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User updated successfully.", "user": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧍‍♂️ USER PROFILE VIEW (for logged-in user)
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]

class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class ServiceListCreateView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

class ServiceDeleteView(generics.DestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAdminUser]

class BookingListView(generics.ListAPIView):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAdminUser]  # Only admin can view bookings

    def get_serializer_context(self):
        return {'request': self.request}

class BookingStatusUpdateView(generics.UpdateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAdminUser]

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True  # ✅ allow partial updates
        booking = self.get_object()

        # Get fields from request
        new_status = request.data.get("status")
        new_date = request.data.get("appointment_date")
        new_time = request.data.get("appointment_time")

        # ✅ Validate status if provided
        valid_statuses = ["confirmed", "cancelled", "refunded", "rescheduled"]
        if new_status and new_status not in valid_statuses:
            return Response(
                {"error": "Invalid status value."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Apply status update if provided
        if new_status:
            booking.status = new_status

        # ✅ Handle rescheduling (only if both date & time are given)
        if new_status == "rescheduled":
            if not new_date or not new_time:
                return Response(
                    {"error": "Both appointment_date and appointment_time are required for rescheduling."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            booking.appointment_date = new_date
            booking.appointment_time = new_time

        # ✅ Save updated booking
        booking.save()

        serializer = self.get_serializer(booking, context={"request": request})
        return Response(
            {
                "message": "Booking updated successfully.",
                "booking": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, *args, **kwargs):
        # ✅ Support PATCH requests cleanly
        return self.update(request, *args, **kwargs)

# USER BOOKINGS VIEW
class UserBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')

    def get_serializer_context(self):
        return {'request': self.request}
    
class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        service_id = request.data.get("service")
        pet_name = request.data.get("pet_name")
        appointment_date = request.data.get("appointment_date")
        appointment_time = request.data.get("appointment_time")

        if not all([service_id, pet_name, appointment_date, appointment_time]):
            return Response({"detail": "All fields are required."}, status=400)

        try:
            service = Service.objects.get(pk=service_id)
        except Service.DoesNotExist:
            return Response({"detail": "Invalid service."}, status=404)

        booking = Booking.objects.create(
            user=user,
            service=service,
            pet_name=pet_name,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            status="pending"
        )

        serializer = self.get_serializer(booking, context={"request": request})
        return Response(
            {"message": "Booking created successfully", "booking": serializer.data},
            status=status.HTTP_201_CREATED,
        )

class CreateRazorpayOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )

            amount = int(request.data.get("amount", 0)) * 100  # convert to paise
            currency = "INR"

            payment = client.order.create({
                "amount": amount,
                "currency": currency,
                "payment_capture": "1"
            })

            return Response({
                "order_id": payment["id"],
                "amount": amount,
                "currency": currency,
                "key": settings.RAZORPAY_KEY_ID
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
@method_decorator(csrf_exempt, name='dispatch')
class RazorpayWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            secret = settings.RAZORPAY_KEY_SECRET
            body = request.body.decode()
            received_data = json.loads(body)
            signature = request.headers.get('X-Razorpay-Signature', '')

            # Verify Razorpay signature
            generated_signature = hmac.new(
                bytes(secret, 'utf-8'),
                msg=bytes(body, 'utf-8'),
                digestmod=hashlib.sha256
            ).hexdigest()

            if hmac.compare_digest(generated_signature, signature):
                payment_id = received_data["payload"]["payment"]["entity"]["id"]
                order_id = received_data["payload"]["payment"]["entity"]["order_id"]
                status_text = received_data["payload"]["payment"]["entity"]["status"]

                # Update booking in DB
                booking = Booking.objects.filter(order_id=order_id).first()
                if booking:
                    booking.payment_id = payment_id
                    booking.payment_status = status_text
                    if status_text == "captured":
                        booking.status = "confirmed"
                    booking.save()

                return Response({"status": "success"})
            else:
                return Response({"error": "Invalid signature"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
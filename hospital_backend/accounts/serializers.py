from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from .models import CustomUser
from .models import Service
from .models import Booking

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'user')
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")


        user_obj = User.objects.filter(email=email).first()
        if not user_obj:
            raise serializers.ValidationError("Invalid email or password.")

        # Authenticate using username (since Django authenticate uses username by default)
        user = authenticate(username=user_obj.username, password=password)

        if user and user.is_active:
            return {"user": user}

        raise serializers.ValidationError("Invalid email or password.")
    
class ServiceSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'features', 'image', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None

class BookingSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    service_image = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'user_name', 'user_email', 'service_name', 'service_image',
            'pet_name', 'appointment_date', 'appointment_time', 'status'
        ]

    def get_service_image(self, obj):
        request = self.context.get('request')
        if obj.service.image and hasattr(obj.service.image, 'url'):
            return request.build_absolute_uri(obj.service.image.url)
        return None
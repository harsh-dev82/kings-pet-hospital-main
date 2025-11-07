from django.urls import path
from .views import RegisterView, LoginView, AdminUserListView, UserProfileView, ServiceListView, BookingListView, BookingStatusUpdateView, ServiceListCreateView, ServiceDeleteView, UserBookingsView, BookingCreateView, CreateRazorpayOrderView, RazorpayWebhookView, ServiceDetailView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', AdminUserListView.as_view(), name='user-list'),         # GET all users (admin)
    path('users/<int:pk>/', AdminUserListView.as_view(), name='user-detail'),  # PUT / DELETE
    path('profile/', UserProfileView.as_view(), name='profile'),           # GET own profile
    path('services/', ServiceListCreateView.as_view(), name='services-list-create'),
    path('services/<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),  
    path('bookings/', UserBookingsView.as_view(), name='user-bookings'),      # User's bookings
    path('bookings/all/', BookingListView.as_view(), name='admin-bookings'),  # Admin view
    path('bookings/<int:pk>/', BookingStatusUpdateView.as_view(), name='update-booking'),
    path('bookings/create/', BookingCreateView.as_view(), name='create-booking'),
    path('create-order/', CreateRazorpayOrderView.as_view(), name='create-order'),
    path('webhook/razorpay/', RazorpayWebhookView.as_view(), name='razorpay-webhook'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

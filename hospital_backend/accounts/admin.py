from django.contrib import admin
from .models import CustomUser, Service, Booking


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('id',)
    list_editable = ('role', 'is_active')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price')
    search_fields = ('name',)
    ordering = ('id',)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'service', 'pet_name',
        'appointment_date', 'appointment_time', 'status', 'created_at'
    )
    list_display_links = ('id', 'user', 'service')
    list_filter = ('status', 'appointment_date', 'service')
    search_fields = ('user__username', 'service__name', 'pet_name')
    ordering = ('-created_at',)
    list_editable = ('status',)  # ✅ admin can directly change booking status
    date_hierarchy = 'appointment_date'
    readonly_fields = ('created_at', 'updated_at')

    # ✅ Allow batch actions for admin
    actions = ['mark_as_confirmed', 'mark_as_cancelled', 'mark_as_refunded', 'mark_as_rescheduled']

    def mark_as_confirmed(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f"{updated} booking(s) marked as Confirmed.")
    mark_as_confirmed.short_description = "Mark selected bookings as Confirmed"

    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f"{updated} booking(s) marked as Cancelled.")
    mark_as_cancelled.short_description = "Mark selected bookings as Cancelled"

    def mark_as_refunded(self, request, queryset):
        updated = queryset.update(status='refunded')
        self.message_user(request, f"{updated} booking(s) marked as Refunded.")
    mark_as_refunded.short_description = "Mark selected bookings as Refunded"

    def mark_as_rescheduled(self, request, queryset):
        updated = queryset.update(status='rescheduled')
        self.message_user(request, f"{updated} booking(s) marked as Rescheduled.")
    mark_as_rescheduled.short_description = "Mark selected bookings as Rescheduled"

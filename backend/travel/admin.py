from django.contrib import admin
from .models import Destination, Tour, Booking


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'is_popular', 'created_at']
    list_filter = ['is_popular', 'country']
    search_fields = ['name', 'country', 'description']
    list_editable = ['is_popular']


@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = ['title', 'destination', 'price', 'duration_days', 'start_date', 'end_date', 'is_active', 'is_featured']
    list_filter = ['is_active', 'is_featured', 'destination']
    search_fields = ['title', 'description']
    list_editable = ['is_active', 'is_featured']
    date_hierarchy = 'start_date'


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'tour', 'number_of_people', 'total_price', 'status', 'booking_date']
    list_filter = ['status', 'booking_date']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    list_editable = ['status']
    readonly_fields = ['booking_date', 'total_price']

    @admin.display(description='Клиент')
    def full_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'

from datetime import date

from django.db.models import Sum
from rest_framework import serializers
from .models import Destination, Tour, Booking


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ['id', 'name', 'country', 'description', 'image', 'is_popular', 'created_at', 'updated_at']


class TourSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(source='destination.name', read_only=True)
    destination_country = serializers.CharField(source='destination.country', read_only=True)
    available_spots = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = [
            'id', 'title', 'destination', 'destination_name', 'destination_country',
            'description', 'price', 'duration_days', 'start_date', 'end_date',
            'max_people', 'available_spots', 'image', 'is_featured', 'is_active',
            'created_at', 'updated_at',
        ]

    def get_available_spots(self, obj):
        booked = obj.bookings.filter(
            status__in=['pending', 'confirmed']
        ).aggregate(total=Sum('number_of_people'))['total'] or 0
        return max(0, obj.max_people - booked)


class BookingSerializer(serializers.ModelSerializer):
    tour_title = serializers.CharField(source='tour.title', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'tour', 'tour_title', 'first_name', 'last_name', 'email',
            'phone', 'number_of_people', 'booking_date', 'status', 'total_price',
        ]
        read_only_fields = ['total_price', 'status', 'booking_date']

    def validate(self, data):
        tour = data.get('tour')
        number_of_people = data.get('number_of_people', 1)

        if not tour:
            raise serializers.ValidationError({'tour': 'Необходимо указать тур.'})

        if not tour.is_active:
            raise serializers.ValidationError({'tour': 'Этот тур недоступен для бронирования.'})

        if tour.start_date < date.today():
            raise serializers.ValidationError({'tour': 'Дата начала тура уже прошла.'})

        if number_of_people < 1:
            raise serializers.ValidationError({'number_of_people': 'Минимальное количество — 1 человек.'})

        booked = tour.bookings.filter(
            status__in=['pending', 'confirmed']
        ).aggregate(total=Sum('number_of_people'))['total'] or 0

        available = tour.max_people - booked
        if number_of_people > available:
            raise serializers.ValidationError(
                {'number_of_people': f'Доступно только {available} мест из {tour.max_people}.'}
            )

        return data

    def create(self, validated_data):
        tour = validated_data['tour']
        number_of_people = validated_data.get('number_of_people', 1)
        validated_data['total_price'] = tour.price * number_of_people
        return super().create(validated_data)

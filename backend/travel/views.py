from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Destination, Tour, Booking
from .serializers import DestinationSerializer, TourSerializer, BookingSerializer


class DestinationViewSet(viewsets.ReadOnlyModelViewSet):
    """Направления — только чтение для публичного API."""
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer

    @action(detail=False, methods=['get'])
    def popular(self, request):
        popular = Destination.objects.filter(is_popular=True)
        page = self.paginate_queryset(popular)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(popular, many=True)
        return Response(serializer.data)


class TourViewSet(viewsets.ReadOnlyModelViewSet):
    """Туры — только чтение для публичного API."""
    queryset = Tour.objects.filter(is_active=True).select_related('destination')
    serializer_class = TourSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = Tour.objects.filter(
            is_featured=True, is_active=True
        ).select_related('destination')
        page = self.paginate_queryset(featured)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_destination(self, request):
        destination_id = request.query_params.get('destination_id')
        if not destination_id:
            return Response(
                {'error': 'destination_id parameter required'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        tours = Tour.objects.filter(
            destination_id=destination_id, is_active=True
        ).select_related('destination')
        page = self.paginate_queryset(tours)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(tours, many=True)
        return Response(serializer.data)


class BookingViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Бронирования — только создание для публичного API.
    Просмотр/изменение бронирований — через Django Admin."""
    queryset = Booking.objects.select_related('tour')
    serializer_class = BookingSerializer

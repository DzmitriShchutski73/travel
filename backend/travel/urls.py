from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DestinationViewSet, TourViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'destinations', DestinationViewSet)
router.register(r'tours', TourViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
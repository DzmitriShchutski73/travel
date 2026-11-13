from datetime import date, timedelta
from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Destination, Tour, Booking


class DestinationModelTest(TestCase):
    def setUp(self):
        self.dest = Destination.objects.create(
            name='Париж', country='Франция',
            description='Город любви', is_popular=True,
        )

    def test_str(self):
        self.assertEqual(str(self.dest), 'Париж, Франция')

    def test_default_ordering(self):
        dest2 = Destination.objects.create(
            name='Берлин', country='Германия',
            description='Столица Германии', is_popular=False,
        )
        destinations = list(Destination.objects.all())
        # is_popular=True идёт первым (ordering: -is_popular)
        self.assertEqual(destinations[0], self.dest)


class TourModelTest(TestCase):
    def setUp(self):
        self.dest = Destination.objects.create(
            name='Рим', country='Италия', description='Вечный город',
        )
        self.tour = Tour.objects.create(
            title='Тур в Рим', destination=self.dest,
            description='Исследуйте Рим',
            price=Decimal('50000.00'), duration_days=7,
            start_date=date.today() + timedelta(days=30),
            end_date=date.today() + timedelta(days=37),
            max_people=10,
        )

    def test_str(self):
        self.assertEqual(str(self.tour), 'Тур в Рим')


class BookingAPITest(APITestCase):
    def setUp(self):
        self.dest = Destination.objects.create(
            name='Рим', country='Италия', description='Вечный город',
        )
        self.tour = Tour.objects.create(
            title='Тур в Рим', destination=self.dest,
            description='Исследуйте Рим',
            price=Decimal('50000.00'), duration_days=7,
            start_date=date.today() + timedelta(days=30),
            end_date=date.today() + timedelta(days=37),
            max_people=3,
        )

    def _booking_data(self, **overrides):
        data = {
            'tour': self.tour.id,
            'first_name': 'Иван',
            'last_name': 'Петров',
            'email': 'ivan@example.com',
            'phone': '+79001234567',
            'number_of_people': 1,
        }
        data.update(overrides)
        return data

    def test_create_booking_success(self):
        resp = self.client.post('/api/bookings/', self._booking_data(), format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Decimal(resp.data['total_price']), Decimal('50000.00'))

    def test_create_booking_auto_total_price(self):
        resp = self.client.post(
            '/api/bookings/',
            self._booking_data(number_of_people=2),
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Decimal(resp.data['total_price']), Decimal('100000.00'))

    def test_booking_exceeds_max_people(self):
        # Заполняем все 3 места
        self.client.post('/api/bookings/', self._booking_data(number_of_people=3), format='json')
        # Ещё одно бронирование — нет мест
        resp = self.client.post('/api/bookings/', self._booking_data(), format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_inactive_tour(self):
        self.tour.is_active = False
        self.tour.save()
        resp = self.client.post('/api/bookings/', self._booking_data(), format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_past_tour(self):
        self.tour.start_date = date.today() - timedelta(days=5)
        self.tour.save()
        resp = self.client.post('/api/bookings/', self._booking_data(), format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bookings_list_not_allowed(self):
        """GET /api/bookings/ не должен быть доступен публично."""
        resp = self.client.get('/api/bookings/')
        self.assertIn(resp.status_code, [status.HTTP_404_NOT_FOUND, status.HTTP_405_METHOD_NOT_ALLOWED])


class DestinationAPITest(APITestCase):
    def setUp(self):
        Destination.objects.create(
            name='Токио', country='Япония',
            description='Столица Японии', is_popular=True,
        )
        Destination.objects.create(
            name='Каир', country='Египет',
            description='Столица Египта', is_popular=False,
        )

    def test_list_destinations(self):
        resp = self.client.get('/api/destinations/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_popular_destinations(self):
        resp = self.client.get('/api/destinations/popular/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)


class TourAPITest(APITestCase):
    def setUp(self):
        dest = Destination.objects.create(
            name='Лондон', country='Великобритания', description='Столица Англии',
        )
        Tour.objects.create(
            title='Тур в Лондон', destination=dest,
            description='Туманный Альбион',
            price=Decimal('70000.00'), duration_days=5,
            start_date=date.today() + timedelta(days=10),
            end_date=date.today() + timedelta(days=15),
        )

    def test_list_tours(self):
        resp = self.client.get('/api/tours/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_featured_tours(self):
        resp = self.client.get('/api/tours/featured/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_tours_by_destination_missing_param(self):
        resp = self.client.get('/api/tours/by_destination/')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

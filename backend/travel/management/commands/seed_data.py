from django.core.management.base import BaseCommand
from travel.models import Destination, Tour, Booking
from datetime import date, timedelta


class Command(BaseCommand):
    help = 'Заполняет базу данных тестовыми данными'

    def handle(self, *args, **options):
        # Создаем направления
        destinations_data = [
            {
                'name': 'Бангкок',
                'country': 'Таиланд',
                'description': 'Столица Таиланда с великолепными храмами, оживленными рынками и роскошными дворцами.',
                'is_popular': True,
            },
            {
                'name': 'Пхукет',
                'country': 'Таиланд',
                'description': 'Крупнейший остров Таиланда с белыми пляжами и кристально чистой водой.',
                'is_popular': True,
            },
            {
                'name': 'Барселона',
                'country': 'Испания',
                'description': 'Город архитектуры Гауди, средиземноморской кухни и яркой ночной жизни.',
                'is_popular': True,
            },
            {
                'name': 'Париж',
                'country': 'Франция',
                'description': 'Город любви, Эйфелева башня, Лувр и уютные улочки Монмартра.',
                'is_popular': False,
            },
            {
                'name': 'Токио',
                'country': 'Япония',
                'description': 'Современная мегаполис с традиционными храмами и передовыми технологиями.',
                'is_popular': False,
            },
            {
                'name': 'Дубай',
                'country': 'ОАЭ',
                'description': 'Город небоскребов, роскошных отелей и пустынных сафари.',
                'is_popular': False,
            },
        ]

        destinations = []
        for data in destinations_data:
            dest, created = Destination.objects.get_or_create(
                name=data['name'],
                country=data['country'],
                defaults=data
            )
            destinations.append(dest)
            if created:
                self.stdout.write(f'Создано направление: {dest}')

        # Создаем туры
        today = date.today()
        tours_data = [
            {
                'title': 'Экскурсия по Бангкоку 3 дня',
                'destination': destinations[0],
                'description': 'Погружение в культуру Таиланда: Большой дворец, Wat Arun, плавучие рынки.',
                'price': 45000,
                'duration_days': 3,
                'start_date': today + timedelta(days=15),
                'end_date': today + timedelta(days=18),
                'max_people': 15,
                'is_featured': True,
            },
            {
                'title': 'Отдых на Пхукете 7 дней',
                'destination': destinations[1],
                'description': 'Пляжный отдых на острове Пхукет с посещением островов Пхи-Пхи.',
                'price': 85000,
                'duration_days': 7,
                'start_date': today + timedelta(days=30),
                'end_date': today + timedelta(days=37),
                'max_people': 20,
                'is_featured': True,
            },
            {
                'title': 'Барселона и Гауди 5 дней',
                'destination': destinations[2],
                'description': 'Семейный тур по Барселоне с посещением Саграда Фамилия и Парка Гюэля.',
                'price': 62000,
                'duration_days': 5,
                'start_date': today + timedelta(days=45),
                'end_date': today + timedelta(days=50),
                'max_people': 12,
                'is_featured': True,
            },
            {
                'title': 'Романтический Париж 4 дня',
                'destination': destinations[3],
                'description': 'Прогулки по Парижу, посещение Эйфелевой башни и круиз по Сене.',
                'price': 78000,
                'duration_days': 4,
                'start_date': today + timedelta(days=60),
                'end_date': today + timedelta(days=64),
                'max_people': 10,
                'is_featured': False,
            },
            {
                'title': 'Токио: традиции иmodern 6 дней',
                'destination': destinations[4],
                'description': 'Путешествие по Токио: синтоистские храмы, неоновые улицы и технологии.',
                'price': 120000,
                'duration_days': 6,
                'start_date': today + timedelta(days=90),
                'end_date': today + timedelta(days=96),
                'max_people': 8,
                'is_featured': False,
            },
            {
                'title': 'Дубай: роскошь и пустыня 5 дней',
                'destination': destinations[5],
                'description': 'Посещение Бурдж-Халифа, пустынное сафари и шоппинг в Дубае.',
                'price': 95000,
                'duration_days': 5,
                'start_date': today + timedelta(days=120),
                'end_date': today + timedelta(days=125),
                'max_people': 16,
                'is_featured': False,
            },
        ]

        for data in tours_data:
            tour, created = Tour.objects.get_or_create(
                title=data['title'],
                defaults=data
            )
            if created:
                self.stdout.write(f'Создан тур: {tour}')

        self.stdout.write(self.style.SUCCESS('База данных успешно заполнена тестовыми данными!'))
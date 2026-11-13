from django.db import models


class Destination(models.Model):
    """Направление (страна/город)"""
    name = models.CharField(max_length=100, verbose_name='Название')
    country = models.CharField(max_length=100, verbose_name='Страна')
    description = models.TextField(verbose_name='Описание')
    image = models.ImageField(upload_to='destinations/', blank=True, null=True, verbose_name='Изображение')
    is_popular = models.BooleanField(default=False, verbose_name='Популярное направление')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Направление'
        verbose_name_plural = 'Направления'
        ordering = ['-is_popular', 'name']

    def __str__(self):
        return f'{self.name}, {self.country}'


class Tour(models.Model):
    """Тур"""
    title = models.CharField(max_length=200, verbose_name='Название тура')
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name='tours',
        verbose_name='Направление'
    )
    description = models.TextField(verbose_name='Описание')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена')
    duration_days = models.PositiveIntegerField(verbose_name='Продолжительность (дни)')
    start_date = models.DateField(verbose_name='Дата начала')
    end_date = models.DateField(verbose_name='Дата окончания')
    max_people = models.PositiveIntegerField(default=20, verbose_name='Макс. количество человек')
    image = models.ImageField(upload_to='tours/', blank=True, null=True, verbose_name='Изображение')
    is_featured = models.BooleanField(default=False, verbose_name='Рекомендуемый')
    is_active = models.BooleanField(default=True, verbose_name='Активный')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Тур'
        verbose_name_plural = 'Туры'
        ordering = ['-is_featured', '-created_at']

    def __str__(self):
        return self.title


class Booking(models.Model):
    """Бронирование тура"""
    tour = models.ForeignKey(
        Tour,
        on_delete=models.CASCADE,
        related_name='bookings',
        verbose_name='Тур'
    )
    first_name = models.CharField(max_length=100, verbose_name='Имя')
    last_name = models.CharField(max_length=100, verbose_name='Фамилия')
    email = models.EmailField(verbose_name='Email')
    phone = models.CharField(max_length=20, verbose_name='Телефон')
    number_of_people = models.PositiveIntegerField(default=1, verbose_name='Количество человек')
    booking_date = models.DateTimeField(auto_now_add=True, verbose_name='Дата бронирования')
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'В ожидании'),
            ('confirmed', 'Подтверждено'),
            ('cancelled', 'Отменено'),
        ],
        default='pending',
        verbose_name='Статус'
    )
    total_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Общая цена')

    class Meta:
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирования'
        ordering = ['-booking_date']

    def __str__(self):
        return f'{self.first_name} {self.last_name} - {self.tour.title}'

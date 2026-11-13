import Link from 'next/link';
import { Suspense } from 'react';
import { api } from '@/lib/api';
import DestinationCard from '@/components/DestinationCard';
import TourCard from '@/components/TourCard';

async function HomePageContent() {
  let popularDestinations;
  let featuredTours;

  try {
    [popularDestinations, featuredTours] = await Promise.all([
      api.getPopularDestinations(),
      api.getFeaturedTours(),
    ]);
  } catch (error) {
    console.error('Failed to load homepage data:', error);
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Не удалось загрузить данные</h2>
          <p className="text-gray-500">Пожалуйста, попробуйте обновить страницу</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Откройте мир с TravelCompany
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Найдите и забронируйте лучшие туры по всему миру по выгодным ценам
          </p>
          <Link href="/tours" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Смотреть туры
          </Link>
        </div>
      </section>

      {/* Popular Destinations */}
      {popularDestinations.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Популярные направления
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularDestinations.map((destination) => (
                <DestinationCard key={destination.id} {...destination} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/destinations" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Все направления
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Tours */}
      {featuredTours.length > 0 && (
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Рекомендуемые туры
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours.map((tour) => (
                <TourCard key={tour.id} {...tour} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/tours" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Все туры
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Индивидуальный подход</h3>
              <p className="text-gray-600">Мы подбираем тур под ваши пожелания и бюджет</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-2">Лучшие цены</h3>
              <p className="text-gray-600">Работаем напрямую с поставщиками для выгодных цен</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🛟</div>
              <h3 className="text-xl font-semibold mb-2">Поддержка 24/7</h3>
              <p className="text-gray-600">Наши менеджеры всегда на связи в любое время</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

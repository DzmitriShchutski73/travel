import { Suspense } from 'react';
import { api } from '@/lib/api';
import DestinationCard from '@/components/DestinationCard';

async function DestinationsPageContent() {
  let destinations;

  try {
    destinations = await api.getDestinations();
  } catch (error) {
    console.error('Failed to load destinations:', error);
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Не удалось загрузить направления</h2>
          <p className="text-gray-500">Пожалуйста, попробуйте обновить страницу</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Направления
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Исследуйте самые красивые места в мире. Выберите направление и найдите идеальный тур.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} {...destination} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <DestinationsPageContent />
    </Suspense>
  );
}

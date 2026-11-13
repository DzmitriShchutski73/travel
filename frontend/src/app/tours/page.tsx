import { Suspense } from 'react';
import { api } from '@/lib/api';
import TourCard from '@/components/TourCard';

async function ToursPageContent({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>;
}) {
  const params = await searchParams;
  const destinationId = params.destination ? Number(params.destination) : undefined;

  let tours;
  let destinations;

  try {
    [tours, destinations] = await Promise.all([
      destinationId
        ? api.getToursByDestination(destinationId)
        : api.getTours(),
      api.getDestinations(),
    ]);
  } catch (error) {
    console.error('Failed to load tours:', error);
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Не удалось загрузить туры</h2>
          <p className="text-gray-500">Пожалуйста, попробуйте обновить страницу</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Каталог туров
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Широкий выбор туров на любой вкус и бюджет
        </p>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <a
            href="/tours"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !destinationId
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Все туры
          </a>
          {destinations.map((dest) => (
            <a
              key={dest.id}
              href={`/tours?destination=${dest.id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                destinationId === dest.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {dest.name}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <TourCard key={tour.id} {...tour} />
          ))}
        </div>

        {tours.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Нет туров для выбранного направления.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <ToursPageContent searchParams={searchParams} />
    </Suspense>
  );
}

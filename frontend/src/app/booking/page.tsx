import { Suspense } from 'react';
import { api } from '@/lib/api';
import BookingForm from '@/components/BookingForm';

async function BookingPageContent({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string }>;
}) {
  const params = await searchParams;
  const tourId = params.tour ? Number(params.tour) : undefined;
  const tours = await api.getTours();

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Бронирование тура
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Заполните форму, и наш менеджер свяжется с вами для подтверждения
        </p>
        <BookingForm tourId={tourId} tours={tours} />
      </div>
    </div>
  );
}

export default function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <BookingPageContent searchParams={searchParams} />
    </Suspense>
  );
}
'use client';

import { useState } from 'react';
import { api, ApiError, Tour } from '@/lib/api';

interface BookingFormProps {
  tourId?: number;
  tours?: Tour[];
}

export default function BookingForm({ tourId, tours = [] }: BookingFormProps) {
  const [selectedTour, setSelectedTour] = useState<number | undefined>(tourId);
  const [formData, setFormData] = useState({
    tour: tourId || 0,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    number_of_people: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const selectedTourData = tours.find((t) => t.id === selectedTour);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTour) {
      setError('Выберите тур');
      return;
    }

    // Клиентская проверка количества мест
    if (selectedTourData && formData.number_of_people > selectedTourData.available_spots) {
      setError(`Доступно только ${selectedTourData.available_spots} мест.`);
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await api.createBooking({
        tour: selectedTour,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        number_of_people: formData.number_of_people,
      });
      setSuccess(true);
      setFormData({
        tour: selectedTour,
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        number_of_people: 1,
      });
    } catch (err) {
      console.error('Booking error:', err);
      if (err instanceof ApiError && err.body && typeof err.body === 'object') {
        // Показать серверные ошибки валидации
        const messages = Object.values(err.body as Record<string, string[]>)
          .flat()
          .join('. ');
        setError(messages || 'Произошла ошибка при бронировании.');
      } else {
        setError('Произошла ошибка при бронировании. Пожалуйста, попробуйте позже.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Бронирование подтверждено!</h3>
        <p className="text-green-700">Мы свяжемся с вами в ближайшее время для подтверждения.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          Забронировать ещё
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Бронирование тура</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {!tourId && tours.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Выберите тур</label>
          <select
            value={selectedTour || ''}
            onChange={(e) => setSelectedTour(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Выберите тур --</option>
            {tours.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.title} — {tour.price} ₽ (свободно мест: {tour.available_spots})
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
        <input
          type="text"
          required
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
        <input
          type="text"
          required
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+7 (___) ___-__-__"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Количество человек</label>
        <input
          type="number"
          min="1"
          max={selectedTourData?.available_spots || 99}
          required
          value={formData.number_of_people}
          onChange={(e) => setFormData({ ...formData, number_of_people: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {selectedTourData && (
          <p className="text-xs text-gray-500 mt-1">
            Свободно мест: {selectedTourData.available_spots}
          </p>
        )}
      </div>

      {selectedTourData && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex justify-between">
            <span>Цена за человека:</span>
            <span className="font-semibold">{selectedTourData.price} ₽</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Итого:</span>
            <span className="font-bold text-lg">{selectedTourData.price * formData.number_of_people} ₽</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold"
      >
        {isSubmitting ? 'Отправка...' : 'Забронировать'}
      </button>
    </form>
  );
}

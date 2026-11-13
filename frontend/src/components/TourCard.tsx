import Link from 'next/link';

interface TourCardProps {
  id: number;
  title: string;
  destination_name: string;
  destination_country: string;
  description: string;
  price: number;
  duration_days: number;
  start_date: string;
  end_date: string;
  max_people: number;
  available_spots?: number;
  image?: string | null;
}

export default function TourCard({
  id,
  title,
  destination_name,
  destination_country,
  description,
  price,
  duration_days,
  start_date,
  end_date,
  max_people,
  available_spots,
  image,
}: TourCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const spots = available_spots ?? max_people;
  const spotsLow = spots <= 3 && spots > 0;
  const soldOut = spots <= 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-6xl">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          '✈️'
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">Мест нет</span>
          </div>
        )}
        {spotsLow && !soldOut && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Осталось {spots} мест
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-green-600 font-medium text-sm mb-2">
          {destination_name}, {destination_country}
        </p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">{price.toLocaleString('ru-RU')} ₽</span>
            <span className="text-gray-500 text-sm"> / чел.</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Длительность</div>
            <div className="font-semibold">{duration_days} дней</div>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>📅 {formatDate(start_date)} - {formatDate(end_date)}</span>
          <span>👥 {spots} из {max_people}</span>
        </div>
        <Link
          href={soldOut ? '#' : `/booking?tour=${id}`}
          className={`block w-full text-center py-2 rounded-md transition-colors ${
            soldOut
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          aria-disabled={soldOut}
        >
          {soldOut ? 'Мест нет' : 'Забронировать'}
        </Link>
      </div>
    </div>
  );
}

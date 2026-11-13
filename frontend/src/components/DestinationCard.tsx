import Link from 'next/link';

interface DestinationCardProps {
  id: number;
  name: string;
  country: string;
  description: string;
  image?: string | null;
}

export default function DestinationCard({ id, name, country, description, image }: DestinationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-6xl">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          '🌍'
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="text-blue-600 font-medium mb-2">{country}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
        <Link href={`/tours?destination=${id}`} className="text-blue-600 hover:text-blue-800 font-medium">
          Смотреть туры →
        </Link>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'TravelCompany - Туристическая компания',
  description: 'Найдите и забронируйте лучшие туры по всему миру',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-50">
        <Navigation />
        <main>{children}</main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2026 TravelCompany. Все права защищены.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

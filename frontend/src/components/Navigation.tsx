'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Главная' },
  { href: '/destinations', label: 'Направления' },
  { href: '/tours', label: 'Туры' },
  { href: '/booking', label: 'Бронирование' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                ✈️ TravelCompany
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex space-x-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'border-white text-white'
                      : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600 transition-colors"
              aria-label="Открыть меню"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

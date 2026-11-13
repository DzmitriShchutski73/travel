const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Destination {
  id: number;
  name: string;
  country: string;
  description: string;
  image: string | null;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tour {
  id: number;
  title: string;
  destination: number;
  destination_name: string;
  destination_country: string;
  description: string;
  price: number;
  duration_days: number;
  start_date: string;
  end_date: string;
  max_people: number;
  available_spots: number;
  image: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  tour: number;
  tour_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  number_of_people: number;
  booking_date: string;
  status: string;
  total_price: number;
}

export interface BookingCreate {
  tour: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  number_of_people: number;
}

/** Ответ с пагинацией от DRF */
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, statusText: string, body: unknown) {
    super(`API Error: ${status} ${statusText}`);
    this.status = status;
    this.body = body;
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }
      throw new ApiError(response.status, response.statusText, body);
    }

    return response.json();
  }

  /** Получить массив из пагинированного ответа (все results) */
  private async getList<T>(endpoint: string): Promise<T[]> {
    const data = await this.request<PaginatedResponse<T> | T[]>(endpoint);
    // Поддержка как пагинированного, так и обычного ответа
    if (Array.isArray(data)) {
      return data;
    }
    return data.results;
  }

  async getDestinations(): Promise<Destination[]> {
    return this.getList<Destination>('/destinations/');
  }

  async getPopularDestinations(): Promise<Destination[]> {
    return this.getList<Destination>('/destinations/popular/');
  }

  async getTours(): Promise<Tour[]> {
    return this.getList<Tour>('/tours/');
  }

  async getFeaturedTours(): Promise<Tour[]> {
    return this.getList<Tour>('/tours/featured/');
  }

  async getToursByDestination(destinationId: number): Promise<Tour[]> {
    return this.getList<Tour>(`/tours/by_destination/?destination_id=${destinationId}`);
  }

  async createBooking(data: BookingCreate): Promise<Booking> {
    return this.request<Booking>('/bookings/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export { ApiError };
export const api = new ApiClient(API_BASE_URL);

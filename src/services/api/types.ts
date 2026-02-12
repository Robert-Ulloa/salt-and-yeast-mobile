import type { BakeryTag, Location, MenuCategory } from '../../types/menu';

export type ApiLocation = Location;
export type ApiMenuItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: MenuCategory;
  tags?: BakeryTag[];
  priceCents: number;
};

export type Occasion = 'brunch' | 'coffee' | 'gifts' | 'catering' | null;

export type QuoteLineInput = {
  itemId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
};

export type QuoteRequest = {
  locationId: string;
  pickupMode: 'asap' | 'scheduled';
  scheduledPickupTime?: string | null;
  occasion?: Occasion;
  lines: QuoteLineInput[];
};

export type QuoteResponse = {
  locationId: string;
  pickupMode: 'asap' | 'scheduled';
  pickupLabel: string;
  scheduledPickupTime?: string | null;
  occasion?: Occasion;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  taxRate: number;
};

export type CreateOrderRequest = {
  locationId: string;
  pickupMode: 'asap' | 'scheduled';
  scheduledPickupTime?: string | null;
  occasion?: Occasion;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  lines: QuoteLineInput[];
};

export type CreateOrderResponse = {
  orderId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'canceled';
  pickupLabel: string;
  locationId: string;
  pickupMode: 'asap' | 'scheduled';
  scheduledPickupTime?: string | null;
  occasion?: Occasion;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  createdAt: string;
};

export type OrderResponse = CreateOrderResponse;

export class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, options?: { status?: number; code?: string }) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status;
    this.code = options?.code;
  }
}

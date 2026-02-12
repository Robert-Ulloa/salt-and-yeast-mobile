import { apiGet, apiPost, getApiBaseUrl } from './apiClient';
import { endpoints } from './endpoints';
import type {
  ApiLocation,
  ApiMenuItem,
  CreateOrderRequest,
  CreateOrderResponse,
  OrderResponse,
  QuoteRequest,
  QuoteResponse,
} from './types';
import { getLocations, getLocationById } from '../mock/locations';
import { getMenuItemsByLocation } from '../mock/menu';
import type { BakeryItem } from '../../types/menu';

const DEMO_TAX_RATE = 0.0825;
let locationCache: ApiLocation[] = getLocations();
const demoOrders = new Map<string, OrderResponse>();

export async function fetchLocations(): Promise<ApiLocation[]> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    const locations = getLocations();
    locationCache = locations;
    return withMockDelay(locations);
  }
  const response = await apiGet<{
    locations: Array<{
      id: string;
      name: string;
      address: string;
      hours_label: string;
      is_open_now: boolean;
      pickup_eta_mins: number;
      image_url: string;
    }>;
  }>(endpoints.locations);
  const locations = response.locations.map((location) => ({
    id: location.id,
    name: location.name,
    address: location.address,
    hoursLabel: location.hours_label,
    isOpenNow: location.is_open_now,
    pickupEtaMins: location.pickup_eta_mins,
    image: location.image_url,
  }));
  locationCache = locations;
  return locations;
}

export async function fetchMenu(locationId: string): Promise<BakeryItem[]> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    const mockItems = getMenuItemsByLocation(locationId).map(mapBakeryItemToApiMenuItem);
    return withMockDelay(mockItems.map((item) => mapApiMenuItemToBakeryItem(item, locationId)));
  }
  const response = await apiGet<{
    location_id: string;
    items: Array<{
      id: string;
      name: string;
      description: string;
      image_url: string;
      category: ApiMenuItem['category'];
      tags?: ApiMenuItem['tags'];
      price_cents: number;
    }>;
  }>(endpoints.menu(locationId));
  return response.items
    .map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image_url,
      category: item.category,
      tags: item.tags,
      priceCents: item.price_cents,
    }))
    .map((item) => mapApiMenuItemToBakeryItem(item, locationId));
}

export async function createQuote(input: QuoteRequest): Promise<QuoteResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    const subtotalCents = input.lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
    const taxCents = Math.round(subtotalCents * DEMO_TAX_RATE);
    const totalCents = subtotalCents + taxCents;
    const location = getLocationById(input.locationId);
    const pickupLabel =
      input.pickupMode === 'scheduled'
        ? input.scheduledPickupTime ?? 'Scheduled pickup'
        : `ASAP${location ? ` · ${location.pickupEtaMins}-${location.pickupEtaMins + 6} min` : ''}`;

    return withMockDelay({
      locationId: input.locationId,
      pickupMode: input.pickupMode,
      pickupLabel,
      scheduledPickupTime: input.scheduledPickupTime ?? null,
      occasion: input.occasion ?? null,
      subtotalCents,
      taxCents,
      totalCents,
      taxRate: DEMO_TAX_RATE,
    });
  }

  const response = await apiPost<{
    location_id: string;
    pickup_mode: 'asap' | 'scheduled';
    pickup_label: string;
    scheduled_pickup_time?: string | null;
    occasion?: QuoteResponse['occasion'];
    subtotal_cents: number;
    tax_cents: number;
    total_cents: number;
    tax_rate: number;
  }>(endpoints.quote, {
    location_id: input.locationId,
    pickup_mode: input.pickupMode,
    scheduled_pickup_time: input.scheduledPickupTime ?? null,
    occasion: input.occasion ?? null,
    lines: input.lines.map((line) => ({
      item_id: line.itemId,
      name: line.name,
      quantity: line.quantity,
      unit_price_cents: line.unitPriceCents,
    })),
  });

  return {
    locationId: response.location_id,
    pickupMode: response.pickup_mode,
    pickupLabel: response.pickup_label,
    scheduledPickupTime: response.scheduled_pickup_time ?? null,
    occasion: response.occasion ?? null,
    subtotalCents: response.subtotal_cents,
    taxCents: response.tax_cents,
    totalCents: response.total_cents,
    taxRate: response.tax_rate,
  };
}

export async function createOrder(input: CreateOrderRequest): Promise<CreateOrderResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    const quote = await createQuote({
      locationId: input.locationId,
      pickupMode: input.pickupMode,
      scheduledPickupTime: input.scheduledPickupTime,
      occasion: input.occasion,
      lines: input.lines,
    });

    const orderId = `demo_${Date.now()}`;
    const response: OrderResponse = {
      orderId,
      status: 'pending',
      pickupLabel: quote.pickupLabel,
      locationId: input.locationId,
      pickupMode: input.pickupMode,
      scheduledPickupTime: input.scheduledPickupTime ?? null,
      occasion: input.occasion ?? null,
      subtotalCents: quote.subtotalCents,
      taxCents: quote.taxCents,
      totalCents: quote.totalCents,
      createdAt: new Date().toISOString(),
    };
    demoOrders.set(orderId, response);
    return withMockDelay(response);
  }

  const response = await apiPost<{
    order_id: string;
    status: CreateOrderResponse['status'];
    pickup_label: string;
    location_id: string;
    pickup_mode: 'asap' | 'scheduled';
    scheduled_pickup_time?: string | null;
    occasion?: CreateOrderResponse['occasion'];
    subtotal_cents: number;
    tax_cents: number;
    total_cents: number;
    created_at: string;
  }>(endpoints.orders, {
    location_id: input.locationId,
    pickup_mode: input.pickupMode,
    scheduled_pickup_time: input.scheduledPickupTime ?? null,
    occasion: input.occasion ?? null,
    contact: input.contact,
    lines: input.lines.map((line) => ({
      item_id: line.itemId,
      name: line.name,
      quantity: line.quantity,
      unit_price_cents: line.unitPriceCents,
    })),
  });

  return mapApiOrderToOrderResponse(response);
}

export async function fetchOrderById(orderId: string): Promise<OrderResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    const existing = demoOrders.get(orderId);
    if (!existing) {
      throw new Error('Order not found');
    }
    return withMockDelay(existing, 250);
  }

  const response = await apiGet<{
    order_id: string;
    status: OrderResponse['status'];
    pickup_label: string;
    location_id: string;
    pickup_mode: 'asap' | 'scheduled';
    scheduled_pickup_time?: string | null;
    occasion?: OrderResponse['occasion'];
    subtotal_cents: number;
    tax_cents: number;
    total_cents: number;
    created_at: string;
  }>(endpoints.orderById(orderId));
  return mapApiOrderToOrderResponse(response);
}

export function getCachedLocationById(locationId: string | null | undefined): ApiLocation | undefined {
  if (!locationId) return undefined;
  return locationCache.find((location) => location.id === locationId) ?? getLocationById(locationId);
}

function withMockDelay<T>(value: T, delay = 350): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delay);
  });
}

function mapBakeryItemToApiMenuItem(item: BakeryItem): ApiMenuItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    image: item.image,
    category: item.category,
    tags: item.tags,
    priceCents: Math.round(item.price * 100),
  };
}

function mapApiMenuItemToBakeryItem(item: ApiMenuItem, locationId: string): BakeryItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    image: item.image?.trim() || FALLBACK_MENU_IMAGE,
    category: item.category,
    tags: item.tags,
    price: item.priceCents / 100,
    locationIds: [locationId],
  };
}

const FALLBACK_MENU_IMAGE =
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';

function mapApiOrderToOrderResponse(response: {
  order_id: string;
  status: OrderResponse['status'];
  pickup_label: string;
  location_id: string;
  pickup_mode: 'asap' | 'scheduled';
  scheduled_pickup_time?: string | null;
  occasion?: OrderResponse['occasion'];
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  created_at: string;
}): OrderResponse {
  return {
    orderId: response.order_id,
    status: response.status,
    pickupLabel: response.pickup_label,
    locationId: response.location_id,
    pickupMode: response.pickup_mode,
    scheduledPickupTime: response.scheduled_pickup_time ?? null,
    occasion: response.occasion ?? null,
    subtotalCents: response.subtotal_cents,
    taxCents: response.tax_cents,
    totalCents: response.total_cents,
    createdAt: response.created_at,
  };
}

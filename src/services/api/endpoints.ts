export const endpoints = {
  locations: '/locations',
  menu: (locationId: string) => `/menu?locationId=${encodeURIComponent(locationId)}`,
  quote: '/quote',
  orders: '/orders',
  orderById: (orderId: string) => `/orders/${encodeURIComponent(orderId)}`,
};

import type { BakeryItem, BakerySection, MenuCategory } from '../../types/menu';

const ALL_LOCATIONS = ['downtown', 'soco', 'east'];

const allItems: BakeryItem[] = [
  // ── Pastries ──────────────────────────────────────────
  {
    id: 'croissant-butter',
    name: 'Cultured Butter Croissant',
    description: 'Laminated daily with Normandy-style cultured butter.',
    price: 4.5,
    image: 'https://images.unsplash.com/photo-1555507036-ab794f4afe5a?auto=format&fit=crop&w=800&q=80',
    category: 'Pastries',
    locationIds: ALL_LOCATIONS,
    tags: ['popular', 'bestSeller'],
  },
  {
    id: 'kouign-amann',
    name: 'Salted Caramel Kouign-Amann',
    description: 'Caramelized Breton pastry with flaky, buttery layers.',
    price: 5.25,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    category: 'Pastries',
    locationIds: ['downtown', 'soco'],
    tags: ['new'],
  },
  {
    id: 'danish-berry',
    name: 'Roasted Berry Danish',
    description: 'Cream cheese custard, roasted berries, citrus glaze.',
    price: 5.75,
    image: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=800&q=80',
    category: 'Pastries',
    locationIds: ALL_LOCATIONS,
    tags: ['seasonal'],
  },
  {
    id: 'almond-croissant',
    name: 'Almond Frangipane Croissant',
    description: 'Twice-baked with almond cream and toasted flakes.',
    price: 5.5,
    image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=800&q=80',
    category: 'Pastries',
    locationIds: ALL_LOCATIONS,
    tags: ['popular'],
  },
  {
    id: 'pain-au-chocolat',
    name: 'Pain au Chocolat',
    description: 'Dark chocolate batons wrapped in laminated dough.',
    price: 4.75,
    image: 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7bc?auto=format&fit=crop&w=800&q=80',
    category: 'Pastries',
    locationIds: ALL_LOCATIONS,
    tags: ['bestSeller'],
  },
  // ── Bread ─────────────────────────────────────────────
  {
    id: 'country-loaf',
    name: 'Country Sourdough',
    description: '48-hour fermented loaf with a caramelized crust.',
    price: 9.0,
    image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=800&q=80',
    category: 'Bread',
    locationIds: ALL_LOCATIONS,
    tags: ['bestSeller'],
  },
  {
    id: 'seeded-rye',
    name: 'Seeded Rye',
    description: 'Hearty rye with toasted sunflower, flax, and sesame.',
    price: 10.0,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    category: 'Bread',
    locationIds: ['downtown', 'east'],
  },
  {
    id: 'olive-levain',
    name: 'Olive Levain',
    description: 'Naturally leavened dough folded with Castelvetrano olives.',
    price: 10.5,
    image: 'https://images.unsplash.com/photo-1486887396153-fa416526c108?auto=format&fit=crop&w=800&q=80',
    category: 'Bread',
    locationIds: ['soco', 'east'],
  },
  {
    id: 'focaccia-rosemary',
    name: 'Rosemary Focaccia',
    description: 'Olive oil, flaky salt, and fresh rosemary slab.',
    price: 8.0,
    image: 'https://images.unsplash.com/photo-1573140401552-3fab0b5e4585?auto=format&fit=crop&w=800&q=80',
    category: 'Bread',
    locationIds: ALL_LOCATIONS,
    tags: ['popular'],
  },
  // ── Brunch ────────────────────────────────────────────
  {
    id: 'egg-sando',
    name: 'Soft Egg Brioche',
    description: 'Herb aioli, aged cheddar, and soft scrambled eggs.',
    price: 11.0,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    category: 'Brunch',
    locationIds: ['downtown', 'soco'],
    tags: ['weekend', 'popular'],
  },
  {
    id: 'tartine-salmon',
    name: 'Smoked Salmon Tartine',
    description: 'Brown butter rye, cultured cream, herbs and citrus.',
    price: 14.5,
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80',
    category: 'Brunch',
    locationIds: ['downtown', 'east'],
    tags: ['weekend'],
  },
  {
    id: 'avocado-toast',
    name: 'Avocado & Dukkah Toast',
    description: 'Sourdough, smashed avocado, soft egg, hazelnut dukkah.',
    price: 13.0,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    category: 'Brunch',
    locationIds: ALL_LOCATIONS,
    tags: ['weekend', 'popular'],
  },
  {
    id: 'granola-bowl',
    name: 'House Granola Bowl',
    description: 'Greek yogurt, seasonal fruit, honey, toasted oats.',
    price: 10.5,
    image: 'https://images.unsplash.com/photo-1511690743698-d9d18f7e20f1?auto=format&fit=crop&w=800&q=80',
    category: 'Brunch',
    locationIds: ALL_LOCATIONS,
    tags: ['vegan', 'weekend'],
  },
  // ── Coffee ────────────────────────────────────────────
  {
    id: 'drip-coffee',
    name: 'House Drip Coffee',
    description: 'Single-origin rotating roast brewed fresh every hour.',
    price: 3.5,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    category: 'Coffee',
    locationIds: ALL_LOCATIONS,
    tags: ['bestSeller'],
  },
  {
    id: 'oat-latte',
    name: 'Oat Milk Latte',
    description: 'Double shot espresso with micro-foamed oat milk.',
    price: 5.5,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
    category: 'Coffee',
    locationIds: ALL_LOCATIONS,
    tags: ['vegan', 'popular'],
  },
  {
    id: 'cold-brew',
    name: 'Nitro Cold Brew',
    description: 'Slow-steeped for 24 hours and served on tap.',
    price: 5.0,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
    category: 'Coffee',
    locationIds: ['downtown', 'east'],
  },
  {
    id: 'cortado',
    name: 'Cortado',
    description: 'Equal parts espresso and steamed milk. No fuss.',
    price: 4.25,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?auto=format&fit=crop&w=800&q=80',
    category: 'Coffee',
    locationIds: ALL_LOCATIONS,
  },
  {
    id: 'matcha-latte',
    name: 'Ceremonial Matcha Latte',
    description: 'Stone-ground matcha, oat milk, light vanilla.',
    price: 6.0,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    category: 'Coffee',
    locationIds: ['downtown', 'soco'],
    tags: ['new', 'seasonal'],
  },
  // ── Gifts ─────────────────────────────────────────────
  {
    id: 'gift-box-mini',
    name: 'Mini Viennoiserie Box',
    description: 'Six-piece assortment of morning pastries.',
    price: 22.0,
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=800&q=80',
    category: 'Gifts',
    locationIds: ALL_LOCATIONS,
    tags: ['popular'],
  },
  {
    id: 'gift-box-brunch',
    name: 'Weekend Brunch Box',
    description: 'Pastries, brioche rolls, and seasonal jam.',
    price: 38.0,
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80',
    category: 'Gifts',
    locationIds: ['downtown', 'soco'],
    tags: ['weekend'],
  },
  {
    id: 'gift-bread-share',
    name: 'Bread Share Basket',
    description: 'Three artisan loaves, cultured butter, and honey.',
    price: 34.0,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    category: 'Gifts',
    locationIds: ALL_LOCATIONS,
    tags: ['new'],
  },
];

const categories: MenuCategory[] = ['Pastries', 'Bread', 'Brunch', 'Coffee', 'Gifts'];

export function getMenuItemsByLocation(locationId: string): BakeryItem[] {
  return allItems.filter((item) => item.locationIds.includes(locationId));
}

export function getCategories(): MenuCategory[] {
  return categories;
}

export function getMenuSectionsByLocation(
  locationId: string,
  category: MenuCategory | 'All',
  query = '',
): BakerySection[] {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = getMenuItemsByLocation(locationId).filter((item) => {
    const categoryOk = category === 'All' || item.category === category;
    const queryOk =
      normalizedQuery.length === 0 ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery);
    return categoryOk && queryOk;
  });

  return categories
    .map((cat) => ({
      id: cat.toLowerCase(),
      title: cat,
      items: filtered.filter((item) => item.category === cat),
    }))
    .filter((section) => section.items.length > 0);
}

export function getFeaturedCollections(locationId: string) {
  const items = getMenuItemsByLocation(locationId);
  return {
    seasonal: items.filter((i) => i.tags?.includes('seasonal')).slice(0, 6),
    bestSellers: items
      .filter((i) => i.tags?.includes('bestSeller') || i.tags?.includes('popular'))
      .slice(0, 6),
    weekendBrunch: items
      .filter((i) => i.tags?.includes('weekend') || i.category === 'Brunch')
      .slice(0, 6),
  };
}

export function getMenuItemById(id: string): BakeryItem | undefined {
  return allItems.find((item) => item.id === id);
}

import type { BakeryItem, BakerySection } from '../../types/menu';

const ALL_LOCATIONS = ['downtown', 'soco', 'east'];

const sections: BakerySection[] = [
  {
    id: 'pastries',
    title: 'Morning Pastries',
    items: [
      {
        id: 'croissant-butter',
        name: 'Cultured Butter Croissant',
        description: 'Laminated daily with Normandy-style cultured butter.',
        price: 4.5,
        image: 'https://images.unsplash.com/photo-1555507036-ab794f4afe5a?auto=format&fit=crop&w=800&q=80',
        category: 'Pastry',
        locationIds: ALL_LOCATIONS,
        tags: ['popular'],
      },
      {
        id: 'kouign-amann',
        name: 'Salted Caramel Kouign-Amann',
        description: 'Caramelized Breton pastry with flaky, buttery layers.',
        price: 5.25,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        category: 'Pastry',
        locationIds: ['downtown', 'soco'],
        tags: ['new'],
      },
      {
        id: 'danish-berry',
        name: 'Roasted Berry Danish',
        description: 'Cream cheese custard, roasted berries, citrus glaze.',
        price: 5.75,
        image: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=800&q=80',
        category: 'Pastry',
        locationIds: ALL_LOCATIONS,
        tags: ['seasonal'],
      },
    ],
  },
  {
    id: 'sourdough',
    title: 'Sourdough Loaves',
    items: [
      {
        id: 'country-loaf',
        name: 'Country Sourdough',
        description: '48-hour fermented loaf with a caramelized crust.',
        price: 9.0,
        image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=800&q=80',
        category: 'Bread',
        locationIds: ALL_LOCATIONS,
        tags: ['popular'],
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
    ],
  },
  {
    id: 'seasonal',
    title: 'Seasonal Pastries',
    items: [
      {
        id: 'honey-cake',
        name: 'Burnt Honey Layer Cake',
        description: 'Whipped mascarpone frosting and candied citrus peel.',
        price: 8.5,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
        category: 'Cake',
        locationIds: ALL_LOCATIONS,
        tags: ['seasonal'],
      },
      {
        id: 'pistachio-rose',
        name: 'Pistachio Rose Slice',
        description: 'Olive oil sponge with rose cream and pistachio praline.',
        price: 8.75,
        image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
        category: 'Cake',
        locationIds: ['downtown', 'soco'],
        tags: ['seasonal'],
      },
      {
        id: 'chocolate-torte',
        name: 'Dark Chocolate Torte',
        description: 'Flourless torte with sea salt ganache and cream.',
        price: 9.25,
        image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80',
        category: 'Cake',
        locationIds: ALL_LOCATIONS,
      },
    ],
  },
  {
    id: 'coffee',
    title: 'Coffee Drinks',
    items: [
      {
        id: 'drip-coffee',
        name: 'House Drip Coffee',
        description: 'Single-origin rotating roast, brewed fresh every hour.',
        price: 3.5,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
        category: 'Coffee',
        locationIds: ALL_LOCATIONS,
        tags: ['popular'],
      },
      {
        id: 'oat-latte',
        name: 'Oat Milk Latte',
        description: 'Double shot espresso with steamed oat milk.',
        price: 5.5,
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
        category: 'Coffee',
        locationIds: ALL_LOCATIONS,
        tags: ['vegan'],
      },
      {
        id: 'cold-brew',
        name: 'Nitro Cold Brew',
        description: 'Slow-steeped 24 hours, served on tap with a creamy head.',
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
    ],
  },
  {
    id: 'savory',
    title: 'Savory Counter',
    items: [
      {
        id: 'focaccia-sandwich',
        name: 'Focaccia Sandwich',
        description: 'Mortadella, provolone, chili crisp aioli, arugula.',
        price: 12.5,
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
        category: 'Savory',
        locationIds: ALL_LOCATIONS,
      },
      {
        id: 'spinach-pie',
        name: 'Spinach & Feta Hand Pie',
        description: 'Buttery pastry packed with spinach, feta, and herbs.',
        price: 7.0,
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80',
        category: 'Savory',
        locationIds: ['soco', 'east'],
        tags: ['vegan'],
      },
    ],
  },
];

const allItems = sections.flatMap((section) => section.items);

export function getMenuSections(): BakerySection[] {
  return sections;
}

export function getMenuItems(): BakeryItem[] {
  return allItems;
}

export function getMenuItemById(id: string): BakeryItem | undefined {
  return allItems.find((item) => item.id === id);
}

export function getMenuItemsByLocation(locationId: string): BakeryItem[] {
  return allItems.filter((item) => item.locationIds.includes(locationId));
}

import type { Location } from '../../types/menu';

export const locations: Location[] = [
  {
    id: 'downtown',
    name: 'Downtown Austin',
    address: '401 Congress Ave, Austin, TX 78701',
    hoursLabel: 'Mon-Sun · 7:00 AM - 8:00 PM',
    isOpenNow: true,
    pickupEtaMins: 12,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'soco',
    name: 'South Congress',
    address: '1608 S Congress Ave, Austin, TX 78704',
    hoursLabel: 'Mon-Sun · 7:30 AM - 7:30 PM',
    isOpenNow: true,
    pickupEtaMins: 16,
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'east',
    name: 'East Austin',
    address: '1209 E 7th St, Austin, TX 78702',
    hoursLabel: 'Mon-Sun · 8:00 AM - 6:00 PM',
    isOpenNow: false,
    pickupEtaMins: 20,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  },
];

export function getLocations(): Location[] {
  return locations;
}

export function getLocationById(id: string | null | undefined): Location | undefined {
  if (!id) return undefined;
  return locations.find((loc) => loc.id === id);
}

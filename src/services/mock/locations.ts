import type { Location } from '../../types/menu';

export const locations: Location[] = [
  {
    id: 'downtown',
    name: 'Downtown Austin',
    address: '401 Congress Ave, Austin, TX 78701',
  },
  {
    id: 'soco',
    name: 'South Congress',
    address: '1608 S Congress Ave, Austin, TX 78704',
  },
  {
    id: 'east',
    name: 'East Austin',
    address: '1209 E 7th St, Austin, TX 78702',
  },
];

export function getLocations(): Location[] {
  return locations;
}

export function getLocationById(id: string): Location | undefined {
  return locations.find((loc) => loc.id === id);
}

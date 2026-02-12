export type BakeryTag =
  | 'popular'
  | 'seasonal'
  | 'vegan'
  | 'new'
  | 'bestSeller'
  | 'weekend';

export type MenuCategory = 'Pastries' | 'Bread' | 'Brunch' | 'Coffee' | 'Gifts';

export type Location = {
  id: string;
  name: string;
  address: string;
  hoursLabel: string;
  isOpenNow: boolean;
  pickupEtaMins: number;
  image: string;
};

export type BakeryItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  locationIds: string[];
  tags?: BakeryTag[];
};

export type BakerySection = {
  id: string;
  title: string;
  items: BakeryItem[];
};

export type BakeryTag = 'popular' | 'seasonal' | 'vegan' | 'new';

export type Location = {
  id: string;
  name: string;
  address: string;
};

export type BakeryItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  locationIds: string[];
  tags?: BakeryTag[];
};

export type BakerySection = {
  id: string;
  title: string;
  items: BakeryItem[];
};

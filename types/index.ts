export type Product = {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  price_minor: number;
  currency: string;
  category: string;
  featured: boolean;
  active: boolean;
  stock: number;
  ingredients: string[];
  benefits: string[];
  image_url: string;
  gallery: string[];
};

export type Bundle = {
  id: string;
  external_key: string;
  slug: string;
  name: string;
  description: string;
  price_minor: number;
  currency: string;
  image_url: string;
  active: boolean;
  stock: number;
};

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price_minor: number;
  currency: string;
  image_url: string;
  quantity: number;
  stock: number;
};

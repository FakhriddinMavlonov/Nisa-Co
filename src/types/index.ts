export type Locale = "en" | "uz" | "no" | "sv" | "es";

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  order: number;
}

export interface ProductSize {
  id: string;
  name: string;
  stock: number;
}

export interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameUz: string;
  nameNo: string;
  nameSv: string;
  nameEs: string;
  description?: string | null;
  image?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameUz: string;
  nameNo: string;
  nameSv: string;
  nameEs: string;
  descriptionEn: string;
  descriptionUz: string;
  descriptionNo: string;
  descriptionSv: string;
  descriptionEs: string;
  price: number;
  currency: string;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  sizes: ProductSize[];
  featured: boolean;
  inStock: boolean;
  seoTitleEn?: string | null;
  seoTitleUz?: string | null;
  seoTitleNo?: string | null;
  seoTitleSv?: string | null;
  seoTitleEs?: string | null;
  seoDescEn?: string | null;
  seoDescUz?: string | null;
  seoDescNo?: string | null;
  seoDescSv?: string | null;
  seoDescEs?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  selectedSize?: string;
  quantity: number;
}

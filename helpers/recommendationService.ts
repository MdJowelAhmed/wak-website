export interface RecommendedProductData {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  category?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
  ratingAverage?: number;
  ratingCount?: number;
  stock?: number;
  status?: string;
  colors?: string[];
  sizes?: string[];
  variants?: unknown[];
  hasVariant?: boolean;
}

export interface RecommendedServiceData {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  image?: string;
  images?: string[];
  category?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
  averageRating?: number;
  ratingAverage?: number;
  bookingsCount?: number;
  ratingCount?: number;
  deliveryTime?: number;
  status?: string;
  creator?: {
    name?: string;
    profileImage?: string;
  };
}

export interface RecommendedProductItem {
  id: string;
  type: "Product";
  score?: number;
  data: RecommendedProductData;
}

export interface RecommendedServiceItem {
  id: string;
  type: "Service";
  score?: number;
  data: RecommendedServiceData;
}

export type RecommendedItem = RecommendedProductItem | RecommendedServiceItem;

export interface RecommendationResponseData {
  source?: "ai_collaborative" | "cold_start_trending" | string;
  items: RecommendedItem[];
}

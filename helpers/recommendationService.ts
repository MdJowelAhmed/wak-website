"use server";

import { myFetch, FetchResponse } from "./myFetch";

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

export interface RecommendationQueryParams {
  limit?: number;
  itemType?: "All" | "Product" | "Service";
  categoryId?: string;
}

export async function getPersonalizedRecommendations(
  params?: RecommendationQueryParams
): Promise<FetchResponse<RecommendationResponseData>> {
  const query = new URLSearchParams();
  if (params?.limit) {
    query.append("limit", String(params.limit));
  }
  if (params?.itemType) {
    query.append("itemType", params.itemType);
  }
  if (params?.categoryId) {
    query.append("categoryId", params.categoryId);
  }
  const queryString = query.toString() ? `?${query.toString()}` : "";
  return await myFetch<RecommendationResponseData>(
    `/recommendations/me${queryString}`,
    {
      cache: "no-store",
    }
  );
}

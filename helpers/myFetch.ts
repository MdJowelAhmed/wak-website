/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAccessToken } from "./getAccessToken";

interface Pagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface FetchResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | null;
  pagination?: Pagination;
  meta?: any;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: any;
  token?: string;
  headers?: Record<string, string>;
  cache?: RequestCache;
  tags?: string[];
  next?: RequestInit["next"];
}

export const nextFetch = async <T = any>(
  url: string,
  {
    method = "GET",
    body,
    tags,
    token,
    headers = {},
    cache,
    next = {},
  }: FetchOptions = {}
): Promise<FetchResponse<T>> => {
  const accessToken = await getAccessToken();
  const isFormData = body instanceof FormData;
  const hasBody = body !== undefined && method !== "GET";

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(token ? { Authorization: `${token}` } : {}),
  };

  try {
    const res = await fetch(`${process.env.BASE_URL}${url}`, {
      method,
      headers: reqHeaders,
      ...(hasBody && {
        body: isFormData ? body : JSON.stringify(body),
      }),
      cache: method === "GET" ? cache : "no-store",
      next: {
        ...next,
        ...(tags && { tags }),
      },
    });

    let json: any = {};
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      json = await res.json();
    }

    if (!res.ok) {
      return {
        success: false,
        message: json?.message || "Request failed",
        data: null as any,
        error: json?.errorMessages || json?.message || `HTTP Error ${res.status}`,
      };
    }

    return {
      success: json?.success ?? true,
      message: json?.message,
      data: json?.data,
      error: null,
      pagination: json?.pagination,
      meta: json?.meta,
    };
  } catch (err) {
    return {
      success: false,
      data: null as any,
      message: "Network error",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

export const myFetch = nextFetch;
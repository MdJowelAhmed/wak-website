/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { getAccessToken } from "./getAccessToken";
import { logServerApi } from "./logServerApi";

async function signalApiDebugToBrowser() {
  try {
    (await cookies()).set("__api_debug_tick", String(Date.now()), {
      path: "/",
      maxAge: 60,
      sameSite: "lax",
    });
  } catch {
    // Server Components cannot set cookies; DevApiLogBridge covers those logs.
  }
}

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
  /** Dev-only. Logs this request's endpoint and response in the terminal and browser console. */
  debug?: boolean;
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
    next,
    debug = false,
  }: FetchOptions = {}
): Promise<FetchResponse<T>> => {
  const isGet = method === "GET";
  const resolvedCache = cache ?? (isGet ? "force-cache" : undefined);
  const resolvedNext =
    next ??
    (isGet && resolvedCache !== "no-store" ? { revalidate: 3600 } : {});
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

  const requestUrl = `${process.env.BASE_URL}${url}`;
  const shouldLog = debug && process.env.NODE_ENV === "development";

  try {
    const res = await fetch(requestUrl, {
      method,
      headers: reqHeaders,
      ...(hasBody && {
        body: isFormData ? body : JSON.stringify(body),
      }),
      cache: isGet ? resolvedCache : "no-store",
      next: {
        ...resolvedNext,
        ...(tags && { tags }),
      },
    });

    let json: any = {};
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      json = await res.json();
    }

    if (!res.ok) {
      const failed = {
        success: false,
        message: json?.message || "Request failed",
        data: null as any,
        error: json?.errorMessages || json?.message || `HTTP Error ${res.status}`,
      };
      if (shouldLog) {
        logServerApi({
          method,
          url: requestUrl,
          status: res.status,
          body: hasBody ? body : undefined,
          response: failed,
        });
        await signalApiDebugToBrowser();
      }
      return failed;
    }

    const ok = {
      success: json?.success ?? true,
      message: json?.message,
      data: json?.data,
      error: null,
      pagination: json?.pagination,
      meta: json?.meta,
    };
    if (shouldLog) {
      logServerApi({
        method,
        url: requestUrl,
        status: res.status,
        body: hasBody ? body : undefined,
        response: ok,
      });
      await signalApiDebugToBrowser();
    }
    return ok;
  } catch (err) {
    const failed = {
      success: false,
      data: null as any,
      message: "Network error",
      error: err instanceof Error ? err.message : "Unknown error",
    };
    if (shouldLog) {
      logServerApi({
        method,
        url: requestUrl,
        body: hasBody ? body : undefined,
        response: failed,
        error: failed.error,
      });
      await signalApiDebugToBrowser();
    }
    return failed;
  }
};

export const myFetch = nextFetch;
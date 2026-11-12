import "server-only";

import type { FetchResponse } from "./myFetch";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const ALLOWED_METHODS: ReadonlySet<string> = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);

interface PublicFetchOptions {
  method?: HttpMethod;
  body?: unknown;
  cache?: RequestCache;
  tags?: string[];
  next?: RequestInit["next"];
}

function buildBackendUrl(path: unknown): string | null {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl || typeof path !== "string") return null;
  if (!path.startsWith("/") || path.startsWith("//")) return null;

  try {
    const target = new URL(`${baseUrl}${path}`);
    return target.origin === new URL(baseUrl).origin ? target.toString() : null;
  } catch {
    return null;
  }
}

function rejectedRequest<T>(): FetchResponse<T> {
  return {
    success: false,
    message: "Invalid request",
    data: null as T,
    error: "Invalid request",
  };
}

/** Server-only GET-friendly fetch that never reads request cookies (safe for static pages). */
export async function publicFetch<T = unknown>(
  url: string,
  { method = "GET", body, cache, tags, next }: PublicFetchOptions = {},
): Promise<FetchResponse<T>> {
  const requestUrl = buildBackendUrl(url);
  if (!requestUrl || !ALLOWED_METHODS.has(method)) {
    return rejectedRequest<T>();
  }

  const isGet = method === "GET";
  const resolvedCache = cache ?? (isGet ? "force-cache" : undefined);
  const resolvedNext =
    next ?? (isGet && resolvedCache !== "no-store" ? { revalidate: 3600 } : {});
  const hasBody = body !== undefined && method !== "GET";

  try {
    const res = await fetch(requestUrl, {
      method,
      headers: {
        Accept: "application/json",
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
      },
      ...(hasBody ? { body: JSON.stringify(body) } : {}),
      cache: isGet ? resolvedCache : "no-store",
      next: {
        ...resolvedNext,
        ...(tags && { tags }),
      },
    });

    let json: Record<string, unknown> = {};
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      json = await res.json();
    }

    if (!res.ok) {
      return {
        success: false,
        message: (json.message as string) || "Request failed",
        data: null as T,
        error: (json.errorMessages as string) || (json.message as string) || `HTTP Error ${res.status}`,
      };
    }

    return {
      success: (json.success as boolean) ?? true,
      message: json.message as string | undefined,
      data: json.data as T,
      error: null,
      pagination: json.pagination as FetchResponse<T>["pagination"],
      meta: json.meta,
    };
  } catch (err) {
    return {
      success: false,
      data: null as T,
      message: "Network error",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

const SENSITIVE_KEY = /token|password|secret|authorization|cookie|otp/i;

function sanitize(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[…]";
  if (Array.isArray(value)) {
    const preview = value.slice(0, 20).map((item) => sanitize(item, depth + 1));
    return value.length > 20 ? [...preview, `…+${value.length - 20}`] : preview;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        SENSITIVE_KEY.test(key) ? "[redacted]" : sanitize(nested, depth + 1),
      ]),
    );
  }
  return value;
}

export type ApiDebugEntry = {
  method: string;
  url: string;
  status?: number;
  body?: unknown;
  response?: unknown;
  error?: unknown;
};

const pendingLogs: ApiDebugEntry[] = [];

function serializeBody(body: unknown): unknown {
  if (body === undefined) return undefined;
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    return { type: "FormData", keys: [...body.keys()] };
  }
  return body;
}

function toEntry(info: {
  method: string;
  url: string;
  status?: number;
  body?: unknown;
  response?: unknown;
  error?: unknown;
}): ApiDebugEntry {
  const body = serializeBody(info.body);
  return {
    method: info.method,
    url: info.url,
    status: info.status,
    ...(body !== undefined ? { body: sanitize(body) } : {}),
    response: sanitize(info.response),
    ...(info.error !== undefined ? { error: info.error } : {}),
  };
}

export function logServerApi(info: {
  method: string;
  url: string;
  status?: number;
  body?: unknown;
  response?: unknown;
  error?: unknown;
}): void {
  if (process.env.NODE_ENV !== "development") return;

  const entry = toEntry(info);
  pendingLogs.push(entry);
  if (pendingLogs.length > 40) pendingLogs.shift();
  console.log("[api]", entry);
}

export function consumeApiDebugLogs(): ApiDebugEntry[] {
  if (process.env.NODE_ENV !== "development") return [];
  return pendingLogs.splice(0, pendingLogs.length);
}

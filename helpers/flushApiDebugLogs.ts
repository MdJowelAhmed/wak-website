"use server";

import { consumeApiDebugLogs, type ApiDebugEntry } from "./logServerApi";

export async function flushApiDebugLogs(): Promise<ApiDebugEntry[]> {
  if (process.env.NODE_ENV !== "development") return [];
  return consumeApiDebugLogs();
}

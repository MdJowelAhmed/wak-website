"use client";

import { useEffect } from "react";
import { flushApiDebugLogs } from "../../helpers/flushApiDebugLogs";
import type { ApiDebugEntry } from "../../helpers/logServerApi";

const TICK_COOKIE = "__api_debug_tick";

function printApiLogs(logs: ApiDebugEntry[]) {
  for (const log of logs) {
    console.log("%c[api]", "color:#0284c7;font-weight:bold", log);
  }
}

function readDebugTick() {
  if (typeof document === "undefined") return "";
  return document.cookie.match(new RegExp(`(?:^|; )${TICK_COOKIE}=([^;]*)`))?.[1] ?? "";
}

export default function DevApiConsole({ logs }: { logs: ApiDebugEntry[] }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    printApiLogs(logs);
  }, [logs]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    let lastTick = readDebugTick();
    let cancelled = false;

    const id = window.setInterval(() => {
      const tick = readDebugTick();
      if (!tick || tick === lastTick) return;
      lastTick = tick;
      flushApiDebugLogs().then((next) => {
        if (!cancelled) printApiLogs(next);
      });
    }, 400);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return null;
}

"use client";

import { Check, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatLabel, orderStatusMessageKey } from "./types";

interface OrderTimelineProps {
  statusLog?: { status: string; timestamp: string; note: string }[];
}

const statusStyles: Record<string, string> = {
  pending: "bg-white/10 text-white/70 border-white/20",
  confirmed: "bg-amber-400/15 text-amber-200 border-amber-300/40",
  in_progress: "bg-blue-400/15 text-blue-200 border-blue-300/40",
  delivered: "bg-primary text-white border-primary shadow-md shadow-primary/30",
  completed: "bg-primary/20 text-primary border-primary/40",
  cancelled: "bg-red-400/15 text-red-200 border-red-300/40",
};

export default function OrderTimeline({ statusLog = [] }: OrderTimelineProps) {
  const t = useTranslations("Orders");
  const locale = useLocale();

  if (!statusLog || statusLog.length === 0) {
    return <div className="py-4 text-sm text-white/60">{t("noMilestones")}</div>;
  }

  return (
    <div className="relative pl-2">
      {statusLog.map((log, index) => {
        const isCancelled = log.status === "cancelled";
        const statusKey = orderStatusMessageKey(log.status);
        const statusLabel = statusKey ? t(statusKey) : formatLabel(log.status);

        return (
          <div key={`${log.status}-${log.timestamp}-${index}`} className="relative flex gap-6 pb-10 last:pb-0">
            {index < statusLog.length - 1 && (
              <div className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-[2px] border-l-2 border-dashed border-white/20" />
            )}

            <div className="relative z-10 shrink-0">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full shadow-md ${
                  isCancelled ? "bg-red-500 shadow-red-500/20" : "bg-primary shadow-primary/20"
                }`}
              >
                {isCancelled ? (
                  <X className="h-4 w-4 text-white stroke-[3]" />
                ) : (
                  <Check className="h-4 w-4 text-white stroke-[3]" />
                )}
              </div>
            </div>

            <div className="flex min-h-[40px] flex-1 items-start justify-between gap-4 pt-1">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {log.note || statusLabel}
                </h4>
                <p className="mt-0.5 text-xs text-white/55">
                  {new Date(log.timestamp).toLocaleString(locale, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <span
                className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold ${
                  statusStyles[log.status] || statusStyles.pending
                }`}
              >
                {statusLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// src/components/(customer-pages)/profile/orders/OrderTimeline.tsx
import { Check, X } from "lucide-react";

interface OrderTimelineProps {
  statusLog?: { status: string; timestamp: string; note: string }[];
}

const statusStyles: Record<string, string> = {
  pending: "bg-zinc-50 text-zinc-500 border-zinc-200",
  confirmed: "bg-amber-50 text-amber-600 border-amber-200",
  in_progress: "bg-blue-50 text-blue-600 border-blue-200",
  delivered: "bg-green-50 text-green-600 border-green-200",
  completed: "bg-purple-50 text-purple-600 border-purple-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

export default function OrderTimeline({ statusLog = [] }: OrderTimelineProps) {
  if (!statusLog || statusLog.length === 0) {
    return <div className="text-sm text-zinc-500 py-4">No milestones recorded yet.</div>;
  }

  return (
    <div className="relative pl-2">
      {statusLog.map((log, index) => {
        const isCancelled = log.status === "cancelled";
        
        return (
          <div key={index} className="relative flex gap-6 pb-10 last:pb-0">
            {/* Vertical dashed line */}
            {index < statusLog.length - 1 && (
              <div className="absolute left-[15px] top-8 w-[2px] h-[calc(100%-24px)] border-l-2 border-dashed border-zinc-200" />
            )}
  
            {/* Circle Badge */}
            <div className="relative z-10 shrink-0">
              <div className={`w-8 h-8 rounded-full ${isCancelled ? "bg-red-500 shadow-red-500/20" : "bg-[#10b981] shadow-emerald-500/20"} flex items-center justify-center shadow-md`}>
                {isCancelled ? (
                  <X className="w-4 h-4 text-white stroke-[3]" />
                ) : (
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                )}
              </div>
            </div>
  
            {/* Milestone Details & Status Badge */}
            <div className="flex-1 flex items-start justify-between min-h-[40px] pt-1 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-zinc-800">
                  {log.note || log.status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
  
              <span
                className={`px-3 py-1 text-[11px] font-bold rounded-full border whitespace-nowrap shrink-0 ${statusStyles[log.status] || statusStyles.pending}`}
              >
                {log.status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

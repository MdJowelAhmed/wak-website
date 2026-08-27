import { cn } from "@/lib/utils";

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardCard({
  children,
  className,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-zinc-200/50 shadow-md p-6 rounded-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}

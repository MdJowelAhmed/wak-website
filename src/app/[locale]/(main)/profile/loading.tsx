import DashboardCard from "@/shared/DashboardCard";

export default function ProfileLoading() {
  return (
    <DashboardCard className="animate-pulse min-h-[500px]">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-7 w-52 bg-zinc-700 rounded" />
        <div className="h-9 w-28 bg-zinc-700 rounded-lg" />
      </div>

      {/* Form fields skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-zinc-700/60 rounded" />
            <div className="h-12 bg-zinc-700/40 rounded-xl" />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

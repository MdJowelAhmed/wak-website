export default function SidebarSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-zinc-200/50 shadow-md animate-pulse">
      {/* Avatar skeleton */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-20 h-20 rounded-full bg-zinc-200" />
        <div className="h-4 w-28 bg-zinc-200 rounded" />
        <div className="h-3 w-36 bg-zinc-200/60 rounded" />
      </div>
 
      {/* Nav items skeleton */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-11 bg-zinc-200/40 rounded-xl"
          />
        ))}
      </div>
 
      {/* Logout skeleton */}
      <div className="mt-auto pt-8">
        <div className="h-11 bg-zinc-200/40 rounded-xl" />
      </div>
    </div>
  );
}

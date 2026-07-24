export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-[2/3] w-full rounded-xl bg-gray-800 animate-pulse"></div>
      <div className="flex flex-col gap-2 px-1 mt-1">
        <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse"></div>
        <div className="h-3 bg-gray-800 rounded w-1/4 animate-pulse"></div>
      </div>
    </div>
  );
}

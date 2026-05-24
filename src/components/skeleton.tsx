"use client";

export function TokenSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-4 p-3.5" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="w-11 h-11 rounded-full skeleton shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-20 skeleton" />
              <div className="h-4 w-16 skeleton" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-16 skeleton" />
              <div className="h-3 w-12 skeleton" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BalanceSkeleton() {
  return (
    <div className="text-center py-4">
      <div className="h-10 w-48 skeleton mx-auto mb-3" />
      <div className="h-4 w-32 skeleton mx-auto" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl p-5 border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl skeleton" />
        <div className="space-y-1.5">
          <div className="h-4 w-24 skeleton" />
          <div className="h-3 w-16 skeleton" />
        </div>
      </div>
      <div className="h-3 w-full skeleton" />
    </div>
  );
}

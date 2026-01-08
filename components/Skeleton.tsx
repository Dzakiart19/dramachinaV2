import React from 'react';

export const Skeleton = ({ className = "" }: { className?: string, key?: any }) => (
  <div className={`bg-zinc-900/50 animate-pulse rounded-md border border-white/5 ${className}`} />
);

export const MovieCardSkeleton = () => (
  <div className="w-full space-y-3">
    <Skeleton className="aspect-[2/3] w-full rounded-xl" />
    <div className="space-y-2 px-1">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2 opacity-50" />
    </div>
  </div>
);

export const PageLoading = () => (
  <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
    <div className="flex flex-col items-center animate-pulse">
      <img src="/logo.png" alt="DZECK" className="w-24 h-24 object-contain mb-8 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]" />
      <h2 className="text-white font-black text-6xl tracking-[0.5em] uppercase drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]">
        DZECK
      </h2>
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  </div>
);

export const PageHeroSkeleton = () => (
  <div className="relative h-[60vh] w-full mb-20">
    <Skeleton className="absolute inset-0 rounded-none" />
    <div className="absolute bottom-10 left-16 max-w-2xl space-y-4">
      <Skeleton className="h-2 w-20" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-10 w-3/4" />
      <div className="flex gap-4 pt-6">
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-12 w-40" />
      </div>
    </div>
  </div>
);

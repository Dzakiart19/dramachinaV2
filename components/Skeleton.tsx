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
    <div className="relative mb-8">
      <div className="w-20 h-20 border-2 border-red-600/20 rounded-full"></div>
      <div className="absolute inset-0 w-20 h-20 border-t-2 border-red-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-zinc-800 rounded-full animate-pulse"></div>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <h2 className="text-white font-black text-2xl tracking-[0.5em] uppercase animate-pulse">DZECK</h2>
      <div className="mt-4 h-0.5 w-32 bg-zinc-900 overflow-hidden rounded-full">
        <div className="h-full bg-red-600 animate-loading-bar origin-left"></div>
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

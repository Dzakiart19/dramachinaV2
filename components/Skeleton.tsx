import React from 'react';

export const Skeleton = ({ className = "" }: { className?: string, key?: any }) => (
  <div className={`bg-zinc-900 animate-pulse rounded-md ${className}`} />
);

export const MovieCardSkeleton = () => (
  <div className="w-full">
    <Skeleton className="aspect-[2/3] w-full mb-3" />
    <Skeleton className="h-3 w-3/4 mb-2" />
    <Skeleton className="h-3 w-1/2" />
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

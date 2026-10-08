import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`shimmer-card rounded-xl ${className}`} />
  );
};

export const CampaignCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/50 bg-surface shadow-sm flex flex-col h-full">
      {/* Image Banner Shimmer */}
      <div className="h-48 shimmer-card relative">
        <div className="absolute top-3 left-3 h-6 w-20 rounded-full bg-white/40 dark:bg-slate-700/50 backdrop-blur-xs" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="h-5 shimmer-card rounded-lg w-4/5" />
          <div className="h-4 shimmer-card rounded-md w-full opacity-80" />
          <div className="h-4 shimmer-card rounded-md w-2/3 opacity-80" />
        </div>

        <div className="space-y-3 pt-2">
          {/* Progress bar */}
          <div className="h-2.5 shimmer-card rounded-full w-full" />

          {/* Stats row */}
          <div className="flex justify-between items-center pt-1">
            <div className="h-4 shimmer-card rounded w-28" />
            <div className="h-4 shimmer-card rounded w-16" />
          </div>

          {/* Bottom row */}
          <div className="flex justify-between items-center pt-3 border-t border-border/30">
            <div className="h-3.5 shimmer-card rounded w-20" />
            <div className="h-3.5 shimmer-card rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CampaignDetailSkeleton: React.FC = () => {
  return (
    <div className="py-8 max-w-7xl mx-auto px-6">
      {/* Category & Badge */}
      <div className="flex gap-3 mb-4">
        <div className="h-6 w-24 shimmer-card rounded-full" />
        <div className="h-6 w-32 shimmer-card rounded-full" />
      </div>

      {/* Title & Description */}
      <div className="h-10 shimmer-card rounded-xl w-3/4 mb-3" />
      <div className="h-5 shimmer-card rounded-lg w-2/3 mb-8 opacity-80" />

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-80 md:h-[440px] shimmer-card rounded-2xl w-full" />
          <div className="h-20 shimmer-card rounded-xl w-full" />
          <div className="h-64 shimmer-card rounded-2xl w-full" />
        </div>
        <div className="lg:col-span-1">
          <div className="h-96 shimmer-card rounded-2xl w-full" />
        </div>
      </div>
    </div>
  );
};

export const UserDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 shimmer-card rounded" />
              <div className="h-5 w-5 shimmer-card rounded-full" />
            </div>
            <div className="h-8 w-32 shimmer-card rounded-lg" />
          </div>
        ))}
      </div>

      {/* Campaigns list shimmer */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-36 shimmer-card rounded-lg" />
          <div className="h-4 w-28 shimmer-card rounded" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-border/40 rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-14 w-20 shimmer-card rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-1/2 shimmer-card rounded" />
                <div className="h-4 w-3/4 shimmer-card rounded opacity-75" />
              </div>
            </div>
            <div className="flex gap-4 pt-1">
              <div className="h-3 w-20 shimmer-card rounded" />
              <div className="h-3 w-20 shimmer-card rounded" />
              <div className="h-3 w-16 shimmer-card rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
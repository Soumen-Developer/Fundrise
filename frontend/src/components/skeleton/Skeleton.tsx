import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent ${className}`}
    />
  );
};

export const CampaignCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/50 bg-surface shadow-sm flex flex-col h-full animate-pulse">
      {/* Image Banner Skeleton */}
      <div className="h-48 bg-slate-200 dark:bg-slate-800 relative">
        <div className="absolute top-3 left-3 h-6 w-20 bg-slate-300 dark:bg-slate-700 rounded-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-4/5" />
          <div className="h-4 bg-slate-200/70 dark:bg-slate-800/70 rounded-md w-full" />
          <div className="h-4 bg-slate-200/70 dark:bg-slate-800/70 rounded-md w-2/3" />
        </div>

        <div className="space-y-3 pt-2">
          {/* Progress bar */}
          <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />

          {/* Stats row */}
          <div className="flex justify-between items-center pt-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
          </div>

          {/* Bottom row */}
          <div className="flex justify-between items-center pt-3 border-t border-border/30">
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-20" />
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CampaignDetailSkeleton: React.FC = () => {
  return (
    <div className="py-8 max-w-7xl mx-auto px-6 animate-pulse">
      {/* Category & Badge */}
      <div className="flex gap-3 mb-4">
        <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>

      {/* Title & Description */}
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4 mb-3" />
      <div className="h-5 bg-slate-200/70 dark:bg-slate-800/70 rounded-lg w-2/3 mb-8" />

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        </div>
        <div className="lg:col-span-1">
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
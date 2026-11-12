import React from "react";

export default function CommunicationCenterLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-surface border border-border rounded-2xl p-6 h-48" />

      {/* Filter Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-10 bg-surface border border-border rounded-2xl w-80" />
        <div className="h-10 bg-surface border border-border rounded-xl w-64" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-64 rounded-2xl bg-surface border border-border"
          />
        ))}
      </div>
    </div>
  );
}

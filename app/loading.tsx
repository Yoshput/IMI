import React from "react";

export default function RootLoading() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 py-8 space-y-6 animate-pulse" aria-busy="true">
      <div className="h-8 w-64 bg-muted rounded-lg" />
      <div className="h-4 w-96 bg-muted/60 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="h-36 bg-surface border border-border rounded-container p-4" />
        <div className="h-36 bg-surface border border-border rounded-container p-4" />
        <div className="h-36 bg-surface border border-border rounded-container p-4" />
      </div>
    </div>
  );
}

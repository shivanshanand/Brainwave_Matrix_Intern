// components/dashboard/DashboardSkeleton.jsx
import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0C] pt-6">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-[#121214] rounded-lg mb-2 animate-pulse"></div>
          <div className="h-4 w-96 bg-[#121214] rounded-lg animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl bg-[#121214] border border-[#26262B] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 bg-[#1E1E22] rounded-xl animate-pulse"></div>
                <div className="h-6 w-16 bg-[#1E1E22] rounded-lg animate-pulse"></div>
              </div>
              <div className="h-4 w-20 bg-[#1E1E22] rounded mb-2 animate-pulse"></div>
              <div className="h-8 w-32 bg-[#1E1E22] rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Period Filter Skeleton */}
        <div className="mb-8">
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-9 w-24 bg-[#121214] rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-80 bg-[#121214] border border-[#26262B] rounded-2xl animate-pulse"></div>
            <div className="h-64 bg-[#121214] border border-[#26262B] rounded-2xl animate-pulse"></div>
          </div>
          <div className="space-y-8">
            <div className="h-48 bg-[#121214] border border-[#26262B] rounded-2xl animate-pulse"></div>
            <div className="h-32 bg-[#121214] border border-[#26262B] rounded-2xl animate-pulse"></div>
          </div>
        </div>

        {/* Recent Transactions Skeleton */}
        <div className="bg-[#121214] border border-[#26262B] rounded-2xl p-6">
          <div className="h-6 w-48 bg-[#1E1E22] rounded mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-12 bg-[#1E1E22] rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;

import React from "react";

const SkeletonCard = () => (
  <div className="w-full bg-[#1c1f26] rounded-xl p-4 mb-4 animate-pulse">
    <div className="h-3 w-16 bg-gray-700 rounded mb-2" />
    <div className="flex justify-between items-center mb-3">
      <div className="h-6 w-16 bg-gray-700 rounded" />
      <div className="h-6 w-20 bg-gray-700 rounded" />
    </div>
    <div className="h-3 w-24 bg-gray-700 rounded mb-1" />
    <div className="h-3 w-32 bg-gray-700 rounded" />
  </div>
);

export default SkeletonCard;

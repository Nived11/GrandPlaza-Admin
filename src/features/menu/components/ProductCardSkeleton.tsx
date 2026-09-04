import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-brand-gold/20 overflow-hidden flex flex-col h-full animate-pulse">
      <div className="aspect-[4/3] bg-brand-cream-soft" />
      <div className="p-4 space-y-4 flex-1">
        <div className="flex gap-2">
          <div className="h-2.5 w-10 bg-slate-200 rounded" />
        </div>
        <div className="h-5 w-3/4 bg-slate-200 rounded" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-200 rounded" />
          <div className="h-3 w-4/5 bg-slate-200 rounded" />
        </div>
        <div className="mt-auto pt-3 border-t border-brand-gold/10">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
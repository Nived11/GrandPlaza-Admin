import React from "react";
import { Edit3, Trash2, ImageIcon, Layers } from "lucide-react";

const ProductCard = ({ item, onEdit, onDelete }: any) => {
  if (!item) return null;

  const isVeg = item?.dietary_preference === "VEG";
  const hasVariants = item?.has_variants && item?.variants?.length > 0;

  const displayOfferPrice = hasVariants ? item.variants[0].offer_price || item.variants[0].actual_price : item?.offer_price || item?.actual_price;
  const displayActualPrice = hasVariants ? item.variants[0].actual_price : item?.actual_price;
  
  return (
    <div className="group bg-white rounded-2xl border border-brand-gold/20 overflow-hidden hover:shadow-xl hover:border-brand-gold/50 transition-all duration-300 flex flex-col h-full relative">
      
      {/* Hover Actions (Top Right over Image) */}
      <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit?.(item)} className="p-2 bg-white/95 backdrop-blur-sm shadow-md text-brand-green-dark rounded-lg hover:bg-brand-gold transition-all">
          <Edit3 size={14} />
        </button>
        <button onClick={() => onDelete?.(item)} className="p-2 bg-white/95 backdrop-blur-sm shadow-md text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream-soft shrink-0 border-b border-brand-gold/10">
        {item?.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-green-dark/20">
            <ImageIcon size={32} />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute bottom-2 left-2 flex gap-1.5">
          <span className="bg-white/95 backdrop-blur-sm text-brand-green-dark text-[9px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-widest border border-brand-gold/20">
            {item?.section || "GENERAL"}
          </span>
          {hasVariants && (
            <span className="bg-brand-green-dark/95 backdrop-blur-sm text-brand-gold text-[9px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-widest flex items-center gap-1 border border-brand-gold">
              <Layers size={10} /> Variants
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-[9px] font-black uppercase tracking-widest ${isVeg ? 'text-green-600' : 'text-red-600'}`}>
            {isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-black text-slate-900 line-clamp-1 mb-1 tracking-tight">{item?.name}</h3>
        <p className="text-[10px] sm:text-xs font-medium text-slate-500 line-clamp-2 mb-3 leading-relaxed">{item?.description || "No description provided."}</p>

        <div className="mt-auto pt-3 border-t border-brand-gold/20">
          <div className="flex items-end justify-between gap-2">
             <div className="flex items-end gap-2">
                {hasVariants && <span className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Starts at</span>}
                <span className="text-lg font-black text-brand-green-dark leading-none">
                  ₹{displayOfferPrice}
                </span>
                {displayOfferPrice !== displayActualPrice && (
                  <span className="text-xs font-semibold text-slate-400 line-through leading-none mb-0.5">
                    ₹{displayActualPrice}
                  </span>
                )}
             </div>
             {!hasVariants && (
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Stock</span>
                  <span className={`text-[10px] font-black ${parseInt(item?.quantity) < 10 ? 'text-amber-500' : 'text-brand-green-dark'}`}>
                    {item?.quantity} Qty
                  </span>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
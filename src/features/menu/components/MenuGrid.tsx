import React from "react";
import ProductCard from "./ProductCard";

const MenuGrid = ({ items, onEdit, onDelete }: any) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item: any) => (
        <ProductCard 
          key={item.id || item.name} 
          item={item} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default MenuGrid;
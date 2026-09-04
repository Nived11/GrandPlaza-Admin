import React from "react";
import { ChevronDown, Search, AlertCircle, EyeOff } from "lucide-react";

const MenuFilters = ({ 
  sections, activeSection, setActiveSection, 
  categories, activeCategory, setActiveCategory,
  searchQuery, setSearchQuery, 
  isLowStock, setIsLowStock,
  showUnavailable, setShowUnavailable
}: any) => (
  <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 w-full">
    
    {/* Search Input */}
    <div className="relative flex-1 lg:max-w-xs">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-green-dark/50" size={16} />
      <input 
        type="text" 
        placeholder="Search items..."
        className="w-full bg-white border border-brand-gold/40 rounded-xl py-3 pl-11 pr-4 text-xs font-bold outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-sm placeholder:text-gray-400 text-brand-green-dark"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    <div className="flex flex-wrap items-center gap-3">
      {/* Section Dropdown */}
      <div className="relative flex-1 sm:min-w-[140px]">
        <select 
          value={activeSection} 
          onChange={(e) => setActiveSection(e.target.value)} 
          className="w-full appearance-none bg-white border border-brand-gold/40 rounded-xl py-3 px-4 text-xs font-bold outline-none shadow-sm text-brand-green-dark"
        >
          {sections.map((sec: string) => <option key={sec} value={sec}>{sec}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-green-dark/50 pointer-events-none" size={14} />
      </div>

      {/* Category Dropdown */}
      <div className="relative flex-1 sm:min-w-[140px]">
        <select 
          value={activeCategory} 
          onChange={(e) => setActiveCategory(e.target.value)} 
          className="w-full appearance-none bg-white border border-brand-gold/40 rounded-xl py-3 px-4 text-xs font-bold outline-none shadow-sm text-brand-green-dark"
        >
          <option value="All">All Categories</option>
          {categories?.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-green-dark/50 pointer-events-none" size={14} />
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={() => setIsLowStock(!isLowStock)}
          className={`cursor-pointer flex-1 sm:flex-none flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition-all shadow-sm ${
            isLowStock ? "bg-brand-green-dark/5 border-brand-green-dark" : "bg-white border-brand-gold/40"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className={isLowStock ? "text-brand-green-dark" : "text-gray-400"} />
            <span className={`text-[10px] font-black uppercase tracking-tight ${isLowStock ? "text-brand-green-dark" : "text-gray-500"}`}>
              Low Stock
            </span>
          </div>
          <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 ${isLowStock ? "bg-brand-green-dark" : "bg-gray-200"}`}>
            <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${isLowStock ? "translate-x-3.5" : "translate-x-0"}`} />
          </div>
        </button>

        <button
          onClick={() => setShowUnavailable(!showUnavailable)}
          className={`cursor-pointer flex-1 sm:flex-none flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition-all shadow-sm ${
            showUnavailable ? "bg-brand-green-dark/5 border-brand-green-dark" : "bg-white border-brand-gold/40"
          }`}
        >
          <div className="flex items-center gap-2">
            <EyeOff size={14} className={showUnavailable ? "text-brand-green-dark" : "text-gray-400"} />
            <span className={`flex items-center text-[10px] font-black uppercase tracking-tight ${showUnavailable ? "text-brand-green-dark" : "text-gray-500"}`}>
              Disabled <span className="hidden sm:block pl-1">Items</span>
            </span>
          </div>
          <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 ${showUnavailable ? "bg-brand-green-dark" : "bg-gray-200"}`}>
            <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${showUnavailable ? "translate-x-3.5" : "translate-x-0"}`} />
          </div>
        </button>
      </div>
    </div>
  </div>
);

export default MenuFilters;
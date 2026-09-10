"use client";

import React, { useState, useRef } from "react";
import { Plus, PackageOpen, RefreshCcw, AlertCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useMenu } from "../hooks/useMenu";
import { useCategory } from "../hooks/useCategory";
import MenuFilters from "./MenuFilters";
import MenuGrid from "./MenuGrid";
import MenuFormModal from "./MenuFormModal";
import ProductCardSkeleton from "./ProductCardSkeleton"; 
import ConfirmModal from "@/components/ui/ConfirmModal";
import { AnimatePresence } from "framer-motion";

const initialFormState = {
  category: "",
  section: "BEST SELLER",
  name: "",
  description: "",
  dietary_preference: "VEG",
  has_variants: false,
  actual_price: "",
  offer_price: "",
  is_available: true,
  variants: [],
  image: null,
  previewUrl: null,
};

const ProductSection = () => {
  const [activeSection, setActiveSection] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  // 🌟 Removed isLowStock state
  const [showUnavailable, setShowUnavailable] = useState(false);

  const { categoryList, fetchCategories } = useCategory();
  
  const { 
    items, totalCount, isLoading, fetching, error, 
    page, setPage, hasNextPage, hasPreviousPage,
    addMenuItem, updateMenuItem, deleteMenuItem
  } = useMenu({ 
    activeSection, activeCategory, searchQuery, showUnavailable 
  });
  
  // Local Form & Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>(initialFormState);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sections = ["All", "BANNER", "COMBO MENU", "BEST SELLER", "TODAY'S SPECIAL", "OTHERS"];

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  // 🌟 Clear All Filters Function
  const handleClearFilters = () => {
    setActiveSection("All");
    setActiveCategory("All");
    setSearchQuery("");
    setShowUnavailable(false);
  };

  const handleOpenAdd = () => {
    if (categoryList.length === 0) fetchCategories();
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    if (categoryList.length === 0) fetchCategories();
    setFormData({
      ...item,
      previewUrl: item.image || null,
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "product") => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file, previewUrl: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    let success = false;
    
    if (editingId) {
      success = await updateMenuItem(editingId, formData);
    } else {
      success = await addMenuItem(formData);
    }

    setActionLoading(false);
    if (success) {
      setIsModalOpen(false);
      resetForm();
    }
  };

  const handleDeleteConfirm = async () => {
    if (confirmDelete) {
      setActionLoading(true);
      await deleteMenuItem(confirmDelete.id);
      setActionLoading(false);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-6 border-t border-brand-gold/20 pt-6 sm:pt-8 min-h-[400px]">
      
      {/* 🟢 HEADER & FILTERS */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-[20px] font-black uppercase tracking-tight text-brand-green-dark">Menu Items</h2>
          {!isLoading && !error && (
            <span className="bg-brand-gold/10 text-brand-green-dark text-[10px] font-black px-2.5 py-1 rounded-full border border-brand-gold/30">
              Total - {totalCount} Items
            </span>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 w-full order-last lg:order-first">
            <MenuFilters 
              sections={sections} 
              activeSection={activeSection} 
              setActiveSection={setActiveSection}
              categories={categoryList} 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery}
              showUnavailable={showUnavailable}
              setShowUnavailable={setShowUnavailable}
              onClearFilters={handleClearFilters} // 🌟 Passed the clear function here
            />
          </div>
          
          <div className="order-first lg:order-last shrink-0">
            <button 
              onClick={handleOpenAdd} 
              className="w-full lg:w-auto cursor-pointer bg-brand-green-dark text-brand-gold border-2 border-brand-gold px-6 py-3 rounded-xl text-[11px] font-black uppercase shadow-md hover:bg-brand-gold hover:text-brand-green-dark transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} strokeWidth={3} /> Add New Item
            </button>
          </div>
        </div>
      </div>

      {/* 🟢 CONTENT GRID */}
      {isLoading && items.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-red-200 bg-red-50 rounded-3xl text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-red-900 font-black uppercase tracking-tight mb-2">{error}</h3>
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 bg-white border border-red-200 px-6 py-3 rounded-xl text-[10px] font-black uppercase shadow-sm hover:bg-red-50 transition-all text-red-600">
            <RefreshCcw size={14} /> Try To Reconnect
          </button>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className={`transition-opacity duration-300 ${fetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <MenuGrid 
              items={items} 
              onEdit={handleEdit} 
              onDelete={(item: any) => setConfirmDelete(item)} 
            />
          </div>

          {/* 🟢 PAGINATION */}
          <div className="flex flex-col items-center justify-center gap-5 py-10 border-t border-brand-gold/20">
            <div className="flex items-center gap-2 md:gap-3">
              <button 
                onClick={() => { setPage(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={page === 1 || fetching}
                className="p-2.5 rounded-xl border border-brand-gold/40 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-brand-green-dark hover:text-brand-gold text-brand-green-dark transition-all cursor-pointer shadow-sm"
              >
                <ChevronsLeft size={16} strokeWidth={2.5} />
              </button>

              <button 
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={!hasPreviousPage || fetching}
                className="p-2.5 rounded-xl border border-brand-gold/40 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-brand-green-dark hover:text-brand-gold text-brand-green-dark transition-all cursor-pointer shadow-sm"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>

              <div className="relative min-w-[120px] flex items-center justify-center bg-brand-green-dark border border-brand-gold px-6 py-2.5 rounded-xl shadow-md">
                {fetching ? (
                  <div className="flex items-center gap-2 text-brand-gold">
                    <RefreshCcw size={12} className="animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Loading</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">
                    Page {page} of {Math.ceil(totalCount / 20) || 1}
                  </span>
                )}
              </div>

              <button 
                onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={!hasNextPage || fetching}
                className="p-2.5 rounded-xl border border-brand-gold/40 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-brand-green-dark hover:text-brand-gold text-brand-green-dark transition-all cursor-pointer shadow-sm"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>

              <button 
                onClick={() => { 
                  const lastPage = Math.ceil(totalCount / 20);
                  setPage(lastPage); 
                  window.scrollTo({ top: 0, behavior: "smooth" }); 
                }}
                disabled={!hasNextPage || fetching}
                className="p-2.5 rounded-xl border border-brand-gold/40 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-brand-green-dark hover:text-brand-gold text-brand-green-dark transition-all cursor-pointer shadow-sm"
              >
                <ChevronsRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-brand-gold/30 rounded-3xl text-center bg-white/50">
          <PackageOpen size={40} className="text-brand-green-dark/40 mb-3 mx-auto" />
          <p className="text-brand-green-dark/60 text-[10px] font-bold uppercase tracking-widest">No products found</p>
        </div>
      )}

      {/* 🟠 FORM MODAL (Dark Theme) */}
      <AnimatePresence>
        {isModalOpen && (
          <MenuFormModal 
            formData={formData} 
            setFormData={setFormData} 
            editingId={editingId}
            categories={categoryList} 
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange} 
            loading={actionLoading}
            onClose={() => { resetForm(); setIsModalOpen(false); }} 
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>

      {/* 🔴 DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Item?"
        description={`Are you sure you want to delete "${confirmDelete?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default ProductSection;
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Plus, Edit2, Trash2, AlertTriangle, RefreshCcw, Image as ImageIcon } from "lucide-react";
import { useCategory } from "../hooks/useCategory"; 
import CategoryForm from "./CategoryForm"; 
import ConfirmModal from "@/components/ui/ConfirmModal"; 

export default function CategoryManager() {
  const { 
    categoryList, loading, actionLoading, error, fetchCategories,
    addCategory, updateCategory, deleteCategory 
  } = useCategory();

  // States
  const [activeCategory, setActiveCategory] = useState<any | null>(null); // For the Click Popup
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null); // For the Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null); // For Confirm Modal

  // Form Handlers
  const openForm = (category: any = null) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = async (data: { name: string; image: File | null }) => {
    if (selectedCategory) {
      return await updateCategory(selectedCategory.id, { 
        name: data.name, 
        image: data.image || selectedCategory.image 
      });
    } else {
      return await addCategory(data);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (confirmDelete) {
      const success = await deleteCategory(confirmDelete.id);
      if (success) {
        setConfirmDelete(null);
      }
    }
  };

  const popupVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* 🟢 HEADER SECTION */}
      <div className="flex items-center justify-between px-2 sm:px-6">
        <h2 className="text-lg sm:text-[20px] font-black uppercase tracking-tight text-slate-900">
          Categories
        </h2>
        <button 
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-white border-2 border-brand-green-dark text-brand-green-dark px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-brand-green-dark hover:border-brand-gold cursor-pointer hover:text-white transition-all shadow-sm"
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      {/* 🔴 ERROR STATE */}
      {error && !categoryList.length && (
        <div className="w-full p-6 rounded-2xl bg-red-50 flex flex-col items-center justify-center text-center">
          <AlertTriangle size={28} className="text-red-500 mb-2" />
          <h3 className="text-xs font-bold text-red-700 uppercase mb-3">{error}</h3>
          <button onClick={() => fetchCategories()} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-red-700 transition-colors">
            <RefreshCcw size={12} /> Retry
          </button>
        </div>
      )}

      {/* 🟡 LOADING STATE */}
      {loading ? (
        <div className="flex gap-4 sm:gap-6 overflow-hidden py-4 px-2 sm:px-6">
          {[1, 2, 3, 4, 5, 6,7,8,9,10,].map((n) => (
            <div key={n} className="flex flex-col items-center gap-2 animate-pulse min-w-fit">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200 border-4 border-white shadow-sm" />
              <div className="h-2.5 w-14 bg-slate-200 rounded-full mt-1" />
            </div>
          ))}
        </div>
      ) : (
        /* 🟢 CATEGORY LIST */
        <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-4 px-2 sm:px-6 select-none">
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
          
          {categoryList.map((cat) => (
            <div 
              key={cat.id} 
              className="group flex flex-col items-center gap-2 min-w-fit relative cursor-pointer"
              onClick={() => setActiveCategory(cat)} // 👈 ക്ലിക്ക് ചെയ്യുമ്പോൾ പോപ്പ്-അപ്പ് വരാൻ
            >
              
              <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full border-[3px] border-white shadow-md overflow-hidden bg-slate-50 transition-all duration-300 group-hover:shadow-lg flex items-center justify-center">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:blur-[1px]" loading="lazy" />
                ) : (
                  <ImageIcon size={24} className="text-slate-300" />
                )}
                
                {/* 👈 Hover Overlay with "CLICK" Text */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">Click</span>
                </div>
              </div>

              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight text-slate-800 text-center max-w-[70px] sm:max-w-[80px] leading-tight line-clamp-2 break-words">
                {cat.name}
              </span>
            </div>
          ))}

          {categoryList.length === 0 && !error && (
            <div className="w-full text-center py-8 text-slate-400 font-medium text-xs">
              No categories found. Click 'Add Category'.
            </div>
          )}
        </div>
      )}

      {/* 🔵 ACTION POPUP (Edit or Delete Modal) */}
      <AnimatePresence>
        {activeCategory && (
          <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveCategory(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            
            <motion.div variants={popupVariants} initial="hidden" animate="visible" exit="exit" className="relative bg-white w-full sm:max-w-xs rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden pb-4 sm:pb-0">
              
              <div className="p-6 text-center border-b border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Manage Category</h4>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{activeCategory.name}</h3>
              </div>
              
              <div className="p-4 space-y-3">
                <button 
                  onClick={() => { openForm(activeCategory); setActiveCategory(null); }} 
                  className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-100"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm text-slate-700"><Edit2 size={16} /></div>
                  <span className="font-black text-[11px] uppercase tracking-widest text-slate-700">Edit Details</span>
                </button>
                
                <button 
                  onClick={() => { setConfirmDelete(activeCategory); setActiveCategory(null); }} 
                  className="w-full flex items-center gap-4 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-50"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm text-red-600"><Trash2 size={16} /></div>
                  <span className="font-black text-[11px] uppercase tracking-widest text-red-600">Delete Category</span>
                </button>
              </div>

              {/* Mobile Cancel Button */}
              <div className="px-4 pb-2 sm:hidden">
                <button onClick={() => setActiveCategory(null)} className="w-full py-3.5 bg-slate-100 text-slate-500 rounded-xl font-bold uppercase text-[10px] tracking-widest">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🟠 ADD / EDIT FORM MODAL */}
      <CategoryForm 
        isOpen={isFormOpen} 
        onClose={closeForm} 
        onSave={handleSaveCategory} 
        initialData={selectedCategory} 
        loading={actionLoading} 
      />

      {/* 🔴 CONFIRM MODAL (Connected to your UI Component) */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category?"
        description={`Are you sure you want to delete "${confirmDelete?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={actionLoading}
      />

    </div>
  );
}
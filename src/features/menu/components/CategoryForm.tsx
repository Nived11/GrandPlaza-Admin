"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, UploadCloud, Edit2, RefreshCcw } from "lucide-react";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; image: File | null }) => Promise<boolean>;
  initialData: any | null;
  loading: boolean;
}

export default function CategoryForm({ isOpen, onClose, onSave, initialData, loading }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setImagePreview(initialData.image || null);
      setImageFile(null);
    } else {
      setName("");
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const success = await onSave({ name, image: imageFile });
    if (success) {
      onClose();
    }
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: 15 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          {/* Backdrop: ലോഡിങ് സമയത്ത് പുറത്ത് ക്ലിക്ക് ചെയ്താൽ ക്ലോസ് ആകില്ല */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => !loading && onClose()} 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          
          <motion.div 
            variants={modalVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            className="relative bg-brand-green-dark w-full max-w-[340px] sm:max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-brand-gold"
          >
            {/* Header */}
            <div className="p-5 text-center relative border-b border-brand-gold/20">
              {/* Close ബട്ടൺ ലോഡിങ് സമയത്ത് ഡിസേബിൾ ആക്കി */}
              <button 
                onClick={onClose} 
                disabled={loading}
                className="absolute right-4 top-4 p-1.5 text-brand-gold hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={16} />
              </button>
              <h3 className="text-sm sm:text-base font-black text-brand-gold uppercase tracking-widest font-serif">
                {initialData ? "Edit Category" : "New Category"}
              </h3>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-2">
                {/* ലോഡിങ് സമയത്ത് ഇമേജ് മാറ്റാനും പറ്റില്ല */}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                  disabled={loading} 
                />
                <div 
                  onClick={() => !loading && fileInputRef.current?.click()}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-dashed border-brand-gold flex flex-col items-center justify-center bg-transparent relative overflow-hidden group shadow-sm transition-colors ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:bg-white/5"}`}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      {!loading && (
                        <div className="absolute inset-0 bg-brand-green-dark/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit2 size={18} className="text-brand-gold" />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <UploadCloud size={24} className="text-brand-gold mb-1 opacity-90" />
                      <span className="text-[9px] font-bold uppercase text-brand-gold tracking-widest text-center px-1 opacity-90">Upload</span>
                    </>
                  )}
                </div>
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-brand-gold ml-1">Category Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  placeholder="e.g. Burgers..."
                  className="w-full px-4 py-3 bg-transparent border border-brand-gold/50 rounded-lg text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-brand-gold transition-all placeholder:text-brand-cream/40 disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                {/* Cancel ബട്ടൺ ലോഡിങ് സമയത്ത് ഡിസേബിൾ ആക്കി */}
                <button 
                  type="button" 
                  onClick={onClose} 
                  disabled={loading}
                  className="flex-1 py-3 border border-brand-gold text-brand-cream rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-brand-gold/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading || !name.trim()}
                  className="flex-1 py-3 bg-brand-gold text-brand-green-dark rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-[#E5C158] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <RefreshCcw size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : initialData ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
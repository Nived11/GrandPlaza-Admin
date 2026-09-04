"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, ChevronDown, X, Loader2, Eye, EyeOff, Plus, Trash2, UploadCloud, Edit2 } from "lucide-react";

const MenuFormModal = ({
  formData, setFormData, onClose, onSubmit, editingId,
  categories, fileInputRef, handleImageChange, loading,
}: any) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const MAX_CHARS = 150;
  const currentChars = formData.description ? formData.description.length : 0;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const stopScrollChange = (e: any) => e.target.blur();

  let isPriceInvalid = false;
  if (formData.has_variants) {
    isPriceInvalid = formData.variants.some((v: any) => v.offer_price && Number(v.offer_price) > Number(v.actual_price));
  } else {
    isPriceInvalid = formData.offer_price && Number(formData.offer_price) > Number(formData.actual_price);
  }

  // 🟢 Custom Theme Classes
  const inputClass = "w-full bg-transparent border border-brand-gold/40 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-brand-gold transition-all placeholder:text-brand-cream/40 disabled:opacity-50";
  const labelClass = "text-[9px] font-black text-brand-gold uppercase tracking-widest ml-1 mb-1.5 block";
  
  const sectionOptions = [
    { label: "Banner", value: "BANNER" },
    { label: "Combo Menu", value: "COMBO MENU" },
    { label: "Best Seller", value: "BEST SELLER" },
    { label: "Today's Special", value: "TODAY'S SPECIAL" },
    { label: "Others", value: "OTHERS" },
  ];

  const handleAddVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { size_name: "", actual_price: "", offer_price: "", quantity: "", is_available: true }] });
  };
  const handleRemoveVariant = (index: number) => {
    setFormData({ ...formData, variants: formData.variants.filter((_: any, i: number) => i !== index) });
  };
  const handleVariantChange = (index: number, field: string, value: any) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = value;
    setFormData({ ...formData, variants: updatedVariants });
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center p-0 md:p-4">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={!loading ? onClose : undefined}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <motion.div
        initial={isMobile ? { y: "100%" } : { opacity: 0, y: 20 }}
        animate={{ y: 0, opacity: 1 }}
        exit={isMobile ? { y: "100%" } : { opacity: 0, y: 20 }}
        className="relative bg-brand-green-dark border border-brand-gold/60 w-full md:max-w-4xl rounded-t-[2rem] md:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] md:max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-brand-gold/20 flex items-center justify-between shrink-0">
          <h2 className="text-base md:text-lg font-black text-brand-gold uppercase tracking-widest font-serif">
            {editingId ? "Edit Menu Item" : "Add New Item"}
          </h2>
          <button disabled={loading} onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-brand-gold disabled:opacity-30">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
          <form id="product-form" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Images & Dietary */}
              <div className="md:col-span-4 space-y-6 md:sticky md:top-0 h-fit">
                
                <AnimatePresence>
                  {formData.section === "BANNER" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5">
                      <label className={labelClass}>Banner Image</label>
                      <div
                        onClick={() => !loading && bannerInputRef.current?.click()}
                        className="relative aspect-[16/6] rounded-xl border border-dashed border-brand-gold bg-transparent flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:bg-white/5 transition-all"
                      >
                        {formData.bannerPreviewUrl ? (
                          <img src={formData.bannerPreviewUrl} className="w-full h-full object-cover" alt="Banner" />
                        ) : (
                          <div className="text-center p-2 opacity-80">
                            <UploadCloud size={20} className="text-brand-gold mx-auto mb-1" />
                            <p className="text-[8px] font-black text-brand-gold uppercase tracking-widest">Banner Image</p>
                          </div>
                        )}
                        <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, "banner")} disabled={loading} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5">
                  <label className={labelClass}>Product Image</label>
                  <div
                    onClick={() => !loading && fileInputRef.current?.click()}
                    className={`relative ${formData.section === "BANNER" ? "aspect-[4/3]" : "aspect-square"} rounded-2xl border border-dashed border-brand-gold bg-transparent flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:bg-white/5 transition-all duration-300`}
                  >
                    {formData.previewUrl ? (
                      <>
                        <img src={formData.previewUrl} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-brand-green-dark/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Edit2 size={24} className="text-brand-gold" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4 opacity-80">
                        <UploadCloud size={32} className="text-brand-gold mx-auto mb-2" />
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Upload Photo</p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, "product")} disabled={loading} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Dietary Type</label>
                  <div className="grid grid-cols-2 p-1 bg-black/20 rounded-xl gap-1 border border-brand-gold/20">
                    <button
                      disabled={loading} type="button"
                      onClick={() => setFormData({ ...formData, dietary_preference: "VEG" })}
                      className={`py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.dietary_preference === "VEG" ? "bg-brand-gold text-brand-green-dark shadow-md" : "text-brand-cream hover:bg-white/10"
                      }`}
                    >Veg</button>
                    <button
                      disabled={loading} type="button"
                      onClick={() => setFormData({ ...formData, dietary_preference: "NON-VEG" })}
                      className={`py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.dietary_preference === "NON-VEG" ? "bg-red-600 text-white shadow-md" : "text-brand-cream hover:bg-white/10"
                      }`}
                    >Non-Veg</button>
                  </div>
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="md:col-span-8 space-y-5">
                
                {/* Toggles */}
                <div className="flex flex-wrap justify-between items-center gap-3 bg-black/10 p-3 rounded-xl border border-brand-gold/10">
                  <div
                    onClick={() => {
                      if (!loading) {
                        setFormData({
                          ...formData, has_variants: !formData.has_variants,
                          actual_price: "", offer_price: "", quantity: "",
                          variants: formData.variants.length === 0 && !formData.has_variants 
                            ? [{ size_name: "", actual_price: "", offer_price: "", quantity: "", is_available: true }] : formData.variants
                        });
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                      formData.has_variants ? "border-brand-gold bg-brand-gold/10" : "border-brand-gold/30"
                    }`}
                  >
                    <div className={`relative w-8 h-4 rounded-full transition-colors ${formData.has_variants ? "bg-brand-gold" : "bg-gray-600"}`}>
                      <div className={`absolute top-0.5 w-3 h-3 bg-brand-green-dark rounded-full transition-all ${formData.has_variants ? "right-0.5" : "left-0.5"}`} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${formData.has_variants ? "text-brand-gold" : "text-gray-400"}`}>
                      Variants Mode
                    </span>
                  </div>

                  <div
                    onClick={() => !loading && setFormData({ ...formData, is_available: !formData.is_available })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                      formData.is_available ? "border-green-500/50 bg-green-500/10" : "border-brand-gold/30"
                    }`}
                  >
                    {formData.is_available ? <Eye size={14} className="text-green-400" /> : <EyeOff size={14} className="text-gray-400" />}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${formData.is_available ? "text-green-400" : "text-gray-400"}`}>
                      {formData.is_available ? "Available" : "Hidden"}
                    </span>
                    <div className={`relative w-8 h-4 rounded-full transition-colors ${formData.is_available ? "bg-green-500" : "bg-gray-600"}`}>
                      <div className={`absolute top-0.5 w-3 h-3 bg-brand-green-dark rounded-full transition-all ${formData.is_available ? "right-0.5" : "left-0.5"}`} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 relative">
                    <label className={labelClass}>Menu Section</label>
                    <select disabled={loading} className={`${inputClass} appearance-none`} required value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })}>
                      {sectionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-brand-green-dark text-white">{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-9 text-brand-gold pointer-events-none" />
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className={labelClass}>Category</label>
                    <select disabled={loading} className={`${inputClass} appearance-none`} required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                      <option value="" className="bg-brand-green-dark text-white">Select Category</option>
                      {categories.map((c: any) => (
                        <option key={c.id} value={c.id} className="bg-brand-green-dark text-white">{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-9 text-brand-gold pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Product Name</label>
                  <input disabled={loading} required placeholder="Enter item name..." className={inputClass} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <label className={labelClass}>Description</label>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${currentChars >= MAX_CHARS ? "text-red-400" : "text-brand-gold/60"}`}>
                      {currentChars} / {MAX_CHARS} Chars
                    </span>
                  </div>
                  <textarea 
                    disabled={loading} required maxLength={MAX_CHARS} placeholder="Short description..." 
                    className={`${inputClass} h-20 resize-none ${currentChars >= MAX_CHARS ? 'border-red-400 focus:border-red-500' : ''}`} 
                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  />
                </div>

                {/* Pricing / Variants */}
                <div>
                  {formData.has_variants ? (
                    <div className="space-y-3 bg-black/10 p-4 rounded-xl border border-brand-gold/20">
                      {formData.variants.map((variant: any, index: number) => {
                        const isVariantPriceInvalid = variant.offer_price && Number(variant.offer_price) > Number(variant.actual_price);
                        return (
                          <div key={index} className="flex flex-col gap-3 p-4 bg-brand-green-dark rounded-xl border border-brand-gold/30 relative group shadow-sm">
                            {formData.variants.length > 1 && (
                              <button type="button" onClick={() => handleRemoveVariant(index)} className="absolute -top-2.5 -right-2.5 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md z-10">
                                <Trash2 size={12} />
                              </button>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[8px] font-bold text-brand-gold uppercase tracking-widest">Size/Name</label>
                                <input disabled={loading} required placeholder="e.g. FULL" className={`${inputClass} !py-2`} value={variant.size_name} onChange={(e) => handleVariantChange(index, "size_name", e.target.value)} />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[8px] font-bold text-brand-gold uppercase tracking-widest">MRP (₹)</label>
                                <input disabled={loading} type="number" min="0" onWheel={stopScrollChange} required placeholder="0" className={`${inputClass} !py-2`} value={variant.actual_price} onChange={(e) => handleVariantChange(index, "actual_price", e.target.value)} />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[8px] font-bold text-brand-gold uppercase tracking-widest">Offer Price (₹)</label>
                                <input disabled={loading} type="number" min="0" onWheel={stopScrollChange} placeholder="0" className={`${inputClass} !py-2 ${isVariantPriceInvalid ? "border-red-400 bg-red-900/20" : ""}`} value={variant.offer_price || ""} onChange={(e) => handleVariantChange(index, "offer_price", e.target.value)} />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[8px] font-bold text-brand-gold uppercase tracking-widest">Stock</label>
                                <input disabled={loading} type="number" min="0" onWheel={stopScrollChange} required placeholder="0" className={`${inputClass} !py-2`} value={variant.quantity} onChange={(e) => handleVariantChange(index, "quantity", e.target.value)} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <button type="button" onClick={handleAddVariant} className="flex w-full justify-center items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-gold border border-brand-gold/40 hover:bg-brand-gold hover:text-brand-green-dark px-2 py-3 rounded-xl transition-colors">
                        <Plus size={14} /> Add Variant
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className={labelClass}>MRP (₹)</label>
                        <input disabled={loading} type="number" min="0" onWheel={stopScrollChange} required={!formData.has_variants} placeholder="0" className={inputClass} value={formData.actual_price} onChange={(e) => setFormData({ ...formData, actual_price: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>Offer Price (₹)</label>
                        <input disabled={loading} type="number" min="0" onWheel={stopScrollChange} placeholder="0" className={`${inputClass} ${isPriceInvalid ? "border-red-400 bg-red-900/20" : ""}`} value={formData.offer_price} onChange={(e) => setFormData({ ...formData, offer_price: e.target.value })} />
                        {isPriceInvalid && <p className="text-[8px] text-red-400 font-black uppercase ml-1 mt-1">Must be less than MRP</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>Stock</label>
                        <input disabled={loading} type="number" min="0" onWheel={stopScrollChange} required={!formData.has_variants} placeholder="0" className={inputClass} value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-brand-gold/20 flex gap-3 bg-black/20 shrink-0">
          <button disabled={loading} type="button" onClick={onClose} className="px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-cream border border-brand-gold/40 hover:bg-white/10 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            disabled={loading || isPriceInvalid}
            form="product-form" type="submit"
            className="flex-1 bg-brand-gold text-brand-green-dark py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg flex items-center justify-center gap-2 hover:bg-[#e5c158] transition-all disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /><span>Saving...</span></>
            ) : (
              <span>{editingId ? "Update Item" : "Save New Item"}</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MenuFormModal;
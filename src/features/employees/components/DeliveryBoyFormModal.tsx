"use client";

import React, { useState, useEffect } from "react";
import { X, Lock, User, Mail, Phone, MapPin, Truck, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<boolean>;
  initialData?: any;
  isLoading?: boolean;
  error?: string | null;
  clearError?: () => void;
}

export default function DeliveryBoyFormModal({ isOpen, onClose, onSubmit, initialData, isLoading = false, error, clearError }: Props) {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    address: "",
    vehicle_number: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (clearError) clearError();
    setPhoneError(null);
    if (initialData) {
      setFormData({
        username: initialData.username || "",
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        email: initialData.email || "",
        phone_number: initialData.phone_number || "",
        password: "",
        address: initialData.address || "",
        vehicle_number: initialData.delivery_profile?.vehicle_number || initialData.vehicle_number || "",
      });
    } else {
      setFormData({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        address: "",
        vehicle_number: "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const cleanValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, phone_number: cleanValue });

    if (cleanValue.length > 0 && cleanValue.length < 10) {
      setPhoneError("Phone number must be exactly 10 digits");
    } else {
      setPhoneError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Phone Number Length
    if (formData.phone_number.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }
    
    // Clean optional fields
    const payload = { ...formData };
    if (!payload.email) delete (payload as any).email;
    if (initialData && !payload.password) delete (payload as any).password;

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  const activeError = phoneError || error;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-brand-green-dark border border-brand-gold/60 rounded-2xl shadow-2xl p-5 sm:p-6 relative space-y-4 my-auto animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-gold/20 pb-3">
          <h3 className="text-base font-serif font-black text-brand-cream uppercase tracking-wider">
            {initialData ? "Edit Delivery Boy" : "Create Delivery Boy"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-brand-green-light/40 text-brand-cream/60 hover:text-brand-cream transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* 🚨 Form Top Error Message */}
        <AnimatePresence>
          {activeError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="w-full p-3 bg-red-950/80 border border-red-500/50 rounded-xl flex items-center gap-2 text-left font-sans">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <p className="text-red-200 text-xs font-semibold leading-snug">{activeError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-3 text-left text-xs font-sans">
          
          {/* USERNAME */}
          <div>
            <label className="font-bold text-brand-gold uppercase tracking-wider block mb-1">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gold/70" />
              <input
                type="text"
                required
                placeholder="kiran_delivery1234"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold outline-none"
              />
            </div>
          </div>

          {/* FIRST & LAST NAME GRID */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-brand-gold uppercase tracking-wider block mb-1">First Name</label>
              <input
                type="text"
                required
                placeholder="Kiran1"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-brand-gold uppercase tracking-wider block mb-1">Last Name</label>
              <input
                type="text"
                required
                placeholder="Kumar"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold outline-none"
              />
            </div>
          </div>

          {/* EMAIL (OPTIONAL) */}
          <div>
            <label className="font-bold text-brand-gold uppercase tracking-wider block mb-1">
              Email <span className="text-brand-cream/40 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gold/70" />
              <input
                type="email"
                placeholder="kiran@empireplaza.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold outline-none"
              />
            </div>
          </div>

          {/* PHONE NUMBER (WITH 10 DIGIT VALIDATION) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-brand-gold uppercase tracking-wider block">Phone Number</label>
              <span className="text-[10px] text-brand-cream/50">{formData.phone_number.length}/10</span>
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gold/70" />
              <input
                type="text"
                required
                maxLength={10}
                placeholder="9876543297"
                value={formData.phone_number}
                onChange={handlePhoneChange}
                className={`w-full pl-10 pr-3 py-2.5 bg-black/40 border ${phoneError ? "border-red-500" : "border-brand-gold/30"} rounded-xl text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold outline-none`}
              />
            </div>
          </div>

          {/* VEHICLE NUMBER */}
          <div>
            <label className="font-bold text-brand-gold uppercase tracking-wider block mb-1">Vehicle Number</label>
            <div className="relative">
              <Truck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gold/70" />
              <input
                type="text"
                required
                placeholder="KL-07-BX-1234"
                value={formData.vehicle_number}
                onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold outline-none"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="font-bold text-brand-gold uppercase tracking-wider block mb-1">
              Password {initialData && <span className="text-brand-cream/40 font-normal lowercase">(leave blank if unchanged)</span>}
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gold/70" />
              <input
                type={showPassword ? "text" : "password"}
                required={!initialData}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-gold/70 hover:text-brand-gold transition cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="font-bold text-brand-gold uppercase tracking-wider block mb-1">Address</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gold/70" />
              <input
                type="text"
                required
                placeholder="Kochi, Ernakulam"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 bg-brand-gold hover:bg-[#d89c28] text-brand-green-dark py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition shadow-xl cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : (initialData ? "Update Delivery Boy" : "Create Delivery Boy")}
          </button>
        </form>
      </div>
    </div>
  );
}
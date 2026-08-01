"use client";

import React from "react";
import { AlertTriangle, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  error?: string | null;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  error,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      {/* Modal Container */}
      <div 
        className="bg-brand-green-dark border border-brand-gold/60 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning / Action Icon */}
        <div className="w-12 h-12 bg-red-950/60 border border-red-500/40 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle size={22} />
        </div>

        {/* Text Details */}
        <div>
          <h3 className="font-serif font-black text-brand-cream text-lg tracking-wide uppercase">
            {title}
          </h3>
          <p className="text-brand-cream/70 text-xs mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        {/* 🚨 ERROR ALERT INSIDE MODAL */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="w-full p-2.5 bg-red-950/80 border border-red-500/50 rounded-xl flex items-center gap-2 text-left font-sans">
                <AlertCircle size={15} className="text-red-400 shrink-0" />
                <p className="text-red-200 text-xs font-semibold leading-snug">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl border border-brand-gold/40 text-brand-cream text-xs font-bold uppercase tracking-wider hover:bg-brand-green-light/40 transition-all cursor-pointer disabled:opacity-50 shadow-xl"
          >
            {cancelText}
          </button>

          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
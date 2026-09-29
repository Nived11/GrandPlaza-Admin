'use client';

import React from 'react';
import { AlertTriangle, Printer, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AutoPrintWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDisable: () => void;
}

export default function AutoPrintWarningModal({
  isOpen,
  onClose,
  onConfirmDisable,
}: AutoPrintWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100 flex flex-col p-6 sm:p-7 space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Warning Icon & Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
            <ShieldAlert size={26} />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 block">
              High Volume Warning
            </span>
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              Turn OFF Kitchen Auto-Print?
            </h3>
          </div>
        </div>

        {/* Warning Message Box */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 text-xs space-y-2 text-amber-950">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="font-bold leading-relaxed">
              Kitchen is in a separate section. Disabling Auto-Print means incoming orders will <u>NOT</u> be printed automatically to the kitchen printer!
            </p>
          </div>
          <p className="text-gray-600 text-[11px] leading-relaxed pl-6">
            In a busy restaurant processing 200–300 orders daily, cooks may not notice incoming orders unless someone manually clicks "Print KOT" for every single order.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Safe Default: Keep ON */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition active:scale-98 cursor-pointer"
          >
            <CheckCircle2 size={16} />
            <span>Keep Auto-Print ON (Recommended)</span>
          </button>

          {/* Confirm OFF */}
          <button
            type="button"
            onClick={() => {
              onConfirmDisable();
              onClose();
            }}
            className="w-full py-2.5 px-5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs transition active:scale-98 cursor-pointer text-center"
          >
            I understand the risk, Turn OFF
          </button>
        </div>
      </div>
    </div>
  );
}

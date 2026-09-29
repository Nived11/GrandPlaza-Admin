'use client';

import React from 'react';
import { X, Printer, ChefHat, Clock, AlertTriangle } from 'lucide-react';
import { AdminOrder } from '../types/orderTypes';

interface KOTReceiptModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  autoTrigger?: boolean;
}

export default function KOTReceiptModal({ order, isOpen, onClose, autoTrigger = false }: KOTReceiptModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  // 🖨️ Auto-trigger window.print() for zero-touch kitchen printing
  React.useEffect(() => {
    if (isOpen && order && autoTrigger) {
      const timer = setTimeout(() => {
        window.print();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, order, autoTrigger]);

  const formattedTime = new Date(order.created_at).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2.5 sm:p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] sm:max-h-[90vh] print:max-w-none print:w-[80mm] print:h-auto print:border-none print:shadow-none print:rounded-none">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ChefHat size={18} className="text-amber-400" />
            <span className="font-bold text-sm tracking-wide">Kitchen Order Ticket (KOT)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Ticket Content (80mm POS style) */}
        <div id="kot-printable-area" className="p-4 sm:p-6 bg-white overflow-y-auto font-mono text-black print:p-2 print:overflow-visible">
          
          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-gray-400 pb-3 mb-3">
            <h2 className="text-lg font-black uppercase tracking-wider">GRAND PLAZA</h2>
            <p className="text-xs font-bold tracking-widest text-gray-700 uppercase">KITCHEN ORDER TICKET (KOT)</p>
          </div>

          {/* Order Details */}
          <div className="border-b border-dashed border-gray-400 pb-3 mb-3 text-xs space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold">ORDER ID:</span>
              <span className="font-black text-base px-2 py-0.5 bg-gray-100 rounded">#{order.id}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span className="flex items-center gap-1">
                <Clock size={12} /> Time:
              </span>
              <span className="font-bold text-gray-900">{formattedTime}, {formattedDate}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Customer:</span>
              <span className="font-semibold text-gray-900">{order.customer_name} ({order.customer_phone})</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Order Type:</span>
              <span className="font-black text-xs uppercase px-1.5 py-0.5 bg-black text-white rounded print:bg-black print:text-white">
                DELIVERY
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-4">
            <div className="grid grid-cols-[48px_1fr] text-xs font-black uppercase border-b-2 border-black pb-1.5 mb-2">
              <span className="text-center">QTY</span>
              <span>ITEM & VARIANT</span>
            </div>

            <div className="space-y-2.5">
              {order.items.map((item, index) => (
                <div key={item.id || index} className="grid grid-cols-[48px_1fr] items-start text-xs border-b border-dashed border-gray-200 pb-2">
                  <div className="text-center">
                    <span className="inline-block font-black text-base bg-slate-900 text-white rounded px-2 py-0.5 print:border print:border-black print:text-black print:bg-transparent">
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase leading-tight text-gray-900">{item.item_name}</p>
                    {item.variant_name && (
                      <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                        Portion: {item.variant_name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions (Crucial for Chef) */}
          {order.special_instructions && (
            <div className="border-2 border-black bg-amber-50 rounded-lg p-2.5 mb-3 print:bg-transparent print:border-2 print:border-black">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 print:text-black uppercase mb-1">
                <AlertTriangle size={14} className="text-amber-700 print:text-black shrink-0" />
                <span>CHEF INSTRUCTIONS:</span>
              </div>
              <p className="text-xs font-black uppercase text-red-700 print:text-black tracking-wide leading-snug">
                "{order.special_instructions}"
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-[10px] text-gray-500 border-t border-dashed border-gray-400 pt-2 uppercase tracking-widest">
            *** PREPARE FRESH & PACK HOT ***
          </div>
        </div>

        {/* Modal Action Buttons (Hidden on print) */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
          >
            <Printer size={15} />
            <span>Print KOT</span>
          </button>
        </div>
      </div>

      {/* Embedded Print CSS to print ONLY the receipt */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #kot-printable-area, #kot-printable-area * {
            visibility: visible;
          }
          #kot-printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            max-width: 80mm;
            margin: 0;
            padding: 4mm;
            font-size: 11pt;
            color: black !important;
            background: white !important;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}

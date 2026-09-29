'use client';

import React from 'react';
import { X, Printer, Receipt, MapPin, Phone } from 'lucide-react';
import { AdminOrder } from '../types/orderTypes';

interface CustomerInvoiceModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerInvoiceModal({ order, isOpen, onClose }: CustomerInvoiceModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

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

  const totalAmount = parseFloat(order.total_price || '0');
  // Delivery fee is flat ₹30 or 0
  const deliveryFee = totalAmount > 0 ? 30 : 0;
  const itemsSubtotal = Math.max(0, totalAmount - deliveryFee);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2.5 sm:p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] sm:max-h-[90vh] print:max-w-none print:w-[80mm] print:h-auto print:border-none print:shadow-none print:rounded-none">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 bg-emerald-950 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-amber-400" />
            <span className="font-bold text-sm tracking-wide">Customer Tax Invoice / Bill</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-900 text-gray-300 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Invoice Content */}
        <div id="invoice-printable-area" className="p-4 sm:p-6 bg-white overflow-y-auto text-black font-sans print:p-2 print:overflow-visible print:font-mono">
          
          {/* Restaurant Header */}
          <div className="text-center border-b border-gray-200 pb-4 mb-4">
            <h1 className="text-xl font-black text-emerald-950 tracking-wider uppercase">GRAND PLAZA RESTAURANT</h1>
            <p className="text-xs text-gray-600 font-medium">Fine Dining & Authentic Delivery</p>
            <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
              <MapPin size={12} /> Central Kitchen, Malappuram, Kerala
            </p>
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Phone size={12} /> +91 98765 43210
            </p>
          </div>

          {/* Invoice Info Bar */}
          <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs space-y-1.5 border border-gray-100 print:bg-transparent print:border-none print:p-0">
            <div className="flex justify-between font-bold text-sm">
              <span>INVOICE #{order.id}</span>
              <span className={`px-2 py-0.5 rounded text-[11px] uppercase font-black ${
                order.payment_status === 'completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {order.payment_status === 'completed' ? 'PAID' : 'COD (COLLECT CASH)'}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Date & Time:</span>
              <span className="font-medium text-gray-900">{formattedDate}, {formattedTime}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Customer:</span>
              <span className="font-semibold text-gray-900">{order.customer_name}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phone:</span>
              <span className="font-semibold text-gray-900">{order.customer_phone}</span>
            </div>
            <div className="text-gray-600 pt-1 border-t border-gray-200/60">
              <span className="font-semibold block text-gray-800">Delivery Address:</span>
              <span className="text-[11px] text-gray-600 break-words">{order.delivery_address}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-gray-900 font-bold uppercase text-gray-700">
                  <th className="py-2 text-left">Item</th>
                  <th className="py-2 text-center w-12">Qty</th>
                  <th className="py-2 text-right w-16">Price</th>
                  <th className="py-2 text-right w-20">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-2">
                      <p className="font-bold text-gray-900">{item.item_name}</p>
                      {item.variant_name && (
                        <span className="text-[10px] text-gray-500 font-medium">
                          ({item.variant_name})
                        </span>
                      )}
                    </td>
                    <td className="py-2 text-center font-bold text-gray-900">{item.quantity}</td>
                    <td className="py-2 text-right text-gray-600">₹{parseFloat(item.unit_price).toFixed(2)}</td>
                    <td className="py-2 text-right font-semibold text-gray-900">₹{parseFloat(item.line_total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bill Calculation */}
          <div className="border-t-2 border-gray-900 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-gray-800">₹{itemsSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charges:</span>
              <span className="font-semibold text-gray-800">
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between items-baseline border-t border-gray-200 pt-2 text-sm font-black text-emerald-950">
              <span>GRAND TOTAL:</span>
              <span className="text-base font-black">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] text-gray-400 mt-6 border-t border-dashed border-gray-300 pt-3">
            <p>Thank you for choosing Grand Plaza!</p>
            <p className="mt-0.5">For inquiries or feedback, contact +91 98765 43210</p>
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
            className="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
          >
            <Printer size={15} />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Embedded Print CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-printable-area, #invoice-printable-area * {
            visibility: visible;
          }
          #invoice-printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            max-width: 80mm;
            margin: 0;
            padding: 4mm;
            font-size: 10pt;
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

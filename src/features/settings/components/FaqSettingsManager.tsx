"use client";

import React, { useState } from "react";
import { FAQItem } from "../api/settingsApi";
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  EyeOff,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface FaqSettingsManagerProps {
  faqs: FAQItem[];
  isLoading: boolean;
  onAddFaq: (data: { question: string; answer: string; is_active?: boolean }) => Promise<boolean>;
  onUpdateFaq: (
    id: number,
    data: Partial<{ question: string; answer: string; is_active: boolean }>
  ) => Promise<boolean>;
  onDeleteFaq: (id: number) => Promise<boolean>;
  onToggleActive: (id: number, currentStatus: boolean) => Promise<void>;
}

export default function FaqSettingsManager({
  faqs,
  isLoading,
  onAddFaq,
  onUpdateFaq,
  onDeleteFaq,
  onToggleActive,
}: FaqSettingsManagerProps) {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: FAQItem) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setIsActive(faq.is_active);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setIsSubmitting(true);
    if (editingFaq) {
      const success = await onUpdateFaq(editingFaq.id, {
        question,
        answer,
        is_active: isActive,
      });
      if (success) setIsModalOpen(false);
    } else {
      const success = await onAddFaq({
        question,
        answer,
        is_active: isActive,
      });
      if (success) setIsModalOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;
    setIsDeleting(true);
    const success = await onDeleteFaq(deleteTargetId);
    setIsDeleting(false);
    if (success) setDeleteTargetId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl border border-brand-gold/20 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-gold/10 pb-4">
          <div>
            <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-brand-green-dark">
              Frequently Asked <span className="text-brand-gold">Questions (FAQs)</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              These Q&A cards appear on the customer help and ordering pages.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-cream border border-brand-gold text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0"
          >
            <Plus size={15} className="text-brand-gold" />
            <span>Add New FAQ</span>
          </button>
        </div>

        {/* FAQs List */}
        {isLoading ? (
          <div className="space-y-3 py-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div className="py-12 text-center text-xs font-bold text-gray-400 bg-brand-gold/5 rounded-2xl border border-brand-gold/20">
            No FAQs added yet. Click &quot;Add New FAQ&quot; to create your first question.
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.id}
                className="p-4 sm:p-5 rounded-2xl border border-brand-gold/20 bg-white hover:border-brand-gold/50 transition-all shadow-xs flex flex-col sm:flex-row items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-brand-gold uppercase">
                      Q{idx + 1}.
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-brand-green-dark">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed pl-5">
                    {faq.answer}
                  </p>
                </div>

                {/* Actions & Status Pill */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Status Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleActive(faq.id, faq.is_active)}
                    title={faq.is_active ? "Deactivate FAQ" : "Activate FAQ"}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                      faq.is_active
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                        : "bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {faq.is_active ? (
                      <>
                        <Eye size={10} className="text-emerald-600" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={10} className="text-gray-400" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(faq)}
                    className="p-2 rounded-xl text-brand-green-dark hover:bg-brand-gold/20 transition-all cursor-pointer shadow-xs border border-brand-gold/20"
                    title="Edit FAQ"
                  >
                    <Edit2 size={13} />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(faq.id)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-all cursor-pointer shadow-xs border border-rose-200"
                    title="Delete FAQ"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white border border-brand-gold/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-brand-green-dark px-6 py-4 flex items-center justify-between border-b border-brand-gold/30">
              <span className="font-serif font-black text-sm uppercase tracking-wider text-brand-cream">
                {editingFaq ? "Edit FAQ" : "Add New FAQ"}
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-cream/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
                  Question
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. How long will delivery take?"
                  className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
                  Answer
                </label>
                <textarea
                  required
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="e.g. Standard delivery takes 30-45 minutes depending on location..."
                  className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl p-4 text-xs font-medium text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="faq-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-green-dark accent-brand-green-dark cursor-pointer"
                />
                <label htmlFor="faq-active" className="text-xs font-bold text-brand-green-dark cursor-pointer">
                  Visible to public customers
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-cream border border-brand-gold text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-brand-gold" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingFaq ? "Update FAQ" : "Create FAQ"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete FAQ"
        description="Are you sure you want to permanently delete this FAQ? It will no longer appear on the customer help section."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}

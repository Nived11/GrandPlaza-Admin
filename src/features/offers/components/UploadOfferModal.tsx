"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Flame, Sparkles, Tag, FileText, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { OfferBanner, createOfferBannerApi, updateOfferBannerApi } from "../api/offersApi";
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

interface UploadOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingBanner?: OfferBanner | null;
}

export default function UploadOfferModal({
  isOpen,
  onClose,
  onSuccess,
  editingBanner,
}: UploadOfferModalProps) {
  const isEditing = Boolean(editingBanner);

  const [title, setTitle] = useState("Up to 40% OFF");
  const [subtitle, setSubtitle] = useState("Midnight feast on selected items");
  const [badgeText, setBadgeText] = useState("Late Night Special");
  const [isActive, setIsActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingBanner) {
      setTitle(editingBanner.title || "");
      setSubtitle(editingBanner.subtitle || "");
      setBadgeText(editingBanner.badge_text || editingBanner.badgeText || "");
      setIsActive(Boolean(editingBanner.is_active ?? editingBanner.isActive));
      setPreviewUrl(editingBanner.image || editingBanner.imageUrl || null);
      setSelectedFile(null);
    } else {
      setTitle("Up to 40% OFF");
      setSubtitle("Midnight feast on selected items");
      setBadgeText("Late Night Special");
      setIsActive(true);
      setPreviewUrl("https://grandeplaza.com/offers-banner.jpg");
      setSelectedFile(null);
    }
  }, [editingBanner, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing && !selectedFile) {
      toast.error("Please choose a poster banner image!");
      return;
    }

    if (!title.trim()) {
      toast.error("Please provide an offer title (e.g. Up to 40% OFF)!");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("subtitle", subtitle.trim());
      formData.append("badge_text", badgeText.trim());
      formData.append("is_active", String(isActive));

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (isEditing && editingBanner) {
        await updateOfferBannerApi(editingBanner.id, formData);
        toast.success("Offer banner updated successfully!");
      } else {
        await createOfferBannerApi(formData);
        toast.success(
          isActive
            ? "New offer poster uploaded and activated live on website!"
            : "New offer poster saved to library!"
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error saving banner:", err);
      toast.error(extractErrorMessages(err) || "Failed to save offer poster.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white border border-brand-gold/40 rounded-3xl p-5 sm:p-7 w-full max-w-xl shadow-2xl space-y-5 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-brand-gold/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-green-dark border border-brand-gold flex items-center justify-center text-brand-gold shadow-sm">
              <Flame size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif font-black text-brand-green-dark text-base sm:text-lg tracking-tight uppercase">
                {isEditing ? "Edit Offer Poster" : "Add New Offer Poster"}
              </h3>
              <p className="text-[11px] text-gray-500 font-medium">
                Upload banner images and switch them live on the customer site with 1 click.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Live Card Preview */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-brand-green-dark flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon size={13} className="text-brand-gold" />
              Customer Website Live Card Preview
            </span>
            <span className="text-gray-400 font-normal">How it will look on homepage</span>
          </label>

          <div className="relative overflow-hidden rounded-2xl border border-brand-gold/30 bg-[#0d1f18] min-h-[140px] flex items-center shadow-inner">
            <img
              src={previewUrl || "https://grandeplaza.com/offers-banner.jpg"}
              alt="Preview"
              className="absolute inset-0 h-full w-full object-cover object-[85%_35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-transparent sm:via-black/60" />

            <div className="relative z-10 p-4 sm:p-5 w-[85%] sm:w-[70%] space-y-1">
              {badgeText && (
                <div className="inline-flex items-center gap-1 rounded-full bg-brand-gold/20 border border-brand-gold/40 px-2 py-0.5">
                  <Flame className="w-2.5 h-2.5 text-brand-gold" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-brand-gold">
                    {badgeText}
                  </span>
                </div>
              )}
              <h4 className="text-white text-base sm:text-lg font-serif font-black leading-tight drop-shadow-sm">
                {title || "Up to 40% OFF"}
              </h4>
              {subtitle && (
                <p className="text-gray-200 text-[10px] sm:text-[11px] font-medium leading-snug line-clamp-2">
                  {subtitle}
                </p>
              )}
              <div className="pt-1">
                <span className="inline-block rounded-md bg-brand-gold px-2.5 py-1 text-[8px] font-black uppercase text-[#0d1f18]">
                  View Offers →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Picker */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-brand-green-dark flex items-center gap-1.5">
              <Upload size={13} className="text-brand-gold" />
              <span>Poster Banner Image {isEditing ? "(Leave blank to keep existing)" : "*"}</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-brand-gold/40 hover:border-brand-gold bg-brand-gold/5 rounded-2xl cursor-pointer transition-all text-xs font-bold text-brand-green-dark">
                <Upload size={16} className="text-brand-gold" />
                <span>{selectedFile ? selectedFile.name : isEditing ? "Choose New Image" : "Select Poster Photo (16:9 / Landscape)"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 shrink-0">
                  <CheckCircle2 size={14} /> Ready
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Offer Headline */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-brand-green-dark flex items-center gap-1.5">
                <Tag size={13} className="text-brand-gold" />
                <span>Offer Headline *</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Up to 40% OFF"
                required
                className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-3.5 py-2.5 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            {/* Badge Text */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-brand-green-dark flex items-center gap-1.5">
                <Sparkles size={13} className="text-brand-gold" />
                <span>Badge Label</span>
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. Late Night Special"
                className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-3.5 py-2.5 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            {/* Subtitle (Full width) */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-brand-green-dark flex items-center gap-1.5">
                <FileText size={13} className="text-brand-gold" />
                <span>Subtitle / Description</span>
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Midnight feast on selected items"
                className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-3.5 py-2.5 text-xs font-medium text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
              />
            </div>
          </div>

          {/* Active status checkbox */}
          <div className="bg-brand-cream/50 p-3 rounded-xl border border-brand-gold/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase text-brand-green-dark">Set as Live Active Poster</p>
              <p className="text-[10px] text-gray-500">
                Immediately display this poster on the customer website homepage.
              </p>
            </div>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-gold/15">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-cream border border-brand-gold text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin text-brand-gold" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? "Update Poster" : "Upload & Save Poster"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { SiteSettings } from "../api/settingsApi";
import {
  Utensils,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Save,
  Loader2,
  Banknote,
  Power,
  Flame,
  Sparkles,
  Tag,
  Image as ImageIcon,
  Upload,
  X,
  CheckCircle2,
} from "lucide-react";

interface GeneralSettingsFormProps {
  settings: SiteSettings;
  onSave: (data: Partial<SiteSettings> | FormData) => Promise<boolean>;
  isSaving: boolean;
}

export default function GeneralSettingsForm({
  settings,
  onSave,
  isSaving,
}: GeneralSettingsFormProps) {
  const [formData, setFormData] = useState({
    restaurant_name: settings.restaurant_name || "",
    email_address: settings.email_address || "",
    phone_number: settings.phone_number || "",
    physical_address: settings.physical_address || "",
    footer_description: settings.footer_description || "",
    working_hours_mon_sat: settings.working_hours_mon_sat || "",
    working_hours_sunday: settings.working_hours_sunday || "",
    is_cod_enabled: Boolean(settings.is_cod_enabled ?? settings.isCodEnabled),
    offer_title: settings.offer_title ?? settings.offerTitle ?? "Up to 40% OFF",
    offer_subtitle: settings.offer_subtitle ?? settings.offerSubtitle ?? "Midnight feast on selected items",
    offer_badge_text: settings.offer_badge_text ?? settings.offerBadgeText ?? "Late Night Special",
    is_offer_card_active: Boolean(settings.is_offer_card_active ?? settings.isOfferCardActive ?? true),
  });

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    settings.offer_banner_image ?? settings.offerBannerImage ?? null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
    }
  };

  const handleResetImage = () => {
    setSelectedImageFile(null);
    setPreviewUrl(settings.offer_banner_image ?? settings.offerBannerImage ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImageFile) {
      const submitData = new FormData();
      submitData.append("restaurant_name", formData.restaurant_name);
      submitData.append("email_address", formData.email_address);
      submitData.append("phone_number", formData.phone_number);
      submitData.append("physical_address", formData.physical_address);
      submitData.append("footer_description", formData.footer_description);
      submitData.append("working_hours_mon_sat", formData.working_hours_mon_sat);
      submitData.append("working_hours_sunday", formData.working_hours_sunday);
      submitData.append("is_cod_enabled", String(formData.is_cod_enabled));
      submitData.append("offer_title", formData.offer_title);
      submitData.append("offer_subtitle", formData.offer_subtitle);
      submitData.append("offer_badge_text", formData.offer_badge_text);
      submitData.append("is_offer_card_active", String(formData.is_offer_card_active));
      submitData.append("offer_banner_image", selectedImageFile);
      await onSave(submitData);
    } else {
      await onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-3xl border border-brand-gold/20 p-5 sm:p-7 shadow-sm space-y-6">
        <div className="border-b border-brand-gold/10 pb-4">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-brand-green-dark">
            Restaurant <span className="text-brand-gold">Identity & Contact</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            These details are displayed across the customer website, header, and invoice receipts.
          </p>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Restaurant Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <Utensils size={13} className="text-brand-gold" />
              <span>Restaurant Name</span>
            </label>
            <input
              type="text"
              name="restaurant_name"
              value={formData.restaurant_name}
              onChange={handleChange}
              placeholder="e.g. Empire Plaza"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <Mail size={13} className="text-brand-gold" />
              <span>Public Email Address</span>
            </label>
            <input
              type="email"
              name="email_address"
              value={formData.email_address}
              onChange={handleChange}
              placeholder="e.g. contact@empireplaza.in"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <Phone size={13} className="text-brand-gold" />
              <span>Contact Hotline Phone</span>
            </label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="e.g. +91 484 401 2020"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>

          {/* Physical Address */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <MapPin size={13} className="text-brand-gold" />
              <span>Physical Address</span>
            </label>
            <input
              type="text"
              name="physical_address"
              value={formData.physical_address}
              onChange={handleChange}
              placeholder="e.g. Kakkanad, Ernakulam, Kerala 682030"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>

          {/* Footer Description */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <FileText size={13} className="text-brand-gold" />
              <span>Website Footer Description</span>
            </label>
            <textarea
              name="footer_description"
              rows={3}
              value={formData.footer_description}
              onChange={handleChange}
              placeholder="Brief tagline or description of the restaurant shown in footer..."
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl p-4 text-xs font-medium text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs leading-relaxed"
            />
          </div>

          {/* Weekday Hours Mon-Sat */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <Calendar size={13} className="text-brand-gold" />
              <span>Display Hours (Mon - Sat)</span>
            </label>
            <input
              type="text"
              name="working_hours_mon_sat"
              value={formData.working_hours_mon_sat}
              onChange={handleChange}
              placeholder="e.g. 10:00 AM - 11:00 PM"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>

          {/* Sunday Hours */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <Calendar size={13} className="text-brand-gold" />
              <span>Display Hours (Sunday)</span>
            </label>
            <input
              type="text"
              name="working_hours_sunday"
              value={formData.working_hours_sunday}
              onChange={handleChange}
              placeholder="e.g. 11:00 AM - 11:30 PM"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>
        </div>

        {/* 🌟 PROMOTIONAL OFFER BANNER (HOMEPAGE) */}
        <div className="border-t border-brand-gold/10 pt-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs sm:text-base font-black uppercase tracking-tight text-brand-green-dark flex items-center gap-2">
                <Flame size={17} className="text-amber-500 animate-pulse" />
                <span>Homepage <span className="text-brand-gold">Promotional Offer Banner</span></span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Change the offer headline, description, and visibility shown on the customer website homepage.
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                formData.is_offer_card_active
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}>
                {formData.is_offer_card_active ? "Banner Active" : "Banner Hidden"}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    is_offer_card_active: !formData.is_offer_card_active,
                  })
                }
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.is_offer_card_active ? "bg-emerald-600" : "bg-gray-300"
                }`}
                title="Toggle Offer Banner"
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                    formData.is_offer_card_active ? "translate-x-8 text-emerald-600" : "translate-x-0 text-gray-400"
                  }`}
                >
                  <Power size={13} strokeWidth={2.5} />
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Offer Title (e.g. Up to 40% OFF) */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
                <Tag size={13} className="text-brand-gold" />
                <span>Offer Headline (e.g. Up to 40% OFF)</span>
              </label>
              <input
                type="text"
                name="offer_title"
                value={formData.offer_title}
                onChange={handleChange}
                placeholder="e.g. Up to 40% OFF or Flat 30% OFF"
                className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
              />
            </div>

            {/* Badge Label (e.g. Late Night Special) */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
                <Sparkles size={13} className="text-brand-gold" />
                <span>Badge Text</span>
              </label>
              <input
                type="text"
                name="offer_badge_text"
                value={formData.offer_badge_text}
                onChange={handleChange}
                placeholder="e.g. Late Night Special or Weekend Deal"
                className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
              />
            </div>

            {/* Offer Subtitle (Full width) */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
                <FileText size={13} className="text-brand-gold" />
                <span>Offer Subtitle / Description</span>
              </label>
              <input
                type="text"
                name="offer_subtitle"
                value={formData.offer_subtitle}
                onChange={handleChange}
                placeholder="e.g. Midnight feast on selected items"
                className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-medium text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
              />
            </div>

            {/* Poster Banner Image Upload & Live Preview */}
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
                <ImageIcon size={13} className="text-brand-gold" />
                <span>Offer Poster Image (Homepage Banner)</span>
              </label>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-brand-gold/5 p-4 rounded-2xl border border-brand-gold/20">
                {/* Live Preview on Left */}
                <div className="lg:col-span-7">
                  <p className="text-[10px] font-bold text-gray-500 mb-1.5 flex items-center justify-between">
                    <span>Card Live Preview (Customer Homepage):</span>
                    {previewUrl ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 size={11} /> Custom Banner Set
                      </span>
                    ) : (
                      <span className="text-gray-400">Default Feast Banner Active</span>
                    )}
                  </p>

                  <div className="relative overflow-hidden rounded-xl border border-brand-gold/30 bg-[#0d1f18] min-h-[140px] flex items-center">
                    {/* Background Image */}
                    <img
                      src={previewUrl || "https://grandeplaza.com/offers-banner.jpg"}
                      alt="Offer Banner Preview"
                      className="absolute inset-0 h-full w-full object-cover object-[85%_35%]"
                    />
                    {/* Dark gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />

                    {/* Preview Overlay Text */}
                    <div className="relative z-10 p-4 w-[80%] space-y-1">
                      {formData.offer_badge_text && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-brand-gold/20 border border-brand-gold/40 px-2 py-0.5">
                          <Flame className="w-2.5 h-2.5 text-brand-gold" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-brand-gold">
                            {formData.offer_badge_text}
                          </span>
                        </div>
                      )}
                      <h4 className="text-white text-base font-serif font-black leading-tight drop-shadow-sm">
                        {formData.offer_title || "Up to 40% OFF"}
                      </h4>
                      {formData.offer_subtitle && (
                        <p className="text-gray-200 text-[10px] font-medium leading-snug line-clamp-1">
                          {formData.offer_subtitle}
                        </p>
                      )}
                      <div className="pt-1">
                        <span className="inline-block rounded-md bg-brand-gold px-2 py-0.5 text-[8px] font-black uppercase text-[#0d1f18]">
                          View Offers →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Controls on Right */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="text-xs text-gray-600">
                    <p className="font-semibold text-brand-green-dark text-[11px]">Upload Custom Offer Poster</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Recommended: 1200×600 or 16:9 ratio landscape food image. PNG, JPG or WEBP.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-green-dark border border-brand-gold/50 text-[11px] font-black uppercase tracking-wider cursor-pointer transition-all shadow-xs">
                      <Upload size={13} className="text-brand-green-dark" />
                      <span>{previewUrl ? "Change Poster" : "Choose Poster"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    {selectedImageFile && (
                      <button
                        type="button"
                        onClick={handleResetImage}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition-all cursor-pointer"
                        title="Cancel selected image"
                      >
                        <X size={12} />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>

                  {selectedImageFile && (
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 size={12} />
                      <span className="truncate">Selected: {selectedImageFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods & Checkout Configuration */}
        <div className="border-t border-brand-gold/10 pt-5 space-y-4">
          <div>
            <h3 className="text-xs sm:text-base font-black uppercase tracking-tight text-brand-green-dark flex items-center gap-2">
              <Banknote size={17} className="text-brand-gold" />
              <span>Payment Methods & <span className="text-brand-gold">Checkout Policy</span></span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Control whether Cash on Delivery (COD) is permitted during customer checkout.
            </p>
          </div>

          <div className="bg-brand-cream/40 rounded-2xl p-4 sm:p-5 border border-brand-gold/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-brand-green-dark">Cash on Delivery (COD)</span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  formData.is_cod_enabled
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}>
                  {formData.is_cod_enabled ? "COD Allowed" : "COD Disabled (Prepaid Only)"}
                </span>
              </div>
              <p className="text-xs text-gray-600 max-w-xl leading-relaxed">
                When disabled (recommended), customers can only pay online via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, or NetBanking. COD is completely hidden in the customer checkout app.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_cod_enabled: !formData.is_cod_enabled })}
              className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.is_cod_enabled ? "bg-emerald-600" : "bg-gray-300"
              }`}
              title="Toggle Cash on Delivery"
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                  formData.is_cod_enabled ? "translate-x-8 text-emerald-600" : "translate-x-0 text-gray-400"
                }`}
              >
                <Power size={13} strokeWidth={2.5} />
              </span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-brand-gold/10">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-cream border border-brand-gold text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={15} className="animate-spin text-brand-gold" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save size={15} className="text-brand-gold" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

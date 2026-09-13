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
} from "lucide-react";

interface GeneralSettingsFormProps {
  settings: SiteSettings;
  onSave: (data: Partial<SiteSettings>) => Promise<boolean>;
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
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
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

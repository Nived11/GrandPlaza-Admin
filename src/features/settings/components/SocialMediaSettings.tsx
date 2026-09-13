"use client";

import React, { useState } from "react";
import { SiteSettings } from "../api/settingsApi";
import {
  Share2,
  MessageCircle,
  Save,
  Loader2,
  ExternalLink,
} from "lucide-react";

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5 text-pink-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-3.5 h-3.5 text-sky-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

interface SocialMediaSettingsProps {
  settings: SiteSettings;
  onSave: (data: Partial<SiteSettings>) => Promise<boolean>;
  isSaving: boolean;
}

export default function SocialMediaSettings({
  settings,
  onSave,
  isSaving,
}: SocialMediaSettingsProps) {
  const [formData, setFormData] = useState({
    instagram_url: settings.instagram_url || "",
    facebook_url: settings.facebook_url || "",
    twitter_url: settings.twitter_url || "",
    whatsapp_url: settings.whatsapp_url || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            Social Media <span className="text-brand-gold">Links & Channels</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Connect your customer-facing social media handles shown in the website header and footer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Instagram */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
                <InstagramIcon />
                <span>Instagram Profile URL</span>
              </label>
              {formData.instagram_url && (
                <a
                  href={formData.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-brand-green-dark hover:text-brand-gold flex items-center gap-0.5"
                >
                  <span>Test</span>
                  <ExternalLink size={9} />
                </a>
              )}
            </div>
            <input
              type="url"
              name="instagram_url"
              value={formData.instagram_url}
              onChange={handleChange}
              placeholder="https://instagram.com/empireplaza"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>

          {/* Facebook */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
                <FacebookIcon />
                <span>Facebook Page URL</span>
              </label>
              {formData.facebook_url && (
                <a
                  href={formData.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-brand-green-dark hover:text-brand-gold flex items-center gap-0.5"
                >
                  <span>Test</span>
                  <ExternalLink size={9} />
                </a>
              )}
            </div>
            <input
              type="url"
              name="facebook_url"
              value={formData.facebook_url}
              onChange={handleChange}
              placeholder="https://facebook.com/empireplaza"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>

          {/* Twitter / X */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
                <TwitterIcon />
                <span>Twitter / X Profile URL</span>
              </label>
              {formData.twitter_url && (
                <a
                  href={formData.twitter_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-brand-green-dark hover:text-brand-gold flex items-center gap-0.5"
                >
                  <span>Test</span>
                  <ExternalLink size={9} />
                </a>
              )}
            </div>
            <input
              type="url"
              name="twitter_url"
              value={formData.twitter_url}
              onChange={handleChange}
              placeholder="https://x.com/empireplaza"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
                <MessageCircle size={14} className="text-emerald-600" />
                <span>WhatsApp Direct Link / Number</span>
              </label>
              {formData.whatsapp_url && (
                <a
                  href={formData.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-brand-green-dark hover:text-brand-gold flex items-center gap-0.5"
                >
                  <span>Test</span>
                  <ExternalLink size={9} />
                </a>
              )}
            </div>
            <input
              type="text"
              name="whatsapp_url"
              value={formData.whatsapp_url}
              onChange={handleChange}
              placeholder="https://wa.me/919565658446"
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
                <span>Saving Links...</span>
              </>
            ) : (
              <>
                <Save size={15} className="text-brand-gold" />
                <span>Save Social Links</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

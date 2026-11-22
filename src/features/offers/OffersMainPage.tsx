"use client";

import React, { useState, useEffect, useCallback } from "react";
import OffersHeader from "./components/OffersHeader";
import OfferBannerCard from "./components/OfferBannerCard";
import UploadOfferModal from "./components/UploadOfferModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  OfferBanner,
  getOfferBannersApi,
  activateOfferBannerApi,
  deleteOfferBannerApi,
  toggleGlobalOfferCardApi,
} from "./api/offersApi";
import { getSiteSettingsApi } from "@/features/settings/api/settingsApi";
import { Flame, Sparkles, Plus, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

export default function OffersMainPage() {
  const [banners, setBanners] = useState<OfferBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activatingId, setActivatingId] = useState<number | null>(null);
  const [isGlobalActive, setIsGlobalActive] = useState(true);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<OfferBanner | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch banners & site setting status
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bannersData, settingsData] = await Promise.all([
        getOfferBannersApi(),
        getSiteSettingsApi(),
      ]);
      setBanners(bannersData || []);
      if (settingsData) {
        setIsGlobalActive(
          Boolean(settingsData.is_offer_card_active ?? settingsData.isOfferCardActive ?? true)
        );
      }
    } catch (err: any) {
      console.error("Error fetching offer banners:", err);
      toast.error(extractErrorMessages(err) || "Failed to load offer banners.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Single-Click Activate
  const handleActivate = async (id: number) => {
    setActivatingId(id);
    try {
      const res = await activateOfferBannerApi(id, "activate");
      toast.success(res.message || "Banner activated successfully!");
      // Update local state: mark this one active, all others inactive
      setBanners((prev) =>
        prev.map((b) => ({
          ...b,
          is_active: b.id === id,
          isActive: b.id === id,
        }))
      );
    } catch (err: any) {
      console.error("Error activating banner:", err);
      toast.error(extractErrorMessages(err) || "Failed to activate banner.");
    } finally {
      setActivatingId(null);
    }
  };

  // 3. Global Toggle
  const handleToggleGlobal = async () => {
    const nextState = !isGlobalActive;
    try {
      await toggleGlobalOfferCardApi(nextState);
      setIsGlobalActive(nextState);
      toast.success(
        nextState
          ? "Homepage Offer card is now visible to customers!"
          : "Homepage Offer card is now hidden from customers."
      );
    } catch (err: any) {
      console.error("Error toggling global offer card:", err);
      toast.error(extractErrorMessages(err) || "Failed to update visibility.");
    }
  };

  // 4. Delete Banner
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteOfferBannerApi(deleteId);
      toast.success("Offer poster deleted from library!");
      setBanners((prev) => prev.filter((b) => b.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      console.error("Error deleting banner:", err);
      toast.error(extractErrorMessages(err) || "Failed to delete banner.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Active banner
  const activeBanner = banners.find((b) => Boolean(b.is_active ?? b.isActive));
  const isActivePureGraphic = Boolean(
    activeBanner?.hide_text_overlay ??
    activeBanner?.hideTextOverlay ??
    (!activeBanner?.title && !activeBanner?.subtitle && !(activeBanner?.badge_text || activeBanner?.badgeText))
  );

  return (
    <div className="min-h-screen w-full text-slate-900 p-2 sm:p-4 lg:p-4 font-sans antialiased space-y-5 sm:space-y-6 overflow-x-hidden">
      {/* 🟢 Header with Title, Stats & Upload CTA */}
      <OffersHeader
        isGlobalActive={isGlobalActive}
        onToggleGlobal={handleToggleGlobal}
        onAddNew={() => {
          setEditingBanner(null);
          setIsUploadModalOpen(true);
        }}
        totalBanners={banners.length}
      />

      <div className="px-2 sm:px-4 space-y-6">
        {/* 🌟 Currently Active Live Banner Feature Card */}
        {activeBanner ? (
          <div className="bg-white rounded-3xl border border-emerald-500/40 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-brand-green-dark">
                  Currently Live on <span className="text-brand-gold">grandeplaza.com</span>
                </h2>
                {isActivePureGraphic && (
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-brand-gold/20 text-brand-green-dark border border-brand-gold/40">
                    Graphic Only
                  </span>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto">
                {isGlobalActive ? "● Active on Website" : "○ Hidden (Global Toggle OFF)"}
              </span>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-brand-gold/30 bg-[#0d1f18] min-h-[160px] sm:min-h-[190px] flex items-center shadow-md">
              <img
                src={activeBanner.image || activeBanner.imageUrl || "https://grandeplaza.com/offers-banner.jpg"}
                alt={activeBanner.title || "Active Offer Poster"}
                className="absolute inset-0 h-full w-full object-cover object-[85%_35%] sm:object-center"
              />

              {!isActivePureGraphic && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-transparent sm:via-black/60" />

                  <div className="relative z-10 p-5 sm:p-7 w-[85%] sm:w-[60%] space-y-1.5">
                    {(activeBanner.badge_text || activeBanner.badgeText) && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/40 px-2.5 py-0.5">
                        <Flame className="w-3 h-3 text-brand-gold animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold">
                          {activeBanner.badge_text || activeBanner.badgeText}
                        </span>
                      </div>
                    )}
                    <h3 className="text-white text-xl sm:text-2xl font-serif font-black leading-tight drop-shadow-sm">
                      {activeBanner.title}
                    </h3>
                    {activeBanner.subtitle && (
                      <p className="text-gray-200 text-xs sm:text-sm font-medium leading-snug">
                        {activeBanner.subtitle}
                      </p>
                    )}
                    <div className="pt-2">
                      <span className="inline-block rounded-lg bg-brand-gold px-3.5 py-1.5 text-[10px] font-black uppercase text-[#0d1f18] shadow-sm">
                        View Offers →
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-center gap-3">
            <AlertCircle size={20} className="text-amber-600 shrink-0" />
            <div className="text-xs text-amber-800">
              <p className="font-bold">No custom poster is currently marked active.</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                The website is currently showing the default feast banner. Choose any poster below and click <strong>"Set Active"</strong> to switch it live.
              </p>
            </div>
          </div>
        )}

        {/* 📚 Stored Poster Gallery Header */}
        <div className="flex items-center justify-between border-b border-brand-gold/15 pb-2">
          <div>
            <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-brand-green-dark">
              Poster <span className="text-brand-gold">Gallery & Library</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Click <strong>"Set Active"</strong> on any poster to instantly switch what customers see on the homepage.
            </p>
          </div>
        </div>

        {/* 📦 Banners Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-brand-gold/20 h-64 animate-pulse p-4 space-y-3"
              >
                <div className="h-36 bg-gray-200 rounded-2xl" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-brand-gold/40 p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold flex items-center justify-center mx-auto">
              <ImageIcon size={28} />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-serif font-black text-brand-green-dark text-base uppercase">
                No Offer Posters in Library Yet
              </h3>
              <p className="text-xs text-gray-500">
                Upload your special night deals, weekend food posters, or holiday offers. You can store multiple posters here and switch between them anytime in 1 click!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingBanner(null);
                setIsUploadModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green-dark text-brand-cream border border-brand-gold text-xs font-black uppercase tracking-wider hover:bg-brand-green-dark/90 transition-all cursor-pointer shadow-md"
            >
              <Plus size={14} className="text-brand-gold stroke-[3]" />
              <span>Upload First Poster</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {banners.map((banner) => (
              <OfferBannerCard
                key={banner.id}
                banner={banner}
                onActivate={handleActivate}
                onEdit={(b) => {
                  setEditingBanner(b);
                  setIsUploadModalOpen(true);
                }}
                onDelete={(id) => setDeleteId(id)}
                isActivating={activatingId === banner.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* 🚀 Upload / Edit Modal */}
      <UploadOfferModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setEditingBanner(null);
        }}
        onSuccess={fetchData}
        editingBanner={editingBanner}
      />

      {/* ⚠️ Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Offer Poster?"
        description="Are you sure you want to remove this poster from your library? This action cannot be undone."
        confirmText="Delete Poster"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}

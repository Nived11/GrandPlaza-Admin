"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Sparkles, 
  Check, 
  Loader2, 
  Power, 
  PartyPopper, 
  ShieldCheck, 
  Eye, 
  ExternalLink 
} from "lucide-react";
import { toast } from "sonner";
import { getSiteSettingsApi, updateSiteSettingsApi } from "@/features/settings/api/settingsApi";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

interface FestivalOption {
  id: string;
  name: string;
  malayalam: string;
  icon: string;
  tagline: string;
  details: string;
  status: "ready" | "coming_soon";
  accentColor: string;
}

const FESTIVAL_THEMES: FestivalOption[] = [
  {
    id: "christmas",
    name: "Christmas & New Year",
    malayalam: "ക്രിസ്തുമസ് & പുതുവത്സരം",
    icon: "🎄",
    tagline: "Fairy Lights, Snowfall & Holiday Accents",
    details: "Curved golden & ruby LED fairy light swags draped across the top bar, subtle falling snow particles, and holiday special ribbons.",
    status: "ready",
    accentColor: "border-red-500/50 hover:border-red-500 bg-gradient-to-br from-red-50/40 to-green-50/40",
  },
  {
    id: "onam",
    name: "Onam Festival",
    malayalam: "തിരുവോണം",
    icon: "🌼",
    tagline: "Pookalam & Golden Kasavu Trim",
    details: "Vibrant floral pookalam corner trims, golden kasavu patterns, and traditional festive celebration accents.",
    status: "coming_soon",
    accentColor: "border-amber-500/40 hover:border-amber-500 bg-amber-50/30",
  },
  {
    id: "vishu",
    name: "Vishu Festival",
    malayalam: "വിഷു ആഘോഷം",
    icon: "🌟",
    tagline: "Kanikkonna & Golden Illumination",
    details: "Cascading yellow Kanikkonna flower accents, golden coins, and warm auspicious festival lights.",
    status: "coming_soon",
    accentColor: "border-yellow-500/40 hover:border-yellow-500 bg-yellow-50/30",
  },
  {
    id: "eid",
    name: "Eid Mubarak",
    malayalam: "ഈദ് മുബാറക്",
    icon: "🌙",
    tagline: "Crescent Moon & Fanous Lanterns",
    details: "Golden crescent accents, hanging traditional lanterns, and warm emerald evening ambience.",
    status: "coming_soon",
    accentColor: "border-emerald-500/40 hover:border-emerald-500 bg-emerald-50/30",
  },
  {
    id: "diwali",
    name: "Diwali Celebration",
    malayalam: "ദീപാവലി",
    icon: "🪔",
    tagline: "Deepam Garlands & Sparkling Lights",
    details: "Golden earthen deepams, warm amber flame flickers, and festive light trails.",
    status: "coming_soon",
    accentColor: "border-orange-500/40 hover:border-orange-500 bg-orange-50/30",
  },
];

export default function CelebrationsMainPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCelebrationActive, setIsCelebrationActive] = useState(false);
  const [activeTheme, setActiveTheme] = useState("christmas");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSiteSettingsApi();
      if (data) {
        setIsCelebrationActive(Boolean(data.celebration_mode ?? data.celebrationMode ?? false));
        setActiveTheme(String(data.celebration_theme ?? data.celebrationTheme ?? "christmas"));
      }
    } catch (err: any) {
      console.error("Failed to load celebration settings:", err);
      toast.error(extractErrorMessages(err) || "Failed to load celebration settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Single-click instant toggle
  const handleToggle = async () => {
    const nextState = !isCelebrationActive;
    setSaving(true);
    try {
      await updateSiteSettingsApi({
        celebration_mode: nextState,
        celebration_theme: activeTheme,
      });
      setIsCelebrationActive(nextState);
      toast.success(
        nextState
          ? `🎉 Celebration Mode Activated! (${activeTheme.toUpperCase()} theme live on storefront)`
          : "Celebration Mode turned OFF. Customer site restored to standard clean UI."
      );
    } catch (err: any) {
      console.error("Failed to toggle celebration mode:", err);
      toast.error(extractErrorMessages(err) || "Failed to update celebration mode.");
    } finally {
      setSaving(false);
    }
  };

  // Select theme
  const handleSelectTheme = async (themeId: string) => {
    if (themeId === activeTheme) return;
    setActiveTheme(themeId);
    setSaving(true);
    try {
      await updateSiteSettingsApi({
        celebration_mode: isCelebrationActive,
        celebration_theme: themeId,
      });
      toast.success(`Theme updated to ${themeId.toUpperCase()}`);
    } catch (err: any) {
      console.error("Failed to update theme:", err);
      toast.error(extractErrorMessages(err) || "Failed to update festival theme.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#063B28] text-[#D4AF37] flex items-center justify-center shadow-md">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#063B28] tracking-tight">
                Celebration & Festival Mode
              </h1>
              <p className="text-xs md:text-sm text-gray-500">
                1-Click festival theme manager: add fairy lights, snowfall, and festival magic to the customer website.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://grandeplaza.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50 transition shadow-sm"
          >
            <Eye size={15} />
            <span>View Customer Site</span>
            <ExternalLink size={13} className="text-gray-400" />
          </a>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3">
          <Loader2 className="animate-spin text-[#063B28]" size={36} />
          <span className="text-sm font-medium">Loading Celebration Status...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* MASTER TOGGLE CARD */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 shadow-sm ${
            isCelebrationActive
              ? "bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border-emerald-300 shadow-[0_4px_20px_rgba(6,59,40,0.08)]"
              : "bg-white border-gray-200"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase ${
                    isCelebrationActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {isCelebrationActive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        <span>LIVE ON WEBSITE</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-gray-400" />
                        <span>MUTED / OFF</span>
                      </>
                    )}
                  </span>

                  <span className="text-xs text-gray-500 font-medium">
                    Active Theme: <strong className="text-gray-800 uppercase">{activeTheme}</strong>
                  </span>
                </div>

                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  {isCelebrationActive ? "Festival Mode is Active 🎉" : "Standard Clean UI is Active"}
                </h2>
                <p className="text-xs md:text-sm text-gray-600 max-w-2xl leading-relaxed">
                  {isCelebrationActive
                    ? "Holiday fairy lights, gentle snowfall particles, and festive accents are currently visible on the live customer website. No navbar styles or page layout are affected."
                    : "The live website is currently in standard clean mode. Turn this switch ON to instantly dress the customer site in holiday festive lights and celebrations."}
                </p>
              </div>

              {/* TOGGLE SWITCH BUTTON */}
              <div className="flex items-center gap-4 self-start sm:self-center">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleToggle}
                  className={`relative flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-60 ${
                    isCelebrationActive
                      ? "bg-[#063B28] text-[#FFE082] hover:bg-[#084e35] shadow-[0_4px_16px_rgba(6,59,40,0.3)]"
                      : "bg-gray-900 text-white hover:bg-black"
                  }`}
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Power size={18} className={isCelebrationActive ? "text-emerald-400" : "text-gray-400"} />
                  )}
                  <span>
                    {isCelebrationActive ? "Turn OFF Festival Mode" : "Turn ON Festival Mode"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* THEMES SELECTOR */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
                  <PartyPopper size={20} className="text-[#D4AF37]" />
                  <span>Choose Celebration Theme</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Select which festival elements appear when Celebration Mode is enabled.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FESTIVAL_THEMES.map((theme) => {
                const isSelected = activeTheme === theme.id;
                const isReady = theme.status === "ready";

                return (
                  <div
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#063B28] bg-white shadow-lg ring-2 ring-[#063B28]/10"
                        : `${theme.accentColor} bg-white shadow-sm`
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl p-1 bg-white rounded-xl shadow-xs border border-gray-100">
                            {theme.icon}
                          </span>
                          <div>
                            <h4 className="font-bold text-gray-900 text-base leading-tight">
                              {theme.name}
                            </h4>
                            <span className="text-[11px] text-gray-500 font-medium">
                              {theme.malayalam}
                            </span>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#063B28] text-white text-[10px] font-black uppercase tracking-wider">
                            <Check size={12} strokeWidth={3} />
                            <span>Active</span>
                          </span>
                        ) : isReady ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Ready
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-semibold">
                            Upcoming
                          </span>
                        )}
                      </div>

                      {/* Tagline & Details */}
                      <p className="text-xs font-semibold text-[#063B28] mb-1.5">
                        {theme.tagline}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {theme.details}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-medium">
                        {isSelected
                          ? isCelebrationActive
                            ? "✨ Showing on website"
                            : "Selected (Turn switch ON)"
                          : "Click to select"}
                      </span>

                      <button
                        type="button"
                        disabled={saving}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                          isSelected
                            ? "bg-[#063B28] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SAFETY GUARANTEE CARD */}
          <div className="p-5 rounded-2xl bg-[#063B28]/5 border border-[#063B28]/15 flex items-start gap-4">
            <div className="p-2 rounded-xl bg-[#063B28] text-[#D4AF37] flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div className="space-y-1 text-xs md:text-sm text-gray-700">
              <h5 className="font-bold text-[#063B28]">
                Additive Overlay Guarantee (Zero Layout Shift)
              </h5>
              <p className="text-gray-600 leading-relaxed">
                Festive trims use pure SVG curved fairy swags and pointer-events-none particle layers that drape naturally above the top bar. The Empire Plaza logo, custom scooped navbar curve, search bar, and mobile bottom navigation are never displaced or restyled.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

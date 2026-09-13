"use client";

import React from "react";
import { Building2, Clock, Share2, HelpCircle } from "lucide-react";

export type SettingsTabKey = "general" | "timings" | "social" | "faqs";

interface SettingsTabsProps {
  activeTab: SettingsTabKey;
  onSelectTab: (tab: SettingsTabKey) => void;
  faqCount: number;
}

export default function SettingsTabs({
  activeTab,
  onSelectTab,
  faqCount,
}: SettingsTabsProps) {
  const tabs = [
    {
      key: "general" as SettingsTabKey,
      label: "General Profile",
      icon: Building2,
      desc: "Identity & Contacts",
    },
    {
      key: "timings" as SettingsTabKey,
      label: "Hours & Location",
      icon: Clock,
      desc: "Timings, Map & Radius",
    },
    {
      key: "social" as SettingsTabKey,
      label: "Social Links",
      icon: Share2,
      desc: "Social Handles",
    },
    {
      key: "faqs" as SettingsTabKey,
      label: "FAQ Management",
      icon: HelpCircle,
      desc: "Help & Inquiries",
      badge: faqCount,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 px-2 sm:px-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectTab(tab.key)}
            className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-xs ${
              isActive
                ? "bg-brand-green-dark text-brand-cream border-brand-gold shadow-md"
                : "bg-white text-gray-700 border-brand-gold/20 hover:border-brand-gold/50 hover:bg-brand-gold/5"
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <Icon
                size={18}
                className={isActive ? "text-brand-gold" : "text-brand-green-dark"}
              />
              {typeof tab.badge === "number" && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    isActive
                      ? "bg-brand-gold text-brand-green-dark"
                      : "bg-brand-green-dark/10 text-brand-green-dark"
                  }`}
                >
                  {tab.badge} FAQs
                </span>
              )}
            </div>

            <p
              className={`text-xs sm:text-sm font-black tracking-tight leading-tight ${
                isActive ? "text-brand-cream" : "text-brand-green-dark"
              }`}
            >
              {tab.label}
            </p>

            <p
              className={`text-[9px] font-medium truncate mt-0.5 ${
                isActive ? "text-brand-gold/80" : "text-gray-400"
              }`}
            >
              {tab.desc}
            </p>
          </button>
        );
      })}
    </div>
  );
}

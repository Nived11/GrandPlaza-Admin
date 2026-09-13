"use client";

import React, { useState } from "react";
import SettingsHeader from "./components/SettingsHeader";
import SettingsTabs, { SettingsTabKey } from "./components/SettingsTabs";
import GeneralSettingsForm from "./components/GeneralSettingsForm";
import TimingAndLocationSettings from "./components/TimingAndLocationSettings";
import SocialMediaSettings from "./components/SocialMediaSettings";
import FaqSettingsManager from "./components/FaqSettingsManager";
import { useSettings } from "./hooks/useSettings";

export default function SettingsMainPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabKey>("general");

  const {
    settings,
    loading,
    saving,
    error,
    saveSettings,
    toggleShopOpen,
    faqs,
    faqsLoading,
    addFaq,
    updateFaq,
    deleteFaq,
    toggleFaqActive,
  } = useSettings();

  return (
    <div className="min-h-screen w-full text-slate-900 p-2 sm:p-4 lg:p-4 font-sans antialiased space-y-4 sm:space-y-6 overflow-x-hidden">
      {/* 🟢 Luxury Settings Header with Live Shop Toggle */}
      <SettingsHeader
        isManuallyOpen={settings.is_manually_open}
        isOpenStatus={settings.is_open}
        onToggleShop={toggleShopOpen}
      />

      {/* 📑 Category Tab Cards */}
      <SettingsTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        faqCount={faqs.length}
      />

      {/* 📋 Tab Content Area */}
      <div className="px-2 sm:px-4">
        {loading ? (
          <div className="bg-white rounded-3xl border border-brand-gold/20 p-12 text-center space-y-3 animate-pulse shadow-sm">
            <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
            <div className="h-3 w-32 bg-gray-100 rounded mx-auto" />
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-10 text-center shadow-xs">
            <p className="text-xs font-bold text-rose-600">{error}</p>
          </div>
        ) : (
          <div>
            {activeTab === "general" && (
              <GeneralSettingsForm
                settings={settings}
                onSave={saveSettings}
                isSaving={saving}
              />
            )}

            {activeTab === "timings" && (
              <TimingAndLocationSettings
                settings={settings}
                onSave={saveSettings}
                isSaving={saving}
              />
            )}

            {activeTab === "social" && (
              <SocialMediaSettings
                settings={settings}
                onSave={saveSettings}
                isSaving={saving}
              />
            )}

            {activeTab === "faqs" && (
              <FaqSettingsManager
                faqs={faqs}
                isLoading={faqsLoading}
                onAddFaq={addFaq}
                onUpdateFaq={updateFaq}
                onDeleteFaq={deleteFaq}
                onToggleActive={toggleFaqActive}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

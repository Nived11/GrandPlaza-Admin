"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { SiteSettings } from "../api/settingsApi";
import {
  Clock,
  MapPin,
  Compass,
  Radar,
  Save,
  Loader2,
  ExternalLink,
  Crosshair,
} from "lucide-react";
import { toast } from "sonner";

const StoreLocationMap = dynamic(
  () => import("./StoreLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] rounded-2xl bg-brand-gold/5 flex items-center justify-center animate-pulse border border-brand-gold/20 text-xs font-bold text-brand-green-dark/60">
        Loading interactive map & delivery zone...
      </div>
    ),
  }
);

interface TimingAndLocationSettingsProps {
  settings: SiteSettings;
  onSave: (data: Partial<SiteSettings>) => Promise<boolean>;
  isSaving: boolean;
}

export default function TimingAndLocationSettings({
  settings,
  onSave,
  isSaving,
}: TimingAndLocationSettingsProps) {
  const [formData, setFormData] = useState({
    opening_time: settings.opening_time ? settings.opening_time.slice(0, 5) : "10:00",
    closing_time: settings.closing_time ? settings.closing_time.slice(0, 5) : "23:00",
    latitude: settings.latitude ?? 9.9312,
    longitude: settings.longitude ?? 76.2673,
    delivery_radius: settings.delivery_radius || 10,
  });

  const [isLocating, setIsLocating] = useState(false);

  const handleLocateCurrentLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        setIsLocating(false);
        toast.success(`Current location detected: ${lat}, ${lng}`);
      },
      (err) => {
        setIsLocating(false);
        console.error("GPS error:", err);
        let errorMsg = "Could not fetch current position.";
        if (err.code === 1) errorMsg = "Location access was denied. Please allow location permissions in your browser.";
        else if (err.code === 2) errorMsg = "Location position unavailable.";
        else if (err.code === 3) errorMsg = "Location request timed out.";
        toast.error(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...formData,
      opening_time: `${formData.opening_time}:00`,
      closing_time: `${formData.closing_time}:00`,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      delivery_radius: Number(formData.delivery_radius),
    });
  };

  const latNum = Number(formData.latitude) || 9.9312;
  const lngNum = Number(formData.longitude) || 76.2673;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lngNum - 0.025}%2C${latNum - 0.025}%2C${lngNum + 0.025}%2C${latNum + 0.025}&layer=mapnik&marker=${latNum}%2C${lngNum}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Automated Schedule */}
      <div className="bg-white rounded-3xl border border-brand-gold/20 p-5 sm:p-7 shadow-sm space-y-6">
        <div className="border-b border-brand-gold/10 pb-4">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-brand-green-dark">
            Automated <span className="text-brand-gold">Opening & Closing Schedule</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            The system automatically opens and closes customer ordering based on these system times.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Opening Time */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <Clock size={13} className="text-brand-gold" />
              <span>Daily Opening Time</span>
            </label>
            <input
              type="time"
              name="opening_time"
              value={formData.opening_time}
              onChange={handleChange}
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>

          {/* Closing Time */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <Clock size={13} className="text-brand-gold" />
              <span>Daily Closing Time</span>
            </label>
            <input
              type="time"
              name="closing_time"
              value={formData.closing_time}
              onChange={handleChange}
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* 2. Map & Delivery Radius */}
      <div className="bg-white rounded-3xl border border-brand-gold/20 p-5 sm:p-7 shadow-sm space-y-6">
        <div className="border-b border-brand-gold/10 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-brand-green-dark">
              GPS Coordinates & <span className="text-brand-gold">Delivery Radius</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Set your kitchen coordinates and maximum allowable delivery zone radius.
            </p>
          </div>

          {/* 📍 LOCATE CURRENT POSITION BUTTON */}
          <button
            type="button"
            onClick={handleLocateCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-cream border border-brand-gold text-xs font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
            title="Use current GPS location"
          >
            {isLocating ? (
              <>
                <Loader2 size={13} className="animate-spin text-brand-gold" />
                <span>Locating GPS...</span>
              </>
            ) : (
              <>
                <Crosshair size={14} className="text-brand-gold" strokeWidth={2.5} />
                <span>Locate Current Position</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Latitude */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <Compass size={13} className="text-brand-gold" />
              <span>Store Latitude</span>
            </label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="e.g. 9.9312"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>

          {/* Longitude */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <Compass size={13} className="text-brand-gold" />
              <span>Store Longitude</span>
            </label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="e.g. 76.2673"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>

          {/* Delivery Radius */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <Radar size={13} className="text-brand-gold" />
              <span>Service Radius (KM)</span>
            </label>
            <input
              type="number"
              step="0.5"
              name="delivery_radius"
              value={formData.delivery_radius}
              onChange={handleChange}
              placeholder="e.g. 12"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Interactive Store Location Map with Dynamic Radius Circle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <MapPin size={13} className="text-brand-gold" />
              <span>Interactive Delivery Zone Map</span>
            </p>
            <a
              href={`https://www.google.com/maps?q=${latNum},${lngNum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-green-dark hover:text-brand-gold transition-colors"
            >
              <span>Open in Google Maps</span>
              <ExternalLink size={10} />
            </a>
          </div>

          <StoreLocationMap
            latitude={latNum}
            longitude={lngNum}
            radiusKm={Number(formData.delivery_radius) || 10}
            onLocationChange={(lat, lng) => {
              setFormData((prev) => ({
                ...prev,
                latitude: lat,
                longitude: lng,
              }));
            }}
            onRadiusChange={(radius) => {
              setFormData((prev) => ({
                ...prev,
                delivery_radius: radius,
              }));
            }}
          />
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
                <span>Saving Schedule & Map...</span>
              </>
            ) : (
              <>
                <Save size={15} className="text-brand-gold" />
                <span>Save Timings & Location</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

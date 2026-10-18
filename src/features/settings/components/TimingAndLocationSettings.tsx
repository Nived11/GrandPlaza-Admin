"use client";

import React, { useState, useEffect } from "react";
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
  Bike,
  IndianRupee,
  Calculator,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  Search,
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
    delivery_radius: Number(settings.delivery_radius ?? settings.deliveryRadius ?? 10) || 10,
    physical_address: settings.physical_address || "",
    base_delivery_charge: settings.base_delivery_charge ?? settings.baseDeliveryCharge ?? 20,
    base_delivery_distance: settings.base_delivery_distance ?? settings.baseDeliveryDistance ?? 1.0,
    per_km_charge: settings.per_km_charge ?? settings.perKmCharge ?? 10,
    free_delivery_threshold: (settings.free_delivery_threshold ?? settings.freeDeliveryThreshold ?? "") as string | number,
  });

  const [showManualCoords, setShowManualCoords] = useState(false);
  const [addressSearchQuery, setAddressSearchQuery] = useState("");
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);

  // Keep formData in sync when fresh settings are fetched
  useEffect(() => {
    if (settings) {
      setFormData((prev) => ({
        ...prev,
        opening_time: settings.opening_time ? settings.opening_time.slice(0, 5) : prev.opening_time,
        closing_time: settings.closing_time ? settings.closing_time.slice(0, 5) : prev.closing_time,
        latitude: settings.latitude ?? prev.latitude,
        longitude: settings.longitude ?? prev.longitude,
        delivery_radius: Number(settings.delivery_radius ?? settings.deliveryRadius ?? prev.delivery_radius) || 10,
        physical_address: settings.physical_address ?? prev.physical_address,
        base_delivery_charge: settings.base_delivery_charge ?? settings.baseDeliveryCharge ?? prev.base_delivery_charge,
        base_delivery_distance: settings.base_delivery_distance ?? settings.baseDeliveryDistance ?? prev.base_delivery_distance,
        per_km_charge: settings.per_km_charge ?? settings.perKmCharge ?? prev.per_km_charge,
        free_delivery_threshold: (settings.free_delivery_threshold ?? settings.freeDeliveryThreshold ?? prev.free_delivery_threshold) as string | number,
      }));
    }
  }, [settings]);

  const [isLocating, setIsLocating] = useState(false);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data && data.display_name) {
        setFormData((prev) => ({
          ...prev,
          physical_address: data.display_name,
        }));
      }
    } catch (e) {
      console.error("Reverse geocoding error:", e);
    }
  };

  const handleLocationChangeFromMap = (newLat: number, newLng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: newLat,
      longitude: newLng,
    }));
    reverseGeocode(newLat, newLng);
  };

  const handleSearchPlace = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = addressSearchQuery.trim() || formData.physical_address.trim();
    if (!query) {
      toast.error("Please enter a place name or address to search");
      return;
    }
    setIsSearchingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const first = data[0];
        const newLat = Number(parseFloat(first.lat).toFixed(6));
        const newLng = Number(parseFloat(first.lon).toFixed(6));
        setFormData((prev) => ({
          ...prev,
          latitude: newLat,
          longitude: newLng,
          physical_address: first.display_name,
        }));
        setAddressSearchQuery("");
        toast.success(`Found place: ${first.display_name.slice(0, 45)}...`);
      } else {
        toast.error("No locations found for this place. Try adding city name.");
      }
    } catch {
      toast.error("Place search failed. Check your network.");
    } finally {
      setIsSearchingAddress(false);
    }
  };

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
        reverseGeocode(lat, lng);
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

  const setRadiusValue = (val: number) => {
    const clamped = Math.max(0.5, Math.min(100, Number(val.toFixed(1))));
    setFormData((prev) => ({ ...prev, delivery_radius: clamped }));
  };

  const executeSave = async () => {
    const payload = {
      ...formData,
      physical_address: formData.physical_address,
      opening_time: `${formData.opening_time}:00`,
      closing_time: `${formData.closing_time}:00`,
      openingTime: `${formData.opening_time}:00`,
      closingTime: `${formData.closing_time}:00`,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      delivery_radius: Number(formData.delivery_radius),
      deliveryRadius: Number(formData.delivery_radius),
      base_delivery_charge: Number(formData.base_delivery_charge),
      baseDeliveryCharge: Number(formData.base_delivery_charge),
      base_delivery_distance: Number(formData.base_delivery_distance),
      baseDeliveryDistance: Number(formData.base_delivery_distance),
      per_km_charge: Number(formData.per_km_charge),
      perKmCharge: Number(formData.per_km_charge),
      free_delivery_threshold:
        formData.free_delivery_threshold !== "" && formData.free_delivery_threshold !== null
          ? Number(formData.free_delivery_threshold)
          : null,
      freeDeliveryThreshold:
        formData.free_delivery_threshold !== "" && formData.free_delivery_threshold !== null
          ? Number(formData.free_delivery_threshold)
          : null,
    };
    await onSave(payload);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeSave();
  };

  const latNum = Number(formData.latitude) || 9.9312;
  const lngNum = Number(formData.longitude) || 76.2673;
  const currentRadius = Number(formData.delivery_radius) || 10;

  const radiusPresets = [5, 10, 15, 20, 25, 30];

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
            <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-brand-green-dark flex items-center gap-2">
              <Radar size={18} className="text-brand-gold" />
              <span>GPS Coordinates & <span className="text-brand-gold">Delivery Radius</span></span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Set kitchen GPS coordinates and strict service radius. Customers outside this zone cannot place orders.
            </p>
          </div>

          {/* 📍 LOCATE CURRENT POSITION BUTTON */}
          <button
            type="button"
            onClick={handleLocateCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-cream border border-brand-gold text-xs font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
            title="Detect kitchen GPS automatically"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Kitchen Place / Address Search & Display */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <MapPin size={13} className="text-brand-gold" />
              <span>Kitchen Location / Place Address</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="physical_address"
                value={formData.physical_address}
                onChange={handleChange}
                placeholder="e.g. Empire Plaza, MG Road, Ernakulam"
                className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => handleSearchPlace()}
                disabled={isSearchingAddress}
                className="px-4 py-3 bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-cream border border-brand-gold/50 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isSearchingAddress ? (
                  <Loader2 size={13} className="animate-spin text-brand-gold" />
                ) : (
                  <Search size={13} className="text-brand-gold" />
                )}
                <span>Search Place</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-500">
              Type your restaurant/kitchen place name or pick on the map below. Coordinates update automatically.
            </p>
          </div>

          {/* Delivery Radius with Stepper & Input */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <span className="flex items-center gap-1.5">
                <Radar size={13} className="text-brand-gold" />
                <span>Service Radius (KM)</span>
              </span>
              <span className="text-[11px] font-black text-brand-gold font-sans">
                {currentRadius} KM
              </span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRadiusValue(currentRadius - 1)}
                className="w-10 h-10 rounded-xl bg-brand-gold/15 hover:bg-brand-gold text-brand-green-dark border border-brand-gold/30 flex items-center justify-center font-black transition-colors cursor-pointer shrink-0"
                title="Decrease by 1 KM"
              >
                <Minus size={14} strokeWidth={3} />
              </button>

              <input
                type="number"
                step="0.5"
                min="0.5"
                max="100"
                name="delivery_radius"
                value={formData.delivery_radius}
                onChange={(e) => setRadiusValue(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 15"
                className="w-full text-center bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-2 py-2.5 text-sm font-black text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
              />

              <button
                type="button"
                onClick={() => setRadiusValue(currentRadius + 1)}
                className="w-10 h-10 rounded-xl bg-brand-gold/15 hover:bg-brand-gold text-brand-green-dark border border-brand-gold/30 flex items-center justify-center font-black transition-colors cursor-pointer shrink-0"
                title="Increase by 1 KM"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        {/* Subtle GPS Coordinates Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-brand-gold/5 border border-brand-gold/20 rounded-2xl px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2 text-brand-green-dark font-medium">
            <Compass size={14} className="text-brand-gold" />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Kitchen GPS:</span>
            <span className="font-mono text-xs font-bold text-brand-green-dark">{latNum.toFixed(6)}, {lngNum.toFixed(6)}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowManualCoords(!showManualCoords)}
            className="text-[10px] font-black uppercase tracking-wider text-brand-gold hover:text-brand-green-dark transition-colors cursor-pointer"
          >
            {showManualCoords ? "Hide Manual Coordinates" : "Edit Raw Coordinates (Optional)"}
          </button>
        </div>

        {showManualCoords && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-brand-cream/30 border border-brand-gold/30 rounded-2xl">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-brand-green-dark">Store Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full bg-white border border-brand-gold/30 rounded-xl px-3 py-2 text-xs font-bold font-mono outline-none focus:border-brand-gold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-brand-green-dark">Store Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full bg-white border border-brand-gold/30 rounded-xl px-3 py-2 text-xs font-bold font-mono outline-none focus:border-brand-gold"
              />
            </div>
          </div>
        )}

        {/* Quick Radius Presets & Range Slider */}
        <div className="bg-brand-cream/40 rounded-2xl p-4 border border-brand-gold/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-brand-green-dark flex items-center gap-2">
              <span>Quick Zone Presets:</span>
              <span className="text-xs font-bold text-gray-500 font-sans font-normal">(Click to set radius)</span>
            </span>

            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {radiusPresets.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadiusValue(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                    currentRadius === r
                      ? "bg-brand-green-dark text-brand-gold border-brand-gold shadow-xs"
                      : "bg-white text-gray-700 border-brand-gold/30 hover:border-brand-gold hover:bg-brand-gold/10"
                  }`}
                >
                  {r} KM
                </button>
              ))}
            </div>
          </div>

          {/* Range Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-gray-500">
              <span>1 KM (Neighborhood)</span>
              <span className="font-black text-brand-green-dark">{currentRadius} KM Active</span>
              <span>50 KM (Metro Zone)</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              value={currentRadius}
              onChange={(e) => setRadiusValue(parseFloat(e.target.value) || 1)}
              className="w-full accent-brand-gold cursor-pointer h-2 bg-brand-gold/20 rounded-lg appearance-none"
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
            radiusKm={currentRadius}
            onLocationChange={(lat, lng) => {
              handleLocationChangeFromMap(lat, lng);
            }}
            onRadiusChange={(radius) => {
              setRadiusValue(radius);
            }}
          />
        </div>

        {/* Direct Section 2 Save Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-brand-gold/10 bg-brand-gold/5 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-brand-green-dark">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="text-[11px] font-bold">
              Only addresses within <strong>{currentRadius} KM</strong> of <strong>({latNum.toFixed(4)}, {lngNum.toFixed(4)})</strong> will be allowed to order.
            </span>
          </div>

          <button
            type="button"
            onClick={executeSave}
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-cream border border-brand-gold text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin text-brand-gold" />
                <span>Saving Location & Radius...</span>
              </>
            ) : (
              <>
                <Save size={14} className="text-brand-gold" />
                <span>Save GPS & Delivery Radius</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Distance-Based Delivery Pricing Configuration */}
      <div className="bg-white rounded-3xl border border-brand-gold/20 p-5 sm:p-7 shadow-sm space-y-6">
        <div className="border-b border-brand-gold/10 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-brand-green-dark flex items-center gap-2">
              <Bike size={18} className="text-brand-gold" />
              <span>Distance-Based <span className="text-brand-gold">Delivery Pricing</span></span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Set the per-kilometer delivery fee calculated live in checkout for customers.
            </p>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            Live in Checkout
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Base Charge */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <IndianRupee size={12} className="text-brand-gold" />
              <span>Base Delivery Fee (₹)</span>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              name="base_delivery_charge"
              value={formData.base_delivery_charge}
              onChange={handleChange}
              placeholder="e.g. 20"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
            <p className="text-[10px] text-gray-400">Starting minimum charge</p>
          </div>

          {/* Base Distance */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <Radar size={12} className="text-brand-gold" />
              <span>Base Included (KM)</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              name="base_delivery_distance"
              value={formData.base_delivery_distance}
              onChange={handleChange}
              placeholder="e.g. 1.0"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
            <p className="text-[10px] text-gray-400">Covered in base fee</p>
          </div>

          {/* Per KM Charge */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <IndianRupee size={12} className="text-brand-gold" />
              <span>Per KM Rate (₹ / KM)</span>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              name="per_km_charge"
              value={formData.per_km_charge}
              onChange={handleChange}
              placeholder="e.g. 10"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
            <p className="text-[10px] text-gray-400">Extra charge per KM beyond base</p>
          </div>

          {/* Free Delivery Threshold */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green-dark">
              <Sparkles size={12} className="text-brand-gold" />
              <span>Free Delivery Above (₹)</span>
            </label>
            <input
              type="number"
              step="10"
              min="0"
              name="free_delivery_threshold"
              value={formData.free_delivery_threshold}
              onChange={handleChange}
              placeholder="Leave empty to disable"
              className="w-full bg-brand-gold/5 border border-brand-gold/30 rounded-xl px-4 py-3 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs"
            />
            <p className="text-[10px] text-gray-400">Optional free delivery rule</p>
          </div>
        </div>

        {/* Live Calculation Preview */}
        <div className="bg-brand-cream/50 rounded-2xl p-4 border border-brand-gold/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-green-dark text-brand-gold flex items-center justify-center shrink-0 shadow-xs">
              <Calculator size={15} />
            </div>
            <div>
              <h4 className="text-xs font-black text-brand-green-dark uppercase tracking-tight">Live Fee Preview</h4>
              <p className="text-[11px] text-gray-600">Sample customer charges with your current rates</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {[2, 4, 8].map((sampleKm) => {
              const baseC = Number(formData.base_delivery_charge) || 0;
              const baseD = Number(formData.base_delivery_distance) || 1;
              const perKm = Number(formData.per_km_charge) || 10;
              const extraD = Math.max(0, sampleKm - baseD);
              const fee = Math.round(baseC + extraD * perKm);
              return (
                <div key={sampleKm} className="bg-white px-3 py-1.5 rounded-xl border border-brand-gold/30 shadow-xs flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-500">{sampleKm} KM:</span>
                  <span className="text-xs font-black text-brand-green-dark">₹{fee}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Full Save Action Button */}
        <div className="flex justify-end pt-4 border-t border-brand-gold/10">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-cream border border-brand-gold text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={15} className="animate-spin text-brand-gold" />
                <span>Saving Schedule, Map & Rates...</span>
              </>
            ) : (
              <>
                <Save size={15} className="text-brand-gold" />
                <span>Save All Timings, Location & Delivery Rates</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

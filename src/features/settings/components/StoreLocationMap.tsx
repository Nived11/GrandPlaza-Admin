"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Crosshair,
  Search,
  Lock,
  Unlock,
  Loader2,
  MapPin,
  Radar,
  Info,
} from "lucide-react";
import { toast } from "sonner";

interface StoreLocationMapProps {
  latitude: number;
  longitude: number;
  radiusKm: number;
  onLocationChange: (lat: number, lng: number) => void;
  onRadiusChange: (radius: number) => void;
}

export default function StoreLocationMap({
  latitude,
  longitude,
  radiusKm,
  onLocationChange,
  onRadiusChange,
}: StoreLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  const [isLocked, setIsLocked] = useState(false);
  const isLockedRef = useRef(isLocked);
  const onLocationChangeRef = useRef(onLocationChange);

  // Keep refs in sync with state/props
  useEffect(() => {
    isLockedRef.current = isLocked;
    if (markerRef.current) {
      if (isLocked) {
        markerRef.current.dragging?.disable();
      } else {
        markerRef.current.dragging?.enable();
      }
    }
  }, [isLocked]);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Validate coordinates (fallback to Kochi/Kakkanad if invalid/0)
  const validLat = latitude && Math.abs(latitude) > 0.001 ? latitude : 9.9981;
  const validLng = longitude && Math.abs(longitude) > 0.001 ? longitude : 76.3575;
  const validRadius = Math.max(0.5, radiusKm || 10);

  // Custom luxury pin icon matching GrandPlaza theme
  const getMarkerIcon = () => {
    return L.divIcon({
      className: "custom-restaurant-pin",
      html: `
        <div style="
          position: relative;
          width: 38px;
          height: 38px;
          background: #015a41;
          border: 2.5px solid #e7aa31;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(1, 90, 65, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <div style="
            transform: rotate(45deg);
            color: #ffffff;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            🍴
          </div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [validLat, validLng],
      zoom: 12,
      scrollWheelZoom: "center",
    });

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add Marker
    const marker = L.marker([validLat, validLng], {
      icon: getMarkerIcon(),
      draggable: !isLockedRef.current,
    }).addTo(map);

    marker.bindPopup(
      `<div style="font-family: sans-serif; padding: 4px; font-weight: bold; color: #015a41;">
        📍 Store Location<br/>
        <span style="font-size: 11px; color: #666;">Lat: ${validLat.toFixed(4)}, Lng: ${validLng.toFixed(4)}</span>
      </div>`
    );

    // Add Service Radius Circle
    const circle = L.circle([validLat, validLng], {
      radius: validRadius * 1000, // KM to meters
      color: "#e7aa31", // GrandPlaza Gold
      weight: 2.5,
      opacity: 0.9,
      fillColor: "#e7aa31",
      fillOpacity: 0.18,
      dashArray: "6, 6",
      interactive: false,
    }).addTo(map);

    // Map click handler (moves marker and circle if not locked)
    map.on("click", (e: L.LeafletMouseEvent) => {
      if (isLockedRef.current) {
        toast.info("Map is locked. Click 'Locked' button to unlock and reposition store.");
        return;
      }
      const { lat, lng } = e.latlng;
      const formattedLat = Number(lat.toFixed(6));
      const formattedLng = Number(lng.toFixed(6));

      marker.setLatLng([formattedLat, formattedLng]);
      circle.setLatLng([formattedLat, formattedLng]);
      onLocationChangeRef.current(formattedLat, formattedLng);
    });

    // Marker drag handler
    marker.on("dragend", () => {
      if (isLockedRef.current) return;
      const pos = marker.getLatLng();
      const formattedLat = Number(pos.lat.toFixed(6));
      const formattedLng = Number(pos.lng.toFixed(6));

      circle.setLatLng([formattedLat, formattedLng]);
      onLocationChangeRef.current(formattedLat, formattedLng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;
    circleRef.current = circle;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map position when latitude / longitude props change externally
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !circleRef.current) return;

    const currentPos = markerRef.current.getLatLng();
    if (
      Math.abs(currentPos.lat - validLat) > 0.0001 ||
      Math.abs(currentPos.lng - validLng) > 0.0001
    ) {
      markerRef.current.setLatLng([validLat, validLng]);
      circleRef.current.setLatLng([validLat, validLng]);
      mapInstanceRef.current.setView([validLat, validLng], 12);
    }
  }, [validLat, validLng]);

  // Update circle radius dynamically when radiusKm changes!
  useEffect(() => {
    if (!circleRef.current) return;
    circleRef.current.setRadius(validRadius * 1000);
  }, [validRadius]);

  // Search Address handler via Nominatim OSM
  const handleSearchAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedRef.current) {
      toast.info("Map is locked. Click 'Locked' button to unlock first.");
      return;
    }
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const first = data[0];
        const newLat = Number(parseFloat(first.lat).toFixed(6));
        const newLng = Number(parseFloat(first.lon).toFixed(6));

        if (markerRef.current && circleRef.current && mapInstanceRef.current) {
          markerRef.current.setLatLng([newLat, newLng]);
          circleRef.current.setLatLng([newLat, newLng]);
          mapInstanceRef.current.flyTo([newLat, newLng], 13);
        }

        onLocationChangeRef.current(newLat, newLng);
        toast.success(`Found: ${first.display_name.slice(0, 45)}...`);
      } else {
        toast.error("No locations found for this query. Try adding city name.");
      }
    } catch {
      toast.error("Address search failed. Please check network connection.");
    } finally {
      setIsSearching(false);
    }
  };

  // Locate Current GPS position handler
  const handleLocateCurrent = () => {
    if (isLockedRef.current) {
      toast.info("Map is locked. Click 'Locked' button to unlock first.");
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));

        if (markerRef.current && circleRef.current && mapInstanceRef.current) {
          markerRef.current.setLatLng([lat, lng]);
          circleRef.current.setLatLng([lat, lng]);
          mapInstanceRef.current.flyTo([lat, lng], 13);
        }

        onLocationChangeRef.current(lat, lng);
        setIsLocating(false);
        toast.success(`Current GPS applied: ${lat}, ${lng}`);
      },
      (err) => {
        setIsLocating(false);
        let errorMsg = "Could not fetch current GPS location.";
        if (err.code === 1) errorMsg = "Permission denied. Allow location access in browser.";
        toast.error(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      {/* Top Map Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search Address Box */}
        <form
          onSubmit={handleSearchAddress}
          className="relative flex-1 max-w-sm flex items-center"
        >
          <Search
            size={15}
            className="absolute left-3.5 text-brand-green-dark/60"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address (e.g. Kakkanad, Kochi)..."
            className="w-full bg-white border border-brand-gold/40 rounded-xl py-2 pl-10 pr-20 text-xs font-bold text-brand-green-dark outline-none focus:border-brand-gold shadow-xs"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-1.5 px-2.5 py-1 rounded-lg bg-brand-green-dark text-brand-cream text-[10px] font-black uppercase tracking-wider hover:bg-brand-green-dark/90 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSearching ? <Loader2 size={11} className="animate-spin" /> : "Find"}
          </button>
        </form>

        {/* Action Controls: Locate & Lock Map */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Locate Button */}
          <button
            type="button"
            onClick={handleLocateCurrent}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-gold/20 hover:bg-brand-gold text-brand-green-dark border border-brand-gold/40 text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Locate my position via GPS"
          >
            {isLocating ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Crosshair size={13} strokeWidth={2.5} />
            )}
            <span>Locate Me</span>
          </button>

          {/* Lock / Unlock Map Button */}
          <button
            type="button"
            onClick={() => {
              setIsLocked(!isLocked);
              toast.info(!isLocked ? "Map locked. Pin cannot be moved." : "Map unlocked. Click or drag to move pin.");
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer ${
              isLocked
                ? "bg-amber-100 text-amber-900 border-amber-300"
                : "bg-white text-gray-700 border-brand-gold/30 hover:border-brand-gold"
            }`}
            title={isLocked ? "Click to unlock map" : "Click to lock map"}
          >
            {isLocked ? (
              <>
                <Lock size={13} className="text-amber-700" />
                <span>Locked</span>
              </>
            ) : (
              <>
                <Unlock size={13} className="text-emerald-700" />
                <span>Unlocked</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div
        className={`relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border transition-all duration-300 shadow-sm z-0 ${
          isLocked
            ? "border-amber-400 ring-2 ring-amber-300/40"
            : "border-brand-gold/30"
        }`}
      >
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Overlay Delivery Radius Indicator Badge */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-brand-green-dark/95 backdrop-blur-sm border border-brand-gold text-brand-cream px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2 text-xs">
          <Radar size={15} className="text-brand-gold animate-pulse shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-gold/80 block leading-tight">
              Delivery Zone
            </span>
            <span className="font-black text-brand-cream font-sans">
              {validRadius} KM Radius
            </span>
          </div>
        </div>

        {/* Click tip indicator / Locked Indicator */}
        <div
          className={`absolute top-3 right-3 z-[1000] backdrop-blur-sm border px-2.5 py-1.5 rounded-lg shadow-xs hidden sm:flex items-center gap-1.5 text-[10px] font-bold transition-all ${
            isLocked
              ? "bg-amber-100/95 border-amber-300 text-amber-900"
              : "bg-white/90 border-brand-gold/40 text-brand-green-dark"
          }`}
        >
          {isLocked ? (
            <>
              <Lock size={12} className="text-amber-700 shrink-0" />
              <span>Map locked (Pin cannot be moved)</span>
            </>
          ) : (
            <>
              <Info size={12} className="text-brand-gold shrink-0" />
              <span>Click anywhere to move pin & radius</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

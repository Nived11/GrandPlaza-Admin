"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Bike, Phone, MapPin, Navigation, Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { loadGoogleMaps } from "@/lib/loadGoogleMaps";
import { getPusherClient } from "@/lib/pusherClient";

interface Rider {
  id: number;
  employee_id?: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  vehicle_number?: string;
  delivery_profile?: {
    vehicle_number?: string;
    is_on_duty?: boolean;
    is_busy?: boolean;
    current_latitude?: number | null;
    current_longitude?: number | null;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  riders: Rider[];
  initialSelectedRiderId?: number | null;
}

const DEFAULT_CENTER = { lat: 11.2588, lng: 75.7804 }; // Kerala center

export default function LiveFleetMapModal({
  isOpen,
  onClose,
  riders,
  initialSelectedRiderId,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: number]: any }>({});

  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedRiderId, setSelectedRiderId] = useState<number | null>(initialSelectedRiderId || null);

  // Maintain local state of riders with live coordinates
  const [liveRiders, setLiveRiders] = useState<{ [key: number]: { lat: number; lng: number } }>({});

  // Sync initial rider coordinates from props
  useEffect(() => {
    const coordsMap: { [key: number]: { lat: number; lng: number } } = {};
    riders.forEach((r) => {
      const lat = r.delivery_profile?.current_latitude;
      const lng = r.delivery_profile?.current_longitude;
      if (lat != null && lng != null) {
        coordsMap[r.id] = { lat, lng };
      }
    });
    setLiveRiders((prev) => ({ ...coordsMap, ...prev }));
  }, [riders]);

  useEffect(() => {
    if (initialSelectedRiderId) {
      setSelectedRiderId(initialSelectedRiderId);
    }
  }, [initialSelectedRiderId]);

  // Initialize Map
  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;

    loadGoogleMaps()
      .then((google) => {
        if (isCancelled || !mapContainerRef.current) return;

        setIsLoading(false);

        // Find initial center
        let center = DEFAULT_CENTER;
        if (selectedRiderId && liveRiders[selectedRiderId]) {
          center = liveRiders[selectedRiderId];
        } else {
          const firstWithCoords = Object.values(liveRiders)[0];
          if (firstWithCoords) center = firstWithCoords;
        }

        const map = new google.maps.Map(mapContainerRef.current, {
          center,
          zoom: selectedRiderId && liveRiders[selectedRiderId] ? 15 : 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });
        mapInstanceRef.current = map;

        // Create markers for all riders
        riders.forEach((rider) => {
          const coords = liveRiders[rider.id];
          if (!coords) return;

          const name = [rider.first_name, rider.last_name].filter(Boolean).join(" ") || rider.username;
          const marker = new google.maps.Marker({
            position: coords,
            map,
            title: `${name} (${rider.employee_id || `DB-${rider.id}`})`,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: rider.delivery_profile?.is_busy ? "#E09B16" : "#0F3D2E",
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: "#FFFFFF",
            },
          });

          marker.addListener("click", () => {
            setSelectedRiderId(rider.id);
            map.panTo(coords);
            map.setZoom(16);
          });

          markersRef.current[rider.id] = marker;
        });

        // Fit bounds if multiple riders exist
        const coordsList = Object.values(liveRiders);
        if (coordsList.length > 1 && !selectedRiderId) {
          const bounds = new google.maps.LatLngBounds();
          coordsList.forEach((c) => bounds.extend(c));
          map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setIsLoading(false);
          setMapError("Failed to load Google Maps");
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  // Real-time Pusher listener for rider GPS broadcasts
  useEffect(() => {
    if (!isOpen) return;

    const pusher = getPusherClient();
    if (!pusher) return;

    const channel = pusher.subscribe("orders-channel");

    const handleLocationUpdate = (data: {
      delivery_boy_id: number;
      latitude: number;
      longitude: number;
    }) => {
      if (!data.delivery_boy_id || data.latitude == null || data.longitude == null) return;

      const newCoords = { lat: data.latitude, lng: data.longitude };

      setLiveRiders((prev) => ({
        ...prev,
        [data.delivery_boy_id]: newCoords,
      }));

      // Update existing marker or create new one
      const existingMarker = markersRef.current[data.delivery_boy_id];
      if (existingMarker) {
        existingMarker.setPosition(newCoords);
      } else if (mapInstanceRef.current && (window as any).google?.maps) {
        const google = (window as any).google;
        const targetRider = riders.find((r) => r.id === data.delivery_boy_id);
        const name = targetRider ? [targetRider.first_name, targetRider.last_name].filter(Boolean).join(" ") : "Rider";

        const marker = new google.maps.Marker({
          position: newCoords,
          map: mapInstanceRef.current,
          title: name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: "#0F3D2E",
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: "#FFFFFF",
          },
        });

        marker.addListener("click", () => {
          setSelectedRiderId(data.delivery_boy_id);
          mapInstanceRef.current?.panTo(newCoords);
        });

        markersRef.current[data.delivery_boy_id] = marker;
      }
    };

    channel.bind("delivery-location-updated", handleLocationUpdate);

    return () => {
      channel.unbind("delivery-location-updated", handleLocationUpdate);
    };
  }, [isOpen, riders]);

  // Center on selected rider
  const handleSelectRider = (id: number) => {
    setSelectedRiderId(id);
    const coords = liveRiders[id];
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(coords);
      mapInstanceRef.current.setZoom(16);
    }
  };

  if (!isOpen) return null;

  const selectedRider = riders.find((r) => r.id === selectedRiderId);
  const selectedCoords = selectedRiderId ? liveRiders[selectedRiderId] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-[var(--brand-green-dark)] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-amber-300">
              <Bike size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black tracking-wide uppercase font-sans">
                  Live Fleet Tracking Map
                </h3>
                <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Realtime Pusher
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-white/70 font-medium">
                Live location of active delivery partners
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content: Map + Side Rider List */}
        <div className="flex-1 flex flex-col sm:flex-row min-h-0">
          {/* Map Area */}
          <div className="relative flex-1 h-3/5 sm:h-full bg-stone-100">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-stone-100/80 gap-2">
                <Loader2 size={24} className="animate-spin text-[var(--brand-green-dark)]" />
                <span className="text-xs font-semibold text-stone-600">Connecting to Google Maps...</span>
              </div>
            )}

            {mapError && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-red-50 p-4 text-center">
                <MapPin size={24} className="text-red-500 mb-1" />
                <span className="text-xs font-semibold text-red-600">{mapError}</span>
              </div>
            )}

            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Selected Rider Floating Card on Map */}
            {selectedRider && (
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-10 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 p-3.5 shadow-xl flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-mono font-bold bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                        {selectedRider.employee_id || `DB-${selectedRider.id}`}
                      </span>
                      <h4 className="text-xs font-black text-gray-900 truncate">
                        {[selectedRider.first_name, selectedRider.last_name].filter(Boolean).join(" ") || selectedRider.username}
                      </h4>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                      Vehicle: {selectedRider.delivery_profile?.vehicle_number || selectedRider.vehicle_number || "N/A"}
                    </p>
                  </div>

                  <span
                    className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      selectedCoords
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {selectedCoords ? "GPS Live" : "No GPS signal"}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  {selectedRider.phone_number && (
                    <a
                      href={`tel:${selectedRider.phone_number}`}
                      className="flex-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition"
                    >
                      <Phone size={12} /> Call
                    </a>
                  )}

                  {selectedCoords && (
                    <a
                      href={`https://www.google.com/maps?q=${selectedCoords.lat},${selectedCoords.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 px-2 bg-[var(--brand-green-dark)] hover:bg-[#16533F] text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition shadow-xs"
                    >
                      <ExternalLink size={12} /> Google Maps
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Side Rider Fleet List */}
          <div className="w-full sm:w-72 sm:border-l border-t sm:border-t-0 border-gray-200 bg-gray-50 flex flex-col shrink-0">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-700">
                Riders Fleet ({riders.length})
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {Object.keys(liveRiders).length} with GPS
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {riders.map((rider) => {
                const isSelected = rider.id === selectedRiderId;
                const coords = liveRiders[rider.id];
                const name = [rider.first_name, rider.last_name].filter(Boolean).join(" ") || rider.username;

                return (
                  <button
                    key={rider.id}
                    type="button"
                    onClick={() => handleSelectRider(rider.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-white border-[var(--brand-green-dark)] shadow-sm ring-1 ring-[var(--brand-green-dark)]/20"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          coords
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Bike size={14} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">
                          {rider.employee_id || `DB-${rider.id}`}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {coords ? (
                        <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Live
                        </span>
                      ) : (
                        <span className="text-[9px] font-medium text-gray-400">Offline</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

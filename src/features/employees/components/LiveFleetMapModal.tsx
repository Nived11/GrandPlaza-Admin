"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { 
  X, 
  Bike, 
  Phone, 
  MapPin, 
  Navigation, 
  Loader2, 
  ExternalLink, 
  RefreshCw, 
  Compass, 
  Store,
  Layers
} from "lucide-react";
import { loadGoogleMaps } from "@/lib/loadGoogleMaps";
import { getPusherClient } from "@/lib/pusherClient";
import axiosInstance from "@/lib/axios";

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

// 🏢 Empire Plaza Main Kitchen (Kadavanthra, Kochi, Kerala)
const RESTAURANT_LOCATION = { lat: 9.967625, lng: 76.304040 };

// 🛵 Swiggy-Style Custom Scooter SVG Marker with Pulsing Radar
function getSwiggyBikeSvg(isBusy: boolean, heading: number = 0): string {
  const primaryColor = isBusy ? "#D97706" : "#059669"; // Amber if busy, Emerald if active
  const pulseColor = isBusy ? "rgba(217, 119, 6, 0.35)" : "rgba(16, 185, 129, 0.4)";

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="74" viewBox="0 0 64 74">
    <defs>
      <filter id="sw-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.35"/>
      </filter>
    </defs>
    
    <!-- Pulsing Radar Wave -->
    <circle cx="32" cy="36" r="24" fill="${pulseColor}">
      <animate attributeName="r" from="14" to="28" dur="1.4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.9" to="0" dur="1.4s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Outer Glow Badge -->
    <circle cx="32" cy="36" r="18" fill="${primaryColor}" stroke="#FFFFFF" stroke-width="3" filter="url(#sw-shadow)"/>
    
    <!-- Motorcycle / Scooter Icon rotated towards movement heading -->
    <g transform="translate(32, 36) rotate(${heading}) translate(-10, -10)" fill="#FFFFFF">
      <path d="M4 14a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm8 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM7 11h6l2-4h-2l-1.5 3H8l-.5-1H11V8H6.5l-.8-1.6A1 1 0 0 0 4.8 6H2v1.5h2.2l2.3 4.5A2 2 0 0 0 7 13h5.5l-.5 1H6v1.5h6a1 1 0 0 0 1-.8l1.4-2.7h-7z"/>
    </g>
    
    <!-- Bottom Needle Indicator -->
    <polygon points="27,53 37,53 32,60" fill="${primaryColor}"/>
  </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

// 🏢 Empire Plaza Restaurant Marker SVG
function getRestaurantSvg(): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="54" height="64" viewBox="0 0 54 64">
    <defs>
      <filter id="rest-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.45"/>
      </filter>
    </defs>
    <!-- Background Pin -->
    <path d="M27 2 C15 2 5 12 5 24 C5 37 27 60 27 60 C27 60 49 37 49 24 C49 12 39 2 27 2 Z" fill="#0F3D2E" stroke="#D4AF37" stroke-width="2.5" filter="url(#rest-shadow)"/>
    <!-- Center Gold Badge -->
    <circle cx="27" cy="24" r="14" fill="#D4AF37"/>
    <!-- Cutlery / Chef Symbol -->
    <g transform="translate(18, 15) scale(0.75)" fill="#0F3D2E">
      <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
    </g>
  </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

// Helper: Haversine distance in KM
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper: Bearing calculation for bike orientation
function calculateBearing(fromLat: number, fromLng: number, toLat: number, toLng: number): number {
  const dLng = ((toLng - fromLng) * Math.PI) / 180;
  const lat1 = (fromLat * Math.PI) / 180;
  const lat2 = (toLat * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

export default function LiveFleetMapModal({
  isOpen,
  onClose,
  riders,
  initialSelectedRiderId,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: number]: any }>({});
  const headingsRef = useRef<{ [key: number]: number }>({});
  const polylineRef = useRef<any>(null);
  const restaurantMarkerRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedRiderId, setSelectedRiderId] = useState<number | null>(initialSelectedRiderId || null);

  // Maintain local state of riders with live coordinates
  const [liveRiders, setLiveRiders] = useState<{ [key: number]: { lat: number; lng: number } }>({});
  const [allRiders, setAllRiders] = useState<Rider[]>(riders);

  // Sync initial rider coordinates from props
  useEffect(() => {
    setAllRiders(riders);
    const coordsMap: { [key: number]: { lat: number; lng: number } } = {};
    let firstLiveId: number | null = null;

    riders.forEach((r) => {
      const lat = r.delivery_profile?.current_latitude;
      const lng = r.delivery_profile?.current_longitude;
      if (lat != null && lng != null && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
        coordsMap[r.id] = { lat: Number(lat), lng: Number(lng) };
        if (!firstLiveId) firstLiveId = r.id;
      }
    });

    setLiveRiders((prev) => ({ ...coordsMap, ...prev }));

    // Auto-select first live rider if none selected
    if (!selectedRiderId && (initialSelectedRiderId || firstLiveId)) {
      setSelectedRiderId(initialSelectedRiderId || firstLiveId);
    }
  }, [riders, initialSelectedRiderId]);

  // Smoothly animate marker gliding to new coordinates (Swiggy movement interpolation)
  const animateMarkerGlide = useCallback((
    marker: any,
    from: { lat: number; lng: number },
    to: { lat: number; lng: number },
    durationMs: number = 1000
  ) => {
    if (!marker || typeof window === "undefined" || !(window as any).google?.maps?.LatLng) return;
    const googleMaps = (window as any).google.maps;
    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Smooth easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const curLat = from.lat + (to.lat - from.lat) * ease;
      const curLng = from.lng + (to.lng - from.lng) * ease;

      marker.setPosition(new googleMaps.LatLng(curLat, curLng));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, []);

  // Update Route Polyline between Kitchen and selected Rider
  const updateRoutePolyline = useCallback((riderCoords: { lat: number; lng: number } | null) => {
    const map = mapInstanceRef.current;
    const google = (window as any).google;
    if (!map || !google?.maps) return;

    if (!riderCoords) {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      return;
    }

    const pathCoordinates = [
      RESTAURANT_LOCATION,
      riderCoords
    ];

    if (polylineRef.current) {
      polylineRef.current.setPath(pathCoordinates);
    } else {
      polylineRef.current = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: "#059669",
        strokeOpacity: 0.85,
        strokeWeight: 4,
        map,
      });
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;

    loadGoogleMaps()
      .then((google) => {
        if (isCancelled || !mapContainerRef.current) return;
        setIsLoading(false);

        // Center on selected rider if available, else restaurant
        let initialCenter = RESTAURANT_LOCATION;
        const targetRiderCoords = selectedRiderId ? liveRiders[selectedRiderId] : null;
        if (targetRiderCoords) {
          initialCenter = targetRiderCoords;
        }

        const map = new google.maps.Map(mapContainerRef.current, {
          center: initialCenter,
          zoom: targetRiderCoords ? 16 : 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
          ],
        });
        mapInstanceRef.current = map;

        // 🏢 Add Empire Plaza Main Kitchen Marker
        const restMarker = new google.maps.Marker({
          position: RESTAURANT_LOCATION,
          map,
          title: "Empire Plaza Kitchen (Main Hub)",
          icon: {
            url: getRestaurantSvg(),
            scaledSize: new google.maps.Size(46, 54),
            anchor: new google.maps.Point(23, 54),
          },
          zIndex: 1000,
        });

        const restInfoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 6px; font-family: sans-serif; text-align: center;">
              <strong style="color: #0F3D2E; font-size: 13px;">🏢 Empire Plaza Kitchen</strong>
              <div style="font-size: 11px; color: #555; margin-top: 2px;">Main Dispatch & Food Hub</div>
            </div>
          `,
        });

        restMarker.addListener("click", () => {
          restInfoWindow.open(map, restMarker);
        });

        restaurantMarkerRef.current = restMarker;

        // Create markers for active riders with coordinates
        allRiders.forEach((rider) => {
          const coords = liveRiders[rider.id];
          if (!coords) return;

          const heading = headingsRef.current[rider.id] || 0;
          const isBusy = Boolean(rider.delivery_profile?.is_busy);
          const name = [rider.first_name, rider.last_name].filter(Boolean).join(" ") || rider.username;

          const marker = new google.maps.Marker({
            position: coords,
            map,
            title: `${name} (${rider.employee_id || `DB-${rider.id}`})`,
            icon: {
              url: getSwiggyBikeSvg(isBusy, heading),
              scaledSize: new google.maps.Size(52, 60),
              anchor: new google.maps.Point(26, 48),
            },
            zIndex: 900,
          });

          marker.addListener("click", () => {
            setSelectedRiderId(rider.id);
            map.panTo(coords);
            map.setZoom(16);
            updateRoutePolyline(coords);
          });

          markersRef.current[rider.id] = marker;
        });

        // Fit bounds to show Kitchen and active riders
        const activeCoords = Object.values(liveRiders);
        if (activeCoords.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(RESTAURANT_LOCATION);
          activeCoords.forEach((c) => bounds.extend(c));
          map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
        }

        // Draw initial polyline if rider selected
        if (targetRiderCoords) {
          updateRoutePolyline(targetRiderCoords);
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

  // Synchronize dynamic markers whenever liveRiders updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    const google = (window as any).google;
    if (!map || !google?.maps) return;

    allRiders.forEach((rider) => {
      const coords = liveRiders[rider.id];
      if (!coords) return;

      const existingMarker = markersRef.current[rider.id];
      const isBusy = Boolean(rider.delivery_profile?.is_busy);
      const heading = headingsRef.current[rider.id] || 0;
      const name = [rider.first_name, rider.last_name].filter(Boolean).join(" ") || rider.username;

      if (existingMarker) {
        // Marker exists: update icon and smoothly glide
        existingMarker.setIcon({
          url: getSwiggyBikeSvg(isBusy, heading),
          scaledSize: new google.maps.Size(52, 60),
          anchor: new google.maps.Point(26, 48),
        });
      } else {
        // Create new marker
        const newMarker = new google.maps.Marker({
          position: coords,
          map,
          title: `${name} (${rider.employee_id || `DB-${rider.id}`})`,
          icon: {
            url: getSwiggyBikeSvg(isBusy, heading),
            scaledSize: new google.maps.Size(52, 60),
            anchor: new google.maps.Point(26, 48),
          },
          zIndex: 900,
        });

        newMarker.addListener("click", () => {
          setSelectedRiderId(rider.id);
          map.panTo(coords);
          map.setZoom(16);
          updateRoutePolyline(coords);
        });

        markersRef.current[rider.id] = newMarker;
      }
    });

    // Update polyline for currently selected rider
    if (selectedRiderId && liveRiders[selectedRiderId]) {
      updateRoutePolyline(liveRiders[selectedRiderId]);
    }
  }, [liveRiders, allRiders, selectedRiderId, updateRoutePolyline]);

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

      const riderId = Number(data.delivery_boy_id);
      const newCoords = { lat: Number(data.latitude), lng: Number(data.longitude) };
      const oldCoords = liveRiders[riderId];

      // Calculate bearing / direction of motion if rider moved
      if (oldCoords) {
        const heading = calculateBearing(oldCoords.lat, oldCoords.lng, newCoords.lat, newCoords.lng);
        headingsRef.current[riderId] = heading;
      }

      setLiveRiders((prev) => ({
        ...prev,
        [riderId]: newCoords,
      }));

      // Smoothly animate existing marker
      const existingMarker = markersRef.current[riderId];
      if (existingMarker && oldCoords) {
        animateMarkerGlide(existingMarker, oldCoords, newCoords, 1200);
      } else if (existingMarker) {
        existingMarker.setPosition(newCoords);
      }

      // If this rider is currently selected, smoothly pan the map
      if (selectedRiderId === riderId && mapInstanceRef.current) {
        mapInstanceRef.current.panTo(newCoords);
        updateRoutePolyline(newCoords);
      }
    };

    channel.bind("delivery-location-updated", handleLocationUpdate);

    return () => {
      channel.unbind("delivery-location-updated", handleLocationUpdate);
    };
  }, [isOpen, liveRiders, selectedRiderId, animateMarkerGlide, updateRoutePolyline]);

  // Periodic active polling fallback every 6 seconds while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await axiosInstance.get(`/accounts/admin/delivery-boys?_t=${Date.now()}`, {
          headers: { "Cache-Control": "no-cache" }
        });
        if (Array.isArray(res.data)) {
          setAllRiders(res.data);
          const updatedCoords: { [key: number]: { lat: number; lng: number } } = {};
          res.data.forEach((r: Rider) => {
            const lat = r.delivery_profile?.current_latitude;
            const lng = r.delivery_profile?.current_longitude;
            if (lat != null && lng != null && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
              updatedCoords[r.id] = { lat: Number(lat), lng: Number(lng) };
            }
          });
          setLiveRiders((prev) => ({ ...prev, ...updatedCoords }));
        }
      } catch (err) {
        // Silently skip background poll error
      }
    }, 6000);

    return () => clearInterval(pollInterval);
  }, [isOpen]);

  // Center on selected rider
  const handleSelectRider = (id: number) => {
    setSelectedRiderId(id);
    const coords = liveRiders[id];
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(coords);
      mapInstanceRef.current.setZoom(16);
      updateRoutePolyline(coords);
    } else {
      updateRoutePolyline(null);
    }
  };

  // Center on Empire Plaza Kitchen
  const handleCenterRestaurant = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(RESTAURANT_LOCATION);
      mapInstanceRef.current.setZoom(15);
    }
  };

  // Fit all active riders & restaurant in view
  const handleFitAll = () => {
    const map = mapInstanceRef.current;
    const google = (window as any).google;
    if (!map || !google?.maps) return;

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(RESTAURANT_LOCATION);

    const activeCoords = Object.values(liveRiders);
    activeCoords.forEach((c) => bounds.extend(c));

    map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
  };

  if (!isOpen) return null;

  const selectedRider = allRiders.find((r) => r.id === selectedRiderId);
  const selectedCoords = selectedRiderId ? liveRiders[selectedRiderId] : null;

  // Calculate physical distance from Kitchen
  let distanceText = "";
  if (selectedCoords) {
    const km = calculateDistanceKm(
      RESTAURANT_LOCATION.lat,
      RESTAURANT_LOCATION.lng,
      selectedCoords.lat,
      selectedCoords.lng
    );
    distanceText = km < 1 ? `${Math.round(km * 1000)} meters` : `${km.toFixed(1)} KM`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 bg-[var(--brand-green-dark)] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-amber-300 shadow-inner">
              <Bike size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black tracking-wide uppercase font-sans">
                  Live Fleet Tracking Map
                </h3>
                <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Swiggy Live GPS
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-white/70 font-medium">
                Real-time satellite tracking of active delivery partners
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFitAll}
              title="Fit all riders and restaurant on map"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
            >
              <Layers size={13} /> Fit All
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content: Map + Side Rider List */}
        <div className="flex-1 flex flex-col sm:flex-row min-h-0">
          
          {/* Map Area */}
          <div className="relative flex-1 h-3/5 sm:h-full bg-stone-100 overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-100/90 gap-2">
                <Loader2 size={28} className="animate-spin text-[var(--brand-green-dark)]" />
                <span className="text-xs font-bold text-stone-700">Connecting Google Maps Satellite Feed...</span>
              </div>
            )}

            {mapError && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-50 p-4 text-center">
                <MapPin size={24} className="text-red-500 mb-1" />
                <span className="text-xs font-semibold text-red-600">{mapError}</span>
              </div>
            )}

            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Floating Map Quick Controls */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={handleCenterRestaurant}
                className="bg-white/95 backdrop-blur-md hover:bg-white text-[var(--brand-green-dark)] border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer"
              >
                <Store size={13} className="text-amber-600" /> Empire Plaza Kitchen
              </button>

              {selectedCoords && (
                <button
                  type="button"
                  onClick={() => selectedRiderId && handleSelectRider(selectedRiderId)}
                  className="bg-white/95 backdrop-blur-md hover:bg-white text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Navigation size={13} className="text-emerald-600" /> Locate Rider
                </button>
              )}
            </div>

            {/* Selected Rider Floating Card on Map */}
            {selectedRider && (
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm z-10 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 p-3.5 shadow-2xl flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-mono font-black bg-[var(--brand-green-dark)] text-amber-300 px-2 py-0.5 rounded shadow-xs">
                        {selectedRider.employee_id || `DB-${selectedRider.id}`}
                      </span>
                      <h4 className="text-xs font-black text-gray-900 truncate">
                        {[selectedRider.first_name, selectedRider.last_name].filter(Boolean).join(" ") || selectedRider.username}
                      </h4>
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                      Vehicle: <span className="font-bold text-gray-800">{selectedRider.delivery_profile?.vehicle_number || selectedRider.vehicle_number || "KL Registered"}</span>
                    </p>
                    {distanceText && (
                      <p className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                        <Compass size={11} className="text-emerald-600" /> {distanceText} from Kitchen
                      </p>
                    )}
                  </div>

                  <span
                    className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                      selectedCoords
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {selectedCoords ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        GPS Live
                      </>
                    ) : (
                      "No Signal"
                    )}
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
          <div className="w-full sm:w-80 sm:border-l border-t sm:border-t-0 border-gray-200 bg-gray-50 flex flex-col shrink-0">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-700">
                Riders Fleet ({allRiders.length})
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {Object.keys(liveRiders).length} with GPS
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {allRiders.map((rider) => {
                const isSelected = rider.id === selectedRiderId;
                const coords = liveRiders[rider.id];
                const name = [rider.first_name, rider.last_name].filter(Boolean).join(" ") || rider.username;

                let riderDist = "";
                if (coords) {
                  const d = calculateDistanceKm(RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng, coords.lat, coords.lng);
                  riderDist = d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`;
                }

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
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          coords
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Bike size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-black text-gray-900 truncate">{name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">
                          {rider.employee_id || `DB-${rider.id}`}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {coords ? (
                        <div>
                          <span className="text-[9px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            Live
                          </span>
                          {riderDist && (
                            <span className="text-[9px] text-gray-500 font-mono block">
                              {riderDist} away
                            </span>
                          )}
                        </div>
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

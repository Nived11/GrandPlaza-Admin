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
  Layers,
  List,
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
  Search
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
    last_location_updated_at?: string | null;
    is_gps_active?: boolean;
    last_known_latitude?: number | null;
    last_known_longitude?: number | null;
    last_seen_seconds_ago?: number | null;
  };
}

// 🛡️ Verify if a delivery partner's GPS signal is fresh & actively online
export function isRiderGpsActive(rider: Rider): boolean {
  const profile = rider.delivery_profile;
  if (!profile) return false;
  if (!profile.is_on_duty) return false;
  if (profile.current_latitude == null || profile.current_longitude == null) return false;
  if (isNaN(Number(profile.current_latitude)) || isNaN(Number(profile.current_longitude))) return false;
  if (profile.is_gps_active === false) return false;

  // Staleness threshold: 150 seconds (2.5 minutes)
  if (profile.last_location_updated_at) {
    const ageMs = Date.now() - new Date(profile.last_location_updated_at).getTime();
    if (ageMs > 150 * 1000) {
      return false;
    }
  }

  return true;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  riders: Rider[];
  initialSelectedRiderId?: number | null;
}

// 🏢 Empire Plaza Main Kitchen (Kadavanthra, Kochi, Kerala)
const RESTAURANT_LOCATION = { lat: 9.967625, lng: 76.304040 };

// 🛵 Real-time Fleet Partner Delivery Scooter SVG Marker
function getFleetBikeSvg(isBusy: boolean): string {
  const primaryColor = isBusy ? "#D97706" : "#059669";
  const badgeText = isBusy ? "BUSY" : "LIVE";
  const badgeBg = isBusy ? "#F59E0B" : "#10B981";

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="72" viewBox="0 0 60 72">
    <defs>
      <filter id="pin-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3.5" stdDeviation="3" flood-color="#000000" flood-opacity="0.38"/>
      </filter>
      <linearGradient id="pin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F3D2E"/>
        <stop offset="100%" stop-color="#062319"/>
      </linearGradient>
    </defs>

    <!-- Pulsing Radar circle under needle tip -->
    <circle cx="30" cy="64" r="7" fill="${primaryColor}" opacity="0.45">
      <animate attributeName="r" from="3" to="12" dur="1.4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.9" to="0" dur="1.4s" repeatCount="indefinite"/>
    </circle>

    <!-- Map Pin Teardrop Shape -->
    <path d="M30 4 C16 4 6 14 6 28 C6 41 26 61 29 64.2 C29.5 64.8 30.5 64.8 31 64.2 C34 61 54 41 54 28 C54 14 44 4 30 4 Z"
          fill="url(#pin-grad)"
          stroke="#D4AF37"
          stroke-width="2.2"
          filter="url(#pin-shadow)"/>

    <!-- High-Contrast Crisp White Inner Disc -->
    <circle cx="30" cy="27" r="19" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="0.8"/>

    <!-- Delivery Scooter & Rider Graphic -->
    <g transform="translate(13.5, 13)">
      <!-- Amber Delivery Thermal Bag/Box -->
      <rect x="1" y="7" width="9" height="9" rx="1.5" fill="#D97706" stroke="#92400E" stroke-width="0.7"/>
      <path d="M1 11.5 H10" stroke="#FDE68A" stroke-width="1"/>
      <circle cx="5.5" cy="9.2" r="1" fill="#FFFFFF"/>

      <!-- Rider Helmet -->
      <circle cx="17" cy="4" r="4" fill="#0F3D2E" stroke="#D4AF37" stroke-width="0.8"/>
      <path d="M19 3.5 C20 4.2 20.5 5.5 19.5 6.5 L17.5 6.5" stroke="#38BDF8" stroke-width="1" stroke-linecap="round" fill="none"/>

      <!-- Rider Jacket & Arm -->
      <path d="M13.5 8 C14.5 7 18 7 19.5 10.5 L16 14 L12 12.5 Z" fill="#0F3D2E"/>
      <path d="M17 10 L23 11.5" stroke="#0F3D2E" stroke-width="1.8" stroke-linecap="round"/>

      <!-- Handlebar & Mirror -->
      <path d="M22 9 L24.5 9" stroke="#334155" stroke-width="1.2" stroke-linecap="round"/>

      <!-- Scooter Windshield & Front Cowl -->
      <path d="M22.5 10.5 L27 13 L25 16.5 L22 15 Z" fill="#059669"/>
      <!-- Headlight Yellow Glow -->
      <path d="M27 13.5 L28.8 14.2" stroke="#FACC15" stroke-width="1.8" stroke-linecap="round"/>

      <!-- Scooter Body & Footboard -->
      <path d="M10 14.5 L15 16 L22 16 L20 19.5 L10 18 Z" fill="#059669"/>
      <path d="M9.5 17.5 L22.5 17.5" stroke="#047857" stroke-width="1.2" stroke-linecap="round"/>

      <!-- Fenders -->
      <path d="M3 18 C3 15 9.5 15 9.5 18" stroke="#059669" stroke-width="1.6" fill="none"/>
      <path d="M20.5 18 C20.5 15 27 15 27 18" stroke="#059669" stroke-width="1.6" fill="none"/>

      <!-- Rear Wheel (Black Tire + White Rim + Gold Hub) -->
      <circle cx="6.5" cy="19.5" r="4.2" fill="#1E293B" stroke="#0F172A" stroke-width="1.2"/>
      <circle cx="6.5" cy="19.5" r="2.2" fill="#E2E8F0"/>
      <circle cx="6.5" cy="19.5" r="0.9" fill="#D4AF37"/>

      <!-- Front Wheel (Black Tire + White Rim + Gold Hub) -->
      <circle cx="23.5" cy="19.5" r="4.2" fill="#1E293B" stroke="#0F172A" stroke-width="1.2"/>
      <circle cx="23.5" cy="19.5" r="2.2" fill="#E2E8F0"/>
      <circle cx="23.5" cy="19.5" r="0.9" fill="#D4AF37"/>
    </g>

    <!-- Top Status Badge (LIVE / BUSY) -->
    <rect x="18" y="1" width="24" height="8.5" rx="4.25" fill="${badgeBg}" stroke="#FFFFFF" stroke-width="0.8"/>
    <text x="30" y="7" font-family="system-ui, -apple-system, sans-serif" font-size="6" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">${badgeText}</text>
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
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fleetFilter, setFleetFilter] = useState<"all" | "live" | "offline">("all");

  // Sync initial rider coordinates from props
  useEffect(() => {
    setAllRiders(riders);
    const coordsMap: { [key: number]: { lat: number; lng: number } } = {};
    let firstLiveId: number | null = null;

    riders.forEach((r) => {
      if (isRiderGpsActive(r)) {
        coordsMap[r.id] = {
          lat: Number(r.delivery_profile!.current_latitude),
          lng: Number(r.delivery_profile!.current_longitude),
        };
        if (!firstLiveId) firstLiveId = r.id;
      }
    });

    // Directly set active coordinates (do NOT keep stale riders via prev)
    setLiveRiders(coordsMap);

    // Auto-select first live rider if none selected
    if (!selectedRiderId && (initialSelectedRiderId || firstLiveId)) {
      setSelectedRiderId(initialSelectedRiderId || firstLiveId);
    }
  }, [riders, initialSelectedRiderId]);

  // Smoothly animate marker gliding to new coordinates with easing
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

  const [roadInfo, setRoadInfo] = useState<{ [key: number]: { distanceText: string; durationText: string } }>({});
  const routingAbortRef = useRef<AbortController | null>(null);

  // Update Route Polyline between Kitchen and selected Rider with actual road navigation path
  const updateRoutePolyline = useCallback(async (
    riderCoords: { lat: number; lng: number } | null,
    riderId?: number | null
  ) => {
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

    if (routingAbortRef.current) {
      routingAbortRef.current.abort();
    }
    const abortController = new AbortController();
    routingAbortRef.current = abortController;

    let roadPath: { lat: number; lng: number }[] | null = null;
    let distanceStr: string | null = null;
    let durationStr: string | null = null;

    try {
      // Real-time Road Routing via OSRM Driving Engine
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${RESTAURANT_LOCATION.lng},${RESTAURANT_LOCATION.lat};${riderCoords.lng},${riderCoords.lat}?overview=full&geometries=geojson`,
        { signal: abortController.signal }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          roadPath = route.geometry.coordinates.map((c: [number, number]) => ({
            lat: c[1],
            lng: c[0],
          }));
          const distKm = (route.distance / 1000).toFixed(1);
          const durMin = Math.max(1, Math.round(route.duration / 60));
          distanceStr = `${distKm} KM`;
          durationStr = `${durMin} mins`;
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        console.warn("Road routing fetch error:", e);
      }
    }

    // Graceful fallback to straight line if offline or routing unavailable
    if (!roadPath || roadPath.length === 0) {
      roadPath = [RESTAURANT_LOCATION, riderCoords];
    }

    if (riderId && distanceStr) {
      setRoadInfo((prev) => ({
        ...prev,
        [riderId]: { distanceText: distanceStr!, durationText: durationStr || "" },
      }));
    }

    if (polylineRef.current) {
      polylineRef.current.setPath(roadPath);
    } else {
      polylineRef.current = new google.maps.Polyline({
        path: roadPath,
        geodesic: true,
        strokeColor: "#059669",
        strokeOpacity: 0.9,
        strokeWeight: 5,
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
              url: getFleetBikeSvg(isBusy),
              scaledSize: new google.maps.Size(56, 68),
              anchor: new google.maps.Point(28, 65),
            },
            zIndex: 900,
          });

          marker.addListener("click", () => {
            setSelectedRiderId(rider.id);
            map.panTo(coords);
            map.setZoom(16);
            updateRoutePolyline(coords, rider.id);
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
          updateRoutePolyline(targetRiderCoords, selectedRiderId);
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

    // 1. Remove markers for riders who are no longer active in liveRiders
    Object.keys(markersRef.current).forEach((idStr) => {
      const riderId = Number(idStr);
      if (!liveRiders[riderId]) {
        markersRef.current[riderId].setMap(null);
        delete markersRef.current[riderId];
      }
    });

    // 2. Add or update markers for live active riders
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
          url: getFleetBikeSvg(isBusy),
          scaledSize: new google.maps.Size(56, 68),
          anchor: new google.maps.Point(28, 65),
        });
      } else {
        // Create new marker
        const newMarker = new google.maps.Marker({
          position: coords,
          map,
          title: `${name} (${rider.employee_id || `DB-${rider.id}`})`,
          icon: {
            url: getFleetBikeSvg(isBusy),
            scaledSize: new google.maps.Size(56, 68),
            anchor: new google.maps.Point(28, 65),
          },
          zIndex: 900,
        });

        newMarker.addListener("click", () => {
          setSelectedRiderId(rider.id);
          map.panTo(coords);
          map.setZoom(16);
          updateRoutePolyline(coords, rider.id);
        });

        markersRef.current[rider.id] = newMarker;
      }
    });

    // Update polyline for currently selected rider
    if (selectedRiderId && liveRiders[selectedRiderId]) {
      updateRoutePolyline(liveRiders[selectedRiderId], selectedRiderId);
    } else {
      updateRoutePolyline(null);
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
      latitude?: number | null;
      longitude?: number | null;
      is_on_duty?: boolean;
      is_busy?: boolean;
      is_gps_active?: boolean;
      last_seen?: string;
    }) => {
      if (!data.delivery_boy_id) return;
      const riderId = Number(data.delivery_boy_id);

      // If location is lost, disabled, or coordinates are null:
      if (data.latitude == null || data.longitude == null || data.is_gps_active === false) {
        setLiveRiders((prev) => {
          if (!prev[riderId]) return prev;
          const next = { ...prev };
          delete next[riderId];
          return next;
        });

        setAllRiders((prev) =>
          prev.map((r) =>
            r.id === riderId
              ? {
                  ...r,
                  delivery_profile: {
                    ...r.delivery_profile,
                    current_latitude: null,
                    current_longitude: null,
                    is_gps_active: false,
                    is_on_duty: data.is_on_duty !== undefined ? Boolean(data.is_on_duty) : r.delivery_profile?.is_on_duty,
                  },
                }
              : r
          )
        );

        if (markersRef.current[riderId]) {
          markersRef.current[riderId].setMap(null);
          delete markersRef.current[riderId];
        }

        if (selectedRiderId === riderId) {
          updateRoutePolyline(null, riderId);
        }
        return;
      }

      // Valid live coordinates received:
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

      // Update rider's status and coordinates in allRiders list in real-time
      setAllRiders((prev) =>
        prev.map((r) =>
          r.id === riderId
            ? {
                ...r,
                delivery_profile: {
                  ...r.delivery_profile,
                  is_on_duty: data.is_on_duty !== undefined ? Boolean(data.is_on_duty) : true,
                  is_busy: data.is_busy !== undefined ? Boolean(data.is_busy) : r.delivery_profile?.is_busy,
                  current_latitude: newCoords.lat,
                  current_longitude: newCoords.lng,
                  is_gps_active: true,
                  last_location_updated_at: data.last_seen || new Date().toISOString(),
                },
              }
            : r
        )
      );

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
        updateRoutePolyline(newCoords, riderId);
      }
    };

    const handleLocationLost = (data: { delivery_boy_id: number }) => {
      if (!data.delivery_boy_id) return;
      const riderId = Number(data.delivery_boy_id);
      setLiveRiders((prev) => {
        if (!prev[riderId]) return prev;
        const next = { ...prev };
        delete next[riderId];
        return next;
      });

      if (markersRef.current[riderId]) {
        markersRef.current[riderId].setMap(null);
        delete markersRef.current[riderId];
      }

      if (selectedRiderId === riderId) {
        updateRoutePolyline(null, riderId);
      }
    };

    const handleDutyUpdate = (data: { delivery_boy_id: number; is_on_duty: boolean }) => {
      const riderId = Number(data.delivery_boy_id);
      setAllRiders((prev) =>
        prev.map((r) =>
          r.id === riderId
            ? {
                ...r,
                delivery_profile: {
                  ...r.delivery_profile,
                  is_on_duty: Boolean(data.is_on_duty),
                },
              }
            : r
        )
      );

      // If duty went offline, remove their marker and coordinates from live tracking
      if (!data.is_on_duty) {
        setLiveRiders((prev) => {
          if (!prev[riderId]) return prev;
          const next = { ...prev };
          delete next[riderId];
          return next;
        });

        if (markersRef.current[riderId]) {
          markersRef.current[riderId].setMap(null);
          delete markersRef.current[riderId];
        }

        if (selectedRiderId === riderId) {
          updateRoutePolyline(null, riderId);
        }
      }
    };

    channel.bind("delivery-location-updated", handleLocationUpdate);
    channel.bind("delivery-location-lost", handleLocationLost);
    channel.bind("delivery-duty-updated", handleDutyUpdate);

    return () => {
      channel.unbind("delivery-location-updated", handleLocationUpdate);
      channel.unbind("delivery-location-lost", handleLocationLost);
      channel.unbind("delivery-duty-updated", handleDutyUpdate);
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
          const freshCoords: { [key: number]: { lat: number; lng: number } } = {};
          res.data.forEach((r: Rider) => {
            if (isRiderGpsActive(r)) {
              freshCoords[r.id] = {
                lat: Number(r.delivery_profile!.current_latitude),
                lng: Number(r.delivery_profile!.current_longitude),
              };
            }
          });
          // Replace directly with fresh coords (drops offline/disabled riders)
          setLiveRiders(freshCoords);
        }
      } catch (err) {
        // Silently skip background poll error
      }
    }, 6000);

    return () => clearInterval(pollInterval);
  }, [isOpen]);

  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  // Manual Refresh fleet status from server on demand
  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      const res = await axiosInstance.get(`/accounts/admin/delivery-boys?_t=${Date.now()}`, {
        headers: { "Cache-Control": "no-cache" }
      });
      if (Array.isArray(res.data)) {
        setAllRiders(res.data);
        const freshCoords: { [key: number]: { lat: number; lng: number } } = {};
        res.data.forEach((r: Rider) => {
          if (isRiderGpsActive(r)) {
            freshCoords[r.id] = {
              lat: Number(r.delivery_profile!.current_latitude),
              lng: Number(r.delivery_profile!.current_longitude),
            };
          }
        });
        // Replace directly with fresh coords (drops offline/disabled riders)
        setLiveRiders(freshCoords);
      }
    } catch (err) {
      console.error("Manual refresh error:", err);
    } finally {
      setIsManualRefreshing(false);
    }
  };

  // Center on selected rider
  const handleSelectRider = (id: number) => {
    setSelectedRiderId(id);
    setIsCardCollapsed(false);
    setMobileTab("map"); // On mobile, automatically show the map!
    const coords = liveRiders[id];
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(coords);
      mapInstanceRef.current.setZoom(16);
      updateRoutePolyline(coords, id);
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

  // Filtered riders for search & status tabs
  const filteredRiders = allRiders.filter((rider) => {
    const name = [rider.first_name, rider.last_name].filter(Boolean).join(" ") || rider.username;
    const empId = rider.employee_id || `DB-${rider.id}`;
    const matchesSearch =
      searchQuery.trim() === "" ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      empId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const isLive = Boolean(liveRiders[rider.id]);
    if (fleetFilter === "live") return isLive;
    if (fleetFilter === "offline") return !isLive;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-full sm:h-[90vh] bg-white rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border border-gray-200">
        
        {/* Header */}
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3 bg-[var(--brand-green-dark)] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-amber-300 shadow-inner">
              <Bike size={18} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-base font-black tracking-wide uppercase font-sans">
                  Live Fleet Tracking Map
                </h3>
                <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {Object.keys(liveRiders).length} Active Live
                </span>
              </div>
              <p className="text-[9px] sm:text-xs text-white/70 font-medium hidden sm:block">
                Real-time satellite tracking of active delivery partners
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isManualRefreshing}
              title="Refresh live fleet positions"
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
            >
              <RefreshCw size={13} className={isManualRefreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

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

        {/* Mobile View Switcher (Map vs Fleet List) */}
        <div className="sm:hidden flex items-center border-b border-gray-200 bg-gray-100 p-1.5 gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setMobileTab("map")}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
              mobileTab === "map"
                ? "bg-[var(--brand-green-dark)] text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <MapIcon size={13} className={mobileTab === "map" ? "text-amber-300" : "text-gray-500"} />
            <span>Map View</span>
            {Object.keys(liveRiders).length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setMobileTab("list")}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
              mobileTab === "list"
                ? "bg-[var(--brand-green-dark)] text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <List size={13} className={mobileTab === "list" ? "text-amber-300" : "text-gray-500"} />
            <span>Fleet List ({allRiders.length})</span>
            {Object.keys(liveRiders).length > 0 && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full ml-0.5">
                {Object.keys(liveRiders).length} Live
              </span>
            )}
          </button>
        </div>

        {/* Content: Map + Side Rider List */}
        <div className="flex-1 flex flex-col sm:flex-row min-h-0 relative">
          
          {/* Map Area */}
          <div
            className={`relative flex-1 bg-stone-100 overflow-hidden ${
              mobileTab === "list" ? "hidden sm:flex sm:flex-col" : "flex flex-col h-full"
            }`}
          >
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
            <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={handleCenterRestaurant}
                className="bg-white/95 backdrop-blur-md hover:bg-white text-[var(--brand-green-dark)] border border-gray-200 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer"
              >
                <Store size={13} className="text-amber-600" /> Empire Plaza Kitchen
              </button>

              {selectedCoords && (
                <button
                  type="button"
                  onClick={() => selectedRiderId && handleSelectRider(selectedRiderId)}
                  className="bg-white/95 backdrop-blur-md hover:bg-white text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Navigation size={13} className="text-emerald-600" /> Locate Rider
                </button>
              )}

              {/* Mobile shortcut to switch to list */}
              <button
                type="button"
                onClick={() => setMobileTab("list")}
                className="sm:hidden bg-white/95 backdrop-blur-md hover:bg-white text-gray-700 border border-gray-200 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer"
              >
                <List size={13} className="text-[var(--brand-green-dark)]" /> Fleet ({allRiders.length})
              </button>
            </div>

            {/* Selected Rider Minimized Bottom Pill */}
            {selectedRider && isCardCollapsed && (
              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto sm:max-w-sm z-10 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 px-3 py-2 shadow-2xl flex items-center justify-between gap-2 animate-in slide-in-from-bottom duration-150">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[9px] font-mono font-black bg-[var(--brand-green-dark)] text-amber-300 px-1.5 py-0.5 rounded shadow-xs shrink-0">
                    {selectedRider.employee_id || `DB-${selectedRider.id}`}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-gray-900 truncate">
                      {[selectedRider.first_name, selectedRider.last_name].filter(Boolean).join(" ") || selectedRider.username}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium truncate">
                      {selectedCoords ? `${roadInfo[selectedRider.id]?.distanceText || distanceText} away` : "GPS Inactive"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCardCollapsed(false)}
                    className="py-1 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition"
                    title="Show Details"
                  >
                    <ChevronUp size={13} /> Details
                  </button>
                </div>
              </div>
            )}

            {/* Selected Rider Full Floating Card on Map */}
            {selectedRider && !isCardCollapsed && (
              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto sm:max-w-sm z-10 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 p-3 shadow-2xl flex flex-col gap-2 max-h-[45vh] overflow-y-auto animate-in slide-in-from-bottom duration-150">
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
                    <p className="text-[10px] sm:text-[11px] text-gray-600 font-medium mt-0.5">
                      Vehicle: <span className="font-bold text-gray-800">{selectedRider.delivery_profile?.vehicle_number || selectedRider.vehicle_number || "KL Registered"}</span>
                    </p>
                    {(() => {
                      const road = selectedRider ? roadInfo[selectedRider.id] : null;
                      if (road?.distanceText) {
                        return (
                          <p className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                            <Compass size={11} className="text-emerald-600" /> {road.distanceText} ({road.durationText} via road) from Kitchen
                          </p>
                        );
                      }
                      return distanceText ? (
                        <p className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                          <Compass size={11} className="text-emerald-600" /> {distanceText} from Kitchen
                        </p>
                      ) : null;
                    })()}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
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
                      ) : selectedRider.delivery_profile?.is_on_duty ? (
                        "GPS Inactive"
                      ) : (
                        "Off Duty"
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={() => setIsCardCollapsed(true)}
                      className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer transition"
                      title="Minimize Card"
                    >
                      <ChevronDown size={15} />
                    </button>
                  </div>
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
          <div
            className={`w-full sm:w-80 sm:border-l border-t sm:border-t-0 border-gray-200 bg-gray-50 flex flex-col shrink-0 ${
              mobileTab === "map" ? "hidden sm:flex" : "flex flex-1 h-full"
            }`}
          >
            <div className="p-3 border-b border-gray-200 bg-white flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-700">
                  Riders Fleet ({allRiders.length})
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {Object.keys(liveRiders).length} Live GPS
                </span>
              </div>

              {/* Quick Search */}
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rider name or DB ID..."
                  className="w-full pl-8 pr-3 py-1 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[var(--brand-green-dark)] focus:bg-white transition"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 text-[10px] font-bold pt-0.5">
                <button
                  type="button"
                  onClick={() => setFleetFilter("all")}
                  className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                    fleetFilter === "all" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All ({allRiders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFleetFilter("live")}
                  className={`px-2 py-0.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    fleetFilter === "live" ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live ({Object.keys(liveRiders).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFleetFilter("offline")}
                  className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                    fleetFilter === "offline" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Inactive ({allRiders.length - Object.keys(liveRiders).length})
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredRiders.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500 font-medium">
                  No riders matching your search or filter.
                </div>
              ) : (
                filteredRiders.map((rider) => {
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
                        ) : rider.delivery_profile?.is_on_duty ? (
                          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            GPS Inactive
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium text-gray-400">
                            Off Duty
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

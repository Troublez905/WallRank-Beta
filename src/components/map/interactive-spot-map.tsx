"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useEffect, useRef, useState } from "react";

import type { SpotListItem } from "@/types/domain";

type InteractiveSpotMapProps = {
  apiKey: string | null;
  spots: SpotListItem[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildInfoWindowHtml(spot: SpotListItem) {
  return `
    <div style="min-width:220px;padding:4px 2px;color:#111827;font-family:Arial,sans-serif;">
      <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#9a3412;">${escapeHtml(spot.location.city)}</div>
      <div style="margin-top:8px;font-size:18px;font-weight:700;line-height:1.2;">${escapeHtml(spot.title)}</div>
      <div style="margin-top:6px;font-size:13px;color:#4b5563;">${escapeHtml(spot.artist.tagName)} / ${escapeHtml(spot.category)}</div>
      <div style="margin-top:10px;font-size:13px;color:#4b5563;">${spot.avgRating.toFixed(1)} avg / ${spot.ratingsCount} ratings</div>
      <a href="/spots/${encodeURIComponent(spot.slug)}" style="display:inline-block;margin-top:14px;padding:8px 14px;border-radius:999px;background:#ff6a00;color:#111827;font-size:13px;font-weight:600;text-decoration:none;">View spot</a>
    </div>
  `;
}

function getMapCenter(spots: SpotListItem[]) {
  if (spots.length === 0) {
    return { lat: 43.2557, lng: -79.8711 };
  }

  const totals = spots.reduce(
    (sum, spot) => ({
      lat: sum.lat + spot.location.latitude,
      lng: sum.lng + spot.location.longitude,
    }),
    { lat: 0, lng: 0 },
  );

  return {
    lat: totals.lat / spots.length,
    lng: totals.lng / spots.length,
  };
}

export function InteractiveSpotMap({ apiKey, spots }: InteractiveSpotMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(
    apiKey ? null : "Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the live Google Map.",
  );
  const resolvedApiKey = apiKey ?? undefined;

  useEffect(() => {
    if (!resolvedApiKey || !containerRef.current || spots.length === 0) {
      return;
    }

    let isDisposed = false;
    let clusterer: MarkerClusterer | null = null;
    const markers: google.maps.Marker[] = [];

    async function mountMap() {
      try {
        setOptions({
          key: resolvedApiKey,
          v: "weekly",
        });

        const [{ Map, InfoWindow }, { Marker }] = await Promise.all([
          importLibrary("maps") as Promise<google.maps.MapsLibrary>,
          importLibrary("marker") as Promise<google.maps.MarkerLibrary>,
        ]);

        if (isDisposed || !containerRef.current) {
          return;
        }

        const map = new Map(containerRef.current, {
          center: getMapCenter(spots),
          zoom: spots.length > 1 ? 8 : 12,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#111315" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#d4b38b" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#111315" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#24272a" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#8d9094" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1114" }] },
          ],
        });

        const infoWindow = new InfoWindow();
        const bounds = new google.maps.LatLngBounds();

        spots.forEach((spot) => {
          const marker = new Marker({
            position: {
              lat: spot.location.latitude,
              lng: spot.location.longitude,
            },
            title: spot.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: spot.isFeatured ? 10 : 8,
              fillColor: spot.isFeatured ? "#ff6a00" : "#d4b38b",
              fillOpacity: 1,
              strokeColor: "#111315",
              strokeWeight: 2,
            },
          });

          marker.addListener("click", () => {
            infoWindow.setContent(buildInfoWindowHtml(spot));
            infoWindow.open({
              anchor: marker,
              map,
            });
          });

          markers.push(marker);
          bounds.extend({
            lat: spot.location.latitude,
            lng: spot.location.longitude,
          });
        });

        clusterer = new MarkerClusterer({
          map,
          markers,
        });

        if (spots.length > 1) {
          map.fitBounds(bounds, 80);
        }
      } catch {
        if (!isDisposed) {
          setError("Unable to load Google Maps right now. Check the API key and billing setup.");
        }
      }
    }

    mountMap();

    return () => {
      isDisposed = true;
      clusterer?.clearMarkers();
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [resolvedApiKey, spots]);

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-line bg-[linear-gradient(180deg,#17191a_0%,#101112_100%)]">
      <div ref={containerRef} className="absolute inset-0" />
      {spots.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/35 p-6 text-center text-sm text-muted">
          No spots match the current filters.
        </div>
      ) : null}
      {error ? (
        <div className="absolute inset-x-6 bottom-6 rounded-[22px] border border-line bg-black/75 px-4 py-3 text-sm text-muted backdrop-blur">
          {error}
        </div>
      ) : null}
    </div>
  );
}

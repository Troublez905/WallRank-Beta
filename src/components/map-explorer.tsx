"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapLibreMap, MapLayerMouseEvent } from "maplibre-gl";

import type { SpotListItem } from "@/types/domain";

type ViewMode = "map" | "list";
type MapExplorerProps = { spots: SpotListItem[] };

function distanceKm(a: [number, number], b: [number, number]) {
  const toRad = (value: number) => value * Math.PI / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function MapExplorer({ spots }: MapExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [view, setView] = useState<ViewMode>("map");
  const [search, setSearch] = useState("");
  const [nearby, setNearby] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState("");

  const visibleSpots = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const filtered = normalized ? spots.filter((spot) => [spot.title, spot.artist.tagName, spot.location.name, spot.location.city, spot.category].some((value) => value.toLowerCase().includes(normalized))) : spots;
    if (!nearby) return filtered;
    return [...filtered].sort((a, b) => distanceKm(nearby, [a.location.longitude, a.location.latitude]) - distanceKm(nearby, [b.location.longitude, b.location.latitude]));
  }, [nearby, search, spots]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || view !== "map") return;
    let cancelled = false;
    void import("maplibre-gl").then(({ default: maplibregl }) => {
      if (cancelled || !containerRef.current) return;
      const map = new maplibregl.Map({
        container: containerRef.current,
        center: [-79.87, 43.25],
        zoom: 8,
        style: {
          version: 8,
          sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap contributors" } },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => {
        map.addSource("spots", {
          type: "geojson",
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 48,
          data: {
            type: "FeatureCollection",
            features: spots.map((spot) => ({ type: "Feature", geometry: { type: "Point", coordinates: [spot.location.longitude, spot.location.latitude] }, properties: { slug: spot.slug, title: spot.title, artist: spot.artist.tagName, city: spot.location.city } })),
          },
        });
        map.addLayer({ id: "clusters", type: "circle", source: "spots", filter: ["has", "point_count"], paint: { "circle-color": "#ffe600", "circle-radius": ["step", ["get", "point_count"], 18, 10, 24, 30, 30], "circle-stroke-width": 4, "circle-stroke-color": "#f31924" } });
        map.addLayer({ id: "cluster-count", type: "symbol", source: "spots", filter: ["has", "point_count"], layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 13 }, paint: { "text-color": "#050505" } });
        map.addLayer({ id: "spots", type: "circle", source: "spots", filter: ["!", ["has", "point_count"]], paint: { "circle-color": "#ff1744", "circle-radius": 9, "circle-stroke-width": 3, "circle-stroke-color": "#ffffff" } });
        map.on("click", "clusters", async (event: MapLayerMouseEvent) => {
          const feature = map.queryRenderedFeatures(event.point, { layers: ["clusters"] })[0];
          const clusterId = feature?.properties?.cluster_id;
          const source = map.getSource("spots") as import("maplibre-gl").GeoJSONSource;
          if (typeof clusterId === "number") map.easeTo({ center: (feature.geometry as GeoJSON.Point).coordinates as [number, number], zoom: await source.getClusterExpansionZoom(clusterId) });
        });
        map.on("click", "spots", (event: MapLayerMouseEvent) => {
          const feature = event.features?.[0];
          const coordinates = (feature?.geometry as GeoJSON.Point | undefined)?.coordinates as [number, number] | undefined;
          if (!coordinates) return;
          new maplibregl.Popup({ offset: 14 }).setLngLat(coordinates).setHTML(`<strong>${feature?.properties?.title}</strong><br/>${feature?.properties?.artist} · ${feature?.properties?.city}<br/><a href="/spots/${feature?.properties?.slug}">View spot →</a>`).addTo(map);
        });
        for (const layer of ["clusters", "spots"]) {
          map.on("mouseenter", layer, () => { map.getCanvas().style.cursor = "pointer"; });
          map.on("mouseleave", layer, () => { map.getCanvas().style.cursor = ""; });
        }
        if (spots.length > 1) {
          const bounds = new maplibregl.LngLatBounds();
          spots.forEach((spot) => bounds.extend([spot.location.longitude, spot.location.latitude]));
          map.fitBounds(bounds, { padding: 60, maxZoom: 13 });
        }
      });
      mapRef.current = map;
    });
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null; };
  }, [spots, view]);

  function findNearby() {
    setLocationError("");
    if (!navigator.geolocation) { setLocationError("Location services are not available in this browser."); return; }
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const location: [number, number] = [coords.longitude, coords.latitude];
      setNearby(location);
      setView("map");
      mapRef.current?.flyTo({ center: location, zoom: 13 });
    }, () => setLocationError("We could not access your location. Check browser permissions and try again."), { enableHighAccuracy: true, timeout: 10000 });
  }

  return (
    <div className="grid gap-5">
      <div className="panel grid gap-4 rounded-[28px] p-4 md:grid-cols-[1fr_auto_auto]">
        <label className="grid gap-2"><span className="sr-only">Search visible spots</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search walls, artists, cities…" className="border border-line bg-black px-4 py-3 outline-none focus:border-accent" /></label>
        <button type="button" onClick={findNearby} className="street-button">Near me</button>
        <div className="flex border border-line p-1"><button type="button" onClick={() => setView("map")} aria-pressed={view === "map"} className={`px-4 py-2 font-bold uppercase ${view === "map" ? "bg-accent text-black" : ""}`}>Map</button><button type="button" onClick={() => setView("list")} aria-pressed={view === "list"} className={`px-4 py-2 font-bold uppercase ${view === "list" ? "bg-accent text-black" : ""}`}>List</button></div>
      </div>
      {locationError ? <p className="border border-red bg-red/10 p-3 text-sm text-red-neon" role="alert">{locationError}</p> : null}
      {view === "map" ? <div ref={containerRef} className="map-canvas panel h-[620px] overflow-hidden rounded-[32px]" aria-label="Interactive map of WallRank artwork" /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {visibleSpots.map((spot) => <article key={spot.id} className="panel overflow-hidden rounded-[28px]"><div className="h-44 bg-cover bg-center" style={{backgroundImage:`linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.72)),url(${spot.primaryImage?.thumbnailUrl ?? spot.primaryImage?.imageUrl ?? ""})`}}/><div className="p-5"><div className="text-xs font-bold uppercase tracking-[.18em] text-accent">{spot.category} · {spot.location.city}</div><h3 className="display mt-2 text-3xl">{spot.title}</h3><p className="mt-2 text-sm text-muted">{spot.artist.tagName} · {spot.avgRating.toFixed(1)} ★{nearby ? ` · ${distanceKm(nearby,[spot.location.longitude,spot.location.latitude]).toFixed(1)} km` : ""}</p><Link href={`/spots/${spot.slug}`} className="street-button mt-5">View spot</Link></div></article>)}
        </div>
      )}
      <p className="text-sm text-muted">{visibleSpots.length} spots shown{nearby ? " · nearest first" : ""}. Approximate locations are intentionally generalized.</p>
    </div>
  );
}

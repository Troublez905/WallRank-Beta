"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

const DRAFT_KEY = "wallrank-upload-draft-v1";
const DRAFT_FIELDS = ["title", "artistTag", "category", "dateSeen", "description", "styleTags", "wallType", "locationName", "addressText", "city", "provinceState", "country", "visibility"];

export function MobileUploadTools() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState("");
  const [locationStatus, setLocationStatus] = useState("Use your current location or enter coordinates manually.");
  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const values = JSON.parse(saved) as Record<string,string>;
        for (const name of DRAFT_FIELDS) {
          const field = form.elements.namedItem(name);
          if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) if (!field.value) field.value = values[name] ?? "";
        }
      } catch { localStorage.removeItem(DRAFT_KEY); }
    }
    const save = () => {
      const values: Record<string,string> = {};
      for (const name of DRAFT_FIELDS) {
        const field = form.elements.namedItem(name);
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) values[name] = field.value;
      }
      localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    };
    form.addEventListener("input", save);
    return () => form.removeEventListener("input", save);
  }, []);

  function locate() {
    if (!navigator.geolocation) { setLocationStatus("Location services are not supported by this browser."); return; }
    setLocationStatus("Finding your location…");
    navigator.geolocation.getCurrentPosition(({coords}) => {
      const form = rootRef.current?.closest("form");
      const latitude = form?.elements.namedItem("latitude");
      const longitude = form?.elements.namedItem("longitude");
      if (latitude instanceof HTMLInputElement) latitude.value = coords.latitude.toFixed(6);
      if (longitude instanceof HTMLInputElement) longitude.value = coords.longitude.toFixed(6);
      setLocationStatus(`Location captured to about ${Math.round(coords.accuracy)} metres.`);
    }, () => setLocationStatus("Location permission was denied. Enter coordinates manually."), {enableHighAccuracy:true,timeout:12000});
  }

  function previewFile(file?: File) {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : "");
  }

  return <div ref={rootRef} className="contents">
    <div className="md:col-span-2 flex flex-wrap items-center gap-4 border border-dashed border-line p-4"><button type="button" onClick={locate} className="street-button">Use my location</button><span className="text-sm text-muted" role="status">{locationStatus}</span></div>
    <label className="grid gap-2 text-sm"><span className="text-muted">Latitude</span><input required type="number" step="0.000001" name="latitude" defaultValue="43.255203" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" /></label>
    <label className="grid gap-2 text-sm"><span className="text-muted">Longitude</span><input required type="number" step="0.000001" name="longitude" defaultValue="-79.868202" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" /></label>
    <label className="grid gap-2 text-sm"><span className="text-muted">Take a photo or choose an image</span><input type="file" name="imageFile" accept="image/png,image/jpeg,image/webp,image/avif" capture="environment" onChange={(event)=>previewFile(event.target.files?.[0])} className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition file:mr-4 file:rounded-none file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-black focus:border-accent" /></label>
    {preview ? <div className="overflow-hidden border border-line">
      {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview cannot use the image optimizer */}
      <img src={preview} alt="Upload preview" className="max-h-80 w-full object-cover"/>
      <div className="bg-black p-3 text-sm text-muted">Preview only · metadata is stripped by the browser upload path where supported.</div>
    </div> : null}
  </div>;
}

export function UploadSubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="street-button street-button--yellow disabled:cursor-wait disabled:opacity-60">{pending ? "Uploading…" : "Submit spot"}</button>;
}

"use client";

import { useRef } from "react";
import { BACKGROUND_PRESETS } from "@/lib/backgrounds";
import { useLetterStore } from "@/store/useLetterStore";

export default function BackgroundPicker() {
  const { background, setPresetBackground, setCustomBackground } =
    useLetterStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setCustomBackground(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section>
      <h3 className="mb-2 text-xs font-medium text-neutral-500">
        信纸 / Stationery
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {BACKGROUND_PRESETS.map((b) => {
          const active =
            background.type === "preset" && background.key === b.key;
          return (
            <button
              key={b.key}
              type="button"
              title={b.label}
              onClick={() => setPresetBackground(b.key)}
              className={`h-12 rounded-md border-2 transition ${
                active
                  ? "border-amber-600 ring-1 ring-amber-600"
                  : "border-neutral-300 hover:border-neutral-400"
              }`}
              style={{ background: b.paper }}
            />
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
            background.type === "custom"
              ? "border-amber-600 bg-amber-50 text-amber-800"
              : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
          }`}
        >
          {background.type === "custom"
            ? "自定义背景已选 ✓ / Custom image"
            : "上传背景图 / Upload image"}
        </button>
        {background.type === "custom" && (
          <button
            type="button"
            onClick={() => setPresetBackground("classic")}
            className="text-xs text-neutral-500 underline hover:text-neutral-700"
          >
            移除 / remove
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>
    </section>
  );
}

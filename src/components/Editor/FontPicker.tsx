"use client";

import { FONTS } from "@/lib/fonts";
import { useLetterStore } from "@/store/useLetterStore";

export default function FontPicker() {
  const { fontKey, setFontKey } = useLetterStore();

  return (
    <section>
      <h3 className="mb-2 text-xs font-medium text-neutral-500">字体 / Font</h3>
      <div className="grid grid-cols-2 gap-2">
        {FONTS.map((f) => {
          const active = f.key === fontKey;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFontKey(f.key)}
              className={`rounded-lg border px-3 py-2 text-left transition ${
                active
                  ? "border-amber-600 bg-amber-50 ring-1 ring-amber-600"
                  : "border-neutral-300 bg-white hover:border-neutral-400"
              }`}
            >
              <span
                className="block text-lg leading-tight text-neutral-800"
                style={{ fontFamily: f.family }}
              >
                {f.sample}
              </span>
              <span className="mt-1 block text-[11px] text-neutral-500">
                {f.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useLetterStore } from "@/store/useLetterStore";

const PAGE_PRESETS: { label: string; w: number; h: number }[] = [
  { label: "A4", w: 880, h: 1244 },
  { label: "US Letter", w: 880, h: 1138 },
  { label: "Square", w: 960, h: 960 },
];

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-xs font-medium text-neutral-500">
        {label}
        <span className="tabular-nums text-neutral-700">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-amber-700"
      />
    </label>
  );
}

export default function SettingsControls() {
  const s = useLetterStore();

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-medium text-neutral-500">排版 / Layout</h3>

      <Slider
        label="字号 / Font size"
        value={s.fontSize}
        min={14}
        max={48}
        step={1}
        suffix="px"
        onChange={s.setFontSize}
      />
      <Slider
        label="行距 / Line height"
        value={s.lineHeight}
        min={1.4}
        max={2.6}
        step={0.05}
        onChange={s.setLineHeight}
      />
      <Slider
        label="页边距 / Margin"
        value={s.margin}
        min={32}
        max={140}
        step={2}
        suffix="px"
        onChange={s.setMargin}
      />

      <div>
        <span className="mb-1 block text-xs font-medium text-neutral-500">
          页面尺寸 / Page size
        </span>
        <div className="flex gap-2">
          {PAGE_PRESETS.map((p) => {
            const active = s.pageWidth === p.w && s.pageHeight === p.h;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => s.setPageSize(p.w, p.h)}
                className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-amber-600 bg-amber-50 text-amber-800"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={s.paragraphIndent}
          onChange={(e) => s.setParagraphIndent(e.target.checked)}
          className="h-4 w-4 accent-amber-700"
        />
        段落首行缩进 / Indent new paragraphs
      </label>

      <label className="flex items-start gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={s.keepParagraphsTogether}
          onChange={(e) => s.setKeepParagraphsTogether(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-amber-700"
        />
        <span>
          段落不跨页 / Keep paragraphs together
          <span className="mt-0.5 block text-xs text-neutral-400">
            段落放不下时整段移到下一页（否则连续排版填满每页）
          </span>
        </span>
      </label>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={s.showLines}
            onChange={(e) => s.setShowLines(e.target.checked)}
            className="h-4 w-4 accent-amber-700"
          />
          显示横线 / Ruled lines
        </label>
        <button
          type="button"
          onClick={s.reset}
          className="text-xs text-neutral-500 underline hover:text-neutral-700"
        >
          重置 / Reset
        </button>
      </div>
    </section>
  );
}

"use client";

import { useLetterStore } from "@/store/useLetterStore";
import {
  PAGE_NUMBER_FORMATS,
  PAGE_NUMBER_POSITIONS,
} from "@/lib/pageNumber";

export default function PaginationControls() {
  const s = useLetterStore();
  const disabled = !s.showPageNumber;

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-medium text-neutral-500">分页 / Pagination</h3>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={s.showPageNumber}
          onChange={(e) => s.setShowPageNumber(e.target.checked)}
          className="h-4 w-4 accent-amber-700"
        />
        显示页码 / Show page number
      </label>

      <div
        className={`space-y-4 transition ${
          disabled ? "pointer-events-none opacity-40" : ""
        }`}
        aria-disabled={disabled}
      >
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={s.pageNumberUseContentFont}
            onChange={(e) =>
              s.setPageNumberUseContentFont(e.target.checked)
            }
            className="h-4 w-4 accent-amber-700"
          />
          页码使用正文字体 / Use content font
        </label>

        <div>
          <span className="mb-1 block text-xs font-medium text-neutral-500">
            页码位置 / Position
          </span>
          <div className="flex gap-2">
            {PAGE_NUMBER_POSITIONS.map((p) => {
              const active = s.pageNumberPosition === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  title={p.title}
                  onClick={() => s.setPageNumberPosition(p.value)}
                  className={`flex-1 rounded-lg border py-1.5 text-base leading-none transition ${
                    active
                      ? "border-amber-600 bg-amber-50 text-amber-800"
                      : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="mb-1 block text-xs font-medium text-neutral-500">
            页码样式 / Format
          </span>
          <div className="flex flex-col gap-2">
            {PAGE_NUMBER_FORMATS.map((f) => {
              const active = s.pageNumberFormat === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => s.setPageNumberFormat(f.value)}
                  className={`rounded-lg border px-3 py-1.5 text-left text-sm transition ${
                    active
                      ? "border-amber-600 bg-amber-50 text-amber-800"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ExportProgress } from "@/lib/exportImage";

type Props = {
  progress: ExportProgress | null;
  error: string | null;
};

type View = {
  zh: string;
  en: string;
  /** 0–100 for a determinate bar, or null for an indeterminate sweep. */
  percent: number | null;
  tone: "busy" | "done" | "error";
};

function toView(progress: ExportProgress | null, error: string | null): View {
  if (error) {
    return { zh: "导出失败", en: error, percent: 100, tone: "error" };
  }
  switch (progress?.phase) {
    case "preparing":
      return { zh: "准备字体…", en: "Preparing fonts…", percent: null, tone: "busy" };
    case "rendering":
      return {
        zh: `正在渲染第 ${progress.current} 页 / 共 ${progress.total} 页`,
        en: `Rendering page ${progress.current} of ${progress.total}`,
        percent: Math.round((progress.current / progress.total) * 100),
        tone: "busy",
      };
    case "finalizing":
      return { zh: "正在合成图片…", en: "Finalizing…", percent: null, tone: "busy" };
    case "done":
      return {
        zh: "导出完成！",
        en: `Exported ${progress.total} image${progress.total > 1 ? "s" : ""}`,
        percent: 100,
        tone: "done",
      };
    default:
      return { zh: "处理中…", en: "Working…", percent: null, tone: "busy" };
  }
}

export default function ExportOverlay({ progress, error }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const visible = progress !== null || error !== null;
  if (!mounted || !visible) return null;

  const view = toView(progress, error);

  return createPortal(
    <div
      className="overlay-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/55 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="overlay-pop-in w-[min(90vw,420px)] rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mb-5 flex justify-center">
          {view.tone === "busy" && (
            <span className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />
          )}
          {view.tone === "done" && (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
              ✓
            </span>
          )}
          {view.tone === "error" && (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
              ✕
            </span>
          )}
        </div>

        <p className="text-base font-semibold text-neutral-800">{view.zh}</p>
        <p className="mt-1 text-sm text-neutral-500">{view.en}</p>

        <div className="relative mt-6 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
          {view.percent === null ? (
            <span className="bar-indeterminate bg-amber-600" />
          ) : (
            <span
              className={`block h-full rounded-full transition-[width] duration-300 ease-out ${
                view.tone === "error" ? "bg-red-500" : "bg-amber-600"
              }`}
              style={{ width: `${view.percent}%` }}
            />
          )}
        </div>

        {view.tone === "busy" && view.percent !== null && (
          <p className="mt-2 text-right text-xs tabular-nums text-neutral-400">
            {view.percent}%
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}

"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLetterStore } from "@/store/useLetterStore";
import { resolveLayout } from "@/lib/layout";
import { paginate } from "@/lib/paginate";
import LetterPage from "./LetterPage";

/** Stable id so the export routine can find the real-size page nodes. */
export const PAGES_ROOT_ID = "letter-pages-root";

export default function LetterPreview() {
  const s = useLetterStore();
  const layout = useMemo(
    () => resolveLayout(s),
    // Re-resolve whenever any layout-affecting field changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      s.title,
      s.fontKey,
      s.fontSize,
      s.lineHeight,
      s.background,
      s.pageWidth,
      s.pageHeight,
      s.margin,
      s.showLines,
    ],
  );

  const measureRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<string[][]>([[""]]);
  const [scale, setScale] = useState(1);
  const [fontTick, setFontTick] = useState(0);

  // Re-run pagination whenever fonts finish loading (metrics change).
  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts) return;
    const onDone = () => setFontTick((t) => t + 1);
    document.fonts.addEventListener("loadingdone", onDone);
    return () => document.fonts.removeEventListener("loadingdone", onDone);
  }, []);

  // Recompute pages (debounced) when text / fonts / geometry change.
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (typeof document !== "undefined" && document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          /* ignore */
        }
      }
      if (cancelled) return;
      const host = measureRef.current;
      if (!host) return;
      setPages(paginate(host, s.body, layout.paginateStyle));
    };
    const t = setTimeout(run, 120);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [s.body, layout, fontTick]);

  // Fit the page width to the preview pane.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const avail = el.clientWidth - 48; // padding allowance
      setScale(Math.min(1, Math.max(0.15, avail / layout.pageWidth)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout.pageWidth]);

  return (
    <div
      ref={containerRef}
      className="thin-scroll h-full overflow-auto bg-neutral-200/70 px-6 py-8"
    >
      {/* Hidden measurer used by the paginator. */}
      <div ref={measureRef} className="measure-host" aria-hidden />

      <div
        id={PAGES_ROOT_ID}
        className="mx-auto flex flex-col items-center gap-8"
      >
        {pages.map((para, i) => (
          <div
            key={i}
            className="shadow-xl shadow-black/20"
            style={{
              width: layout.pageWidth * scale,
              height: layout.pageHeight * scale,
            }}
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: layout.pageWidth,
                height: layout.pageHeight,
              }}
            >
              <LetterPage
                layout={layout}
                paragraphs={para}
                index={i}
                total={pages.length}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-neutral-500">
        {pages.length} 页 / page{pages.length > 1 ? "s" : ""} · {layout.pageWidth}
        ×{layout.pageHeight}px
      </p>
    </div>
  );
}

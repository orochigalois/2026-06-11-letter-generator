"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_FONT_KEY } from "@/lib/fonts";
import { DEFAULT_BG_KEY } from "@/lib/backgrounds";
import { SAMPLE_BODY, SAMPLE_TITLE } from "@/lib/sample";

export type Background =
  | { type: "preset"; key: string }
  | { type: "custom"; dataUrl: string };

export type LetterState = {
  title: string;
  body: string;
  fontKey: string;
  fontSize: number;
  lineHeight: number;
  background: Background;
  /** Page geometry, in px (the export resolution before pixelRatio). */
  pageWidth: number;
  pageHeight: number;
  margin: number;
  /** Whether to draw the horizontal ruled lines. */
  showLines: boolean;

  setTitle: (v: string) => void;
  setBody: (v: string) => void;
  setFontKey: (v: string) => void;
  setFontSize: (v: number) => void;
  setLineHeight: (v: number) => void;
  setPresetBackground: (key: string) => void;
  setCustomBackground: (dataUrl: string) => void;
  setPageSize: (w: number, h: number) => void;
  setMargin: (v: number) => void;
  setShowLines: (v: boolean) => void;
  reset: () => void;
};

const DEFAULTS = {
  title: SAMPLE_TITLE,
  body: SAMPLE_BODY,
  fontKey: DEFAULT_FONT_KEY,
  fontSize: 26,
  lineHeight: 1.9,
  background: { type: "preset", key: DEFAULT_BG_KEY } as Background,
  pageWidth: 880,
  pageHeight: 1244, // ~A4 ratio (1 : 1.414)
  margin: 72,
  showLines: true,
};

export const useLetterStore = create<LetterState>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      setTitle: (v) => set({ title: v }),
      setBody: (v) => set({ body: v }),
      setFontKey: (v) => set({ fontKey: v }),
      setFontSize: (v) => set({ fontSize: clamp(v, 12, 60) }),
      setLineHeight: (v) => set({ lineHeight: clamp(v, 1.2, 3) }),
      setPresetBackground: (key) =>
        set({ background: { type: "preset", key } }),
      setCustomBackground: (dataUrl) =>
        set({ background: { type: "custom", dataUrl } }),
      setPageSize: (w, h) => set({ pageWidth: w, pageHeight: h }),
      setMargin: (v) => set({ margin: clamp(v, 24, 160) }),
      setShowLines: (v) => set({ showLines: v }),
      reset: () => set({ ...DEFAULTS }),
    }),
    {
      name: "letter-generator-v1",
      // Don't persist large custom-image data URLs (can blow localStorage quota).
      partialize: (s) => ({
        title: s.title,
        body: s.body,
        fontKey: s.fontKey,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        background:
          s.background.type === "custom"
            ? ({ type: "preset", key: DEFAULT_BG_KEY } as Background)
            : s.background,
        pageWidth: s.pageWidth,
        pageHeight: s.pageHeight,
        margin: s.margin,
        showLines: s.showLines,
      }),
    },
  ),
);

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

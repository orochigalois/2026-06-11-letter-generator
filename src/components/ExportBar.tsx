"use client";

import { useState } from "react";
import {
  exportLetter,
  exportLongImage,
  type ExportMode,
  type ExportProgress,
} from "@/lib/exportImage";
import ExportOverlay from "./ExportOverlay";

export default function ExportBar() {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runExport = async (
    task: (onProgress: (p: ExportProgress) => void) => Promise<number>,
  ) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setProgress({ phase: "preparing" });
    try {
      await task(setProgress);
      // Keep the "done" state visible briefly, then dismiss the overlay.
      setTimeout(() => setProgress(null), 1400);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
      setProgress(null);
      setTimeout(() => setError(null), 4000);
    } finally {
      setBusy(false);
    }
  };

  const run = (mode: ExportMode) =>
    runExport((onProgress) => exportLetter({ mode, onProgress }));

  const runLong = () =>
    runExport((onProgress) => exportLongImage({ onProgress }));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={busy}
        onClick={() => run("separate")}
        className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Export PNG(s)
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={runLong}
        title="Combine all pages into one tall PNG"
        className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Export Long PNG
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => run("zip")}
        className="rounded-lg border border-amber-700 px-4 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Download .zip
      </button>

      <ExportOverlay progress={progress} error={error} />
    </div>
  );
}

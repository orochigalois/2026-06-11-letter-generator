"use client";

import { useState } from "react";
import { exportLetter, type ExportMode } from "@/lib/exportImage";

export default function ExportBar() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (mode: ExportMode) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setStatus("Preparing…");
    try {
      const total = await exportLetter({
        mode,
        onProgress: (done, t) => setStatus(`Rendering ${done}/${t}…`),
      });
      setStatus(`Exported ${total} image${total > 1 ? "s" : ""} ✓`);
      setTimeout(() => setStatus(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  };

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
        onClick={() => run("zip")}
        className="rounded-lg border border-amber-700 px-4 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Download .zip
      </button>
      {status && <span className="text-sm text-neutral-600">{status}</span>}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}

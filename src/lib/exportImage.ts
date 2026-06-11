import { toBlob, getFontEmbedCSS } from "html-to-image";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { PAGES_ROOT_ID } from "@/components/Preview/LetterPreview";

export type ExportMode = "separate" | "zip";

type ExportOptions = {
  mode: ExportMode;
  pixelRatio?: number;
  fileBase?: string;
  onProgress?: (done: number, total: number) => void;
};

function pad(n: number, width: number) {
  return String(n).padStart(width, "0");
}

/**
 * Capture every rendered letter page as a PNG and trigger a download.
 * Fonts are embedded so exports are deterministic across machines.
 */
export async function exportLetter(opts: ExportOptions): Promise<number> {
  const { mode, pixelRatio = 2, fileBase = "letter", onProgress } = opts;

  const root = document.getElementById(PAGES_ROOT_ID);
  const nodes = root
    ? (Array.from(root.querySelectorAll<HTMLElement>(".letter-page")) as HTMLElement[])
    : [];
  if (nodes.length === 0) {
    throw new Error("Nothing to export — no pages were found.");
  }

  // Make sure web fonts are loaded before capturing.
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }

  // Compute the embedded @font-face CSS once and reuse for every page.
  let fontEmbedCSS: string | undefined;
  try {
    fontEmbedCSS = await getFontEmbedCSS(nodes[0]);
  } catch {
    fontEmbedCSS = undefined;
  }

  const total = nodes.length;
  const width = String(total).length;
  const blobs: Blob[] = [];

  for (let i = 0; i < total; i++) {
    onProgress?.(i, total);
    const blob = await toBlob(nodes[i], {
      pixelRatio,
      cacheBust: true,
      backgroundColor: "#ffffff",
      fontEmbedCSS,
    });
    if (!blob) throw new Error(`Failed to render page ${i + 1}.`);
    blobs.push(blob);
  }
  onProgress?.(total, total);

  const names = blobs.map((_, i) =>
    total === 1 ? `${fileBase}.png` : `${fileBase}-${pad(i + 1, width)}.png`,
  );

  if (mode === "zip" && total > 1) {
    const zip = new JSZip();
    blobs.forEach((b, i) => zip.file(names[i], b));
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${fileBase}.zip`);
  } else {
    blobs.forEach((b, i) => saveAs(b, names[i]));
  }

  return total;
}

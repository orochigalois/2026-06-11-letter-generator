import { toBlob, toCanvas, getFontEmbedCSS } from "html-to-image";
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

/** Collect the real-size page nodes from the preview, throwing if none exist. */
function getPageNodes(): HTMLElement[] {
  const root = document.getElementById(PAGES_ROOT_ID);
  const nodes = root
    ? Array.from(root.querySelectorAll<HTMLElement>(".letter-page"))
    : [];
  if (nodes.length === 0) {
    throw new Error("Nothing to export — no pages were found.");
  }
  return nodes;
}

/** Wait for web fonts, then compute the embeddable @font-face CSS once. */
async function prepareFonts(node: HTMLElement): Promise<string | undefined> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }
  try {
    return await getFontEmbedCSS(node);
  } catch {
    return undefined;
  }
}

/**
 * Capture every rendered letter page as a PNG and trigger a download.
 * Fonts are embedded so exports are deterministic across machines.
 */
export async function exportLetter(opts: ExportOptions): Promise<number> {
  const { mode, pixelRatio = 2, fileBase = "letter", onProgress } = opts;

  const nodes = getPageNodes();
  const fontEmbedCSS = await prepareFonts(nodes[0]);

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

type LongExportOptions = {
  pixelRatio?: number;
  fileBase?: string;
  /** Vertical gap (in page px, before pixelRatio) between stacked pages. */
  gap?: number;
  onProgress?: (done: number, total: number) => void;
};

/**
 * Capture every page and stitch them vertically into a single tall PNG.
 * Useful for sharing a whole letter as one continuous image.
 */
export async function exportLongImage(
  opts: LongExportOptions = {},
): Promise<number> {
  const { pixelRatio = 2, fileBase = "letter", gap = 0, onProgress } = opts;

  const nodes = getPageNodes();
  const fontEmbedCSS = await prepareFonts(nodes[0]);
  const total = nodes.length;

  // Render each page to its own canvas first.
  const canvases: HTMLCanvasElement[] = [];
  for (let i = 0; i < total; i++) {
    onProgress?.(i, total);
    const canvas = await toCanvas(nodes[i], {
      pixelRatio,
      cacheBust: true,
      backgroundColor: "#ffffff",
      fontEmbedCSS,
    });
    canvases.push(canvas);
  }

  // Compose them onto one tall canvas.
  const gapPx = Math.round(gap * pixelRatio);
  const width = Math.max(...canvases.map((c) => c.width));
  const height =
    canvases.reduce((sum, c) => sum + c.height, 0) + gapPx * (total - 1);

  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Could not create a drawing context.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  let y = 0;
  for (const c of canvases) {
    ctx.drawImage(c, Math.round((width - c.width) / 2), y);
    y += c.height + gapPx;
  }
  onProgress?.(total, total);

  const blob: Blob | null = await new Promise((resolve) =>
    out.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("Failed to render the combined image.");
  saveAs(blob, `${fileBase}-long.png`);

  return total;
}

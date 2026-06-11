export type BackgroundPreset = {
  key: string;
  label: string;
  /** Paper fill — any valid CSS background (color or gradient). */
  paper: string;
  /** Optional background image (served from /public). Overrides `paper`. */
  image?: string | null;
  /** Colour of the horizontal ruled lines. Empty string = no lines. */
  line: string;
  /** Decorative double-frame colour. null = no frame. */
  frame: string | null;
  /** Default ink (text) colour for this paper. */
  ink: string;
  /** Title accent colour. */
  accent: string;
};

/**
 * The default "classic" preset reproduces the warm, lined stationery from the
 * reference screenshot: aged-yellow paper, faint horizontal rules, and a
 * double orange frame.
 */
export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    key: "classic",
    label: "经典信纸 / Classic",
    paper: "linear-gradient(180deg, #fbf3d8 0%, #f7ecc9 100%)",
    line: "rgba(193, 138, 74, 0.30)",
    frame: "#c8702a",
    ink: "#3a3026",
    accent: "#7a4a1e",
  },
  {
    key: "cream",
    label: "米白 / Cream",
    paper: "linear-gradient(180deg, #fffdf7 0%, #fbf7ec 100%)",
    line: "rgba(120, 110, 90, 0.18)",
    frame: "#caa46a",
    ink: "#33302a",
    accent: "#6b5a3a",
  },
  {
    key: "white",
    label: "纯白 / Plain white",
    paper: "#ffffff",
    line: "rgba(80, 90, 110, 0.16)",
    frame: null,
    ink: "#1f2530",
    accent: "#2b3550",
  },
  {
    key: "grid-blue",
    label: "蓝调 / Cool blue",
    paper: "linear-gradient(180deg, #f5f9ff 0%, #eaf1fb 100%)",
    line: "rgba(60, 110, 190, 0.22)",
    frame: "#3f72b8",
    ink: "#22304a",
    accent: "#1f4f8f",
  },
  {
    key: "kraft",
    label: "牛皮纸 / Kraft",
    paper: "linear-gradient(180deg, #e7d2ad 0%, #ddc398 100%)",
    line: "rgba(90, 64, 32, 0.28)",
    frame: "#6b4a23",
    ink: "#3a2a16",
    accent: "#5a3b18",
  },
  {
    key: "vintage1",
    label: "复古做旧 / Vintage1",
    paper: "#cdb78f",
    image: "/papers/paper1.png",
    line: "rgba(70, 50, 30, 0.20)",
    frame: null,
    ink: "#2c2114",
    accent: "#4a3418",
  },
  {
    key: "vintage2",
    label: "旧白纸1 / Vintage2",
    paper: "#cdb78f",
    image: "/papers/paper2.png",
    line: "rgba(70, 50, 30, 0.20)",
    frame: null,
    ink: "#2c2114",
    accent: "#4a3418",
  },
  {
    key: "vintage3",
    label: "淡彩纸1 / Vintage3",
    paper: "#cdb78f",
    image: "/papers/paper3.png",
    line: "rgba(70, 50, 30, 0.20)",
    frame: null,
    ink: "#2c2114",
    accent: "#4a3418",
  },
  {
    key: "vintage4",
    label: "旧白纸2 / Vintage4",
    paper: "#cdb78f",
    image: "/papers/paper4.png",
    line: "rgba(70, 50, 30, 0.20)",
    frame: null,
    ink: "#2c2114",
    accent: "#4a3418",
  },
  {
    key: "vintage5",
    label: "旧白纸3 / Vintage5",
    paper: "#cdb78f",
    image: "/papers/paper5.png",
    line: "rgba(70, 50, 30, 0.20)",
    frame: null,
    ink: "#2c2114",
    accent: "#4a3418",
  },
  {
    key: "vintage6",
    label: "旧白纸4 / Vintage6",
    paper: "#cdb78f",
    image: "/papers/paper6.png",
    line: "rgba(70, 50, 30, 0.20)",
    frame: null,
    ink: "#2c2114",
    accent: "#4a3418",
  },
  {
    key: "vintage7",
    label: "旧白纸5 / Vintage7",
    paper: "#cdb78f",
    image: "/papers/paper7.png",
    line: "rgba(70, 50, 30, 0.20)",
    frame: null,
    ink: "#2c2114",
    accent: "#4a3418",
  },
  {
    key: "vintage8",
    label: "旧牛皮纸1 / Vintage8",
    paper: "#cdb78f",
    image: "/papers/paper8.png",
    line: "rgba(70, 50, 30, 0.20)",
    frame: null,
    ink: "#2c2114",
    accent: "#4a3418",
  },
  {
    key: "vintage9",
    label: "旧牛皮纸2 / Vintage9",
    paper: "#cdb78f",
    image: "/papers/paper9.png",
    line: "rgba(70, 50, 30, 0.20)",
    frame: null,
    ink: "#2c2114",
    accent: "#4a3418",
  },
  {
    key: "vintage10",
    label: "旧牛皮纸3 / Vintage10",
    paper: "#cdb78f",
    image: "/papers/paper10.png",
    line: "rgba(70, 50, 30, 0.20)",
    frame: null,
    ink: "#2c2114",
    accent: "#4a3418",
  },
  {
    key: "vintage11",
    label: "淡彩纸2 / Vintage11",
    paper: "#cdb78f",
    image: "/papers/paper11.png",
    line: "rgba(70, 50, 30, 0.20)",
    frame: null,
    ink: "#2c2114",
    accent: "#4a3418",
  },
  {
    key: "vintage12",
    label: "旧羊皮1 / Vintage12",
    paper: "#cdb78f",
    image: "/papers/paper12.png",
    line: "rgba(70, 50, 30, 0.20)",
    frame: null,
    ink: "#2c2114",
    accent: "#4a3418",
  },
  {
    key: "vintage13",
    label: "旧羊皮2 / Vintage13",
    paper: "#cdb78f",
    image: "/papers/paper13.png",
    line: "rgba(70, 50, 30, 0.20)",
    frame: null,
    ink: "#2c2114",
    accent: "#4a3418",
  },
];

export const DEFAULT_BG_KEY = "classic";

export function getPreset(key: string): BackgroundPreset {
  return BACKGROUND_PRESETS.find((b) => b.key === key) ?? BACKGROUND_PRESETS[0];
}

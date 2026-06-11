export type FontDef = {
  key: string;
  /** Human label shown in the picker. */
  label: string;
  /** CSS font-family stack (loaded via Google Fonts <link> in layout). */
  family: string;
  /** Short sample rendered in the picker. */
  sample: string;
};

/**
 * All fonts here are loaded through the Google Fonts stylesheet in
 * `app/layout.tsx`. They are all CJK-capable (plus Latin) so the letter
 * renders Chinese and English correctly.
 */
export const FONTS: FontDef[] = [
  {
    key: "serif",
    label: "宋体 / Serif (Noto Serif SC)",
    family: "'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "sans",
    label: "黑体 / Sans (Noto Sans SC)",
    family: "'Noto Sans SC', sans-serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "xiaowei",
    label: "小薇 / Elegant (ZCOOL XiaoWei)",
    family: "'ZCOOL XiaoWei', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "mashan",
    label: "毛笔楷书 / Brush (Ma Shan Zheng)",
    family: "'Ma Shan Zheng', cursive",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "longcang",
    label: "手写 / Handwriting (Long Cang)",
    family: "'Long Cang', cursive",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "zhimang",
    label: "行书 / Running (Zhi Mang Xing)",
    family: "'Zhi Mang Xing', cursive",
    sample: "亲爱的家人 Aa",
  },
];

export const DEFAULT_FONT_KEY = "serif";

export function getFont(key: string): FontDef {
  return FONTS.find((f) => f.key === key) ?? FONTS[0];
}

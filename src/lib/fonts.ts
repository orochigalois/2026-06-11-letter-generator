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
    key: "fzkaiti",
    label: "方正楷体 / Kaiti (local)",
    family: "'FangZheng KaiTi', 'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "Alex",
    label: "Alex (local)",
    family: "'Alex', 'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "DeBiao",
    label: "DeBiao (local)",
    family: "'DeBiao', 'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "Tangerine",
    label: "Tangerine (local)",
    family: "'Tangerine', 'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "XuJingLei",
    label: "XuJingLei (local)",
    family: "'XuJingLei', 'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "xuanzongti",
    label: "玄宗体 / xuanzongti (local)",
    family: "'xuanzongti', 'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "hanchan",
    label: "寒蝉正楷体 / hanchan (local)",
    family: "'hanchan', 'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "qiushui",
    label: "秋水書体 / qiushui (local)",
    family: "'qiushui', 'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "xinyi",
    label: "新一細明體 / xinyi (local)",
    family: "'xinyi', 'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "xiawu",
    label: "霞鹜臻楷 / xiawu (local)",
    family: "'xiawu', 'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "huxiaobo",
    label: "胡晓波体 / huxiaobo (local)",
    family: "'huxiaobo', 'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "yuanjie",
    label: "源界明朝体 / yuanjie (local)",
    family: "'yuanjie', 'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
  {
    key: "duheng",
    label: "权衡度量体 / duheng (local)",
    family: "'duheng', 'Noto Serif SC', serif",
    sample: "亲爱的家人 Aa",
  },
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

export const DEFAULT_FONT_KEY = "fzkaiti";

export function getFont(key: string): FontDef {
  return FONTS.find((f) => f.key === key) ?? FONTS[0];
}

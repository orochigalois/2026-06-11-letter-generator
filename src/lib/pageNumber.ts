export type PageNumberPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export type PageNumberFormat = "slash" | "chinese" | "english";

/** Default font stack used when the page number does NOT follow the content font. */
export const PAGE_NUMBER_DEFAULT_FONT = "'Noto Sans SC', sans-serif";

export const PAGE_NUMBER_POSITIONS: {
  value: PageNumberPosition;
  label: string;
  title: string;
}[] = [
  { value: "top-left", label: "↖", title: "Top left" },
  { value: "top-right", label: "↗", title: "Top right" },
  { value: "bottom-left", label: "↙", title: "Bottom left" },
  { value: "bottom-center", label: "↓", title: "Bottom center" },
  { value: "bottom-right", label: "↘", title: "Bottom right" },
];

export const PAGE_NUMBER_FORMATS: {
  value: PageNumberFormat;
  label: string;
}[] = [
  { value: "slash", label: "1 / 4" },
  { value: "chinese", label: "第一页 / 全四页" },
  { value: "english", label: "Page 1 of 4" },
];

const CN_DIGITS = [
  "零",
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
];

/** Convert a positive integer to simplified-Chinese numerals (handles 1–99 well). */
export function toChineseNumber(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "零";
  if (n < 10) return CN_DIGITS[n];
  if (n === 10) return "十";
  if (n < 20) return "十" + CN_DIGITS[n - 10];
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return CN_DIGITS[tens] + "十" + (ones ? CN_DIGITS[ones] : "");
  }
  // Page counts this large are unexpected — fall back to digits.
  return String(n);
}

/** Render the page-number label for a given page (0-based index) and total. */
export function formatPageNumber(
  index: number,
  total: number,
  format: PageNumberFormat,
): string {
  const cur = index + 1;
  switch (format) {
    case "chinese":
      return `第${toChineseNumber(cur)}页/全${toChineseNumber(total)}页`;
    case "english":
      return `Page ${cur} of ${total}`;
    case "slash":
    default:
      return `${cur}/${total}`;
  }
}

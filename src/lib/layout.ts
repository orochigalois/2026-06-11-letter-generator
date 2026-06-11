import { getFont } from "@/lib/fonts";
import { getPreset, type BackgroundPreset } from "@/lib/backgrounds";
import type { LetterState } from "@/store/useLetterStore";
import type { PaginateStyle } from "@/lib/paginate";

const TEXT_INDENT = "2em";

export type ResolvedLayout = {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  contentHeight: number;
  /** px height of one ruled-line row = fontSize * lineHeight. */
  lineGapPx: number;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  textIndent: string;
  title: string;
  /** Resolved paper/ink colours and optional custom image. */
  preset: BackgroundPreset;
  customImage: string | null;
  showLines: boolean;
  paginateStyle: PaginateStyle;
};

/** Derive all geometry / style values from the store state. */
export function resolveLayout(
  s: Pick<
    LetterState,
    | "title"
    | "fontKey"
    | "fontSize"
    | "lineHeight"
    | "background"
    | "pageWidth"
    | "pageHeight"
    | "margin"
    | "showLines"
  >,
): ResolvedLayout {
  const contentWidth = s.pageWidth - s.margin * 2;
  const contentHeight = s.pageHeight - s.margin * 2;
  const fontFamily = getFont(s.fontKey).family;
  const lineGapPx = s.fontSize * s.lineHeight;

  const preset =
    s.background.type === "preset"
      ? getPreset(s.background.key)
      : getPreset("white");
  const customImage =
    s.background.type === "custom" ? s.background.dataUrl : null;

  // Title shares the body grid: same size & line-height so body stays aligned
  // to the ruled lines. We reserve exactly one line row + no extra gap.
  const paginateStyle: PaginateStyle = {
    contentWidth,
    contentHeight,
    fontFamily,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    paragraphGap: 0,
    textIndent: TEXT_INDENT,
    title: s.title,
    titleFontSize: s.fontSize,
    titleGap: 0,
  };

  return {
    pageWidth: s.pageWidth,
    pageHeight: s.pageHeight,
    margin: s.margin,
    contentWidth,
    contentHeight,
    lineGapPx,
    fontFamily,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    textIndent: TEXT_INDENT,
    title: s.title,
    preset,
    customImage,
    showLines: s.showLines,
    paginateStyle,
  };
}

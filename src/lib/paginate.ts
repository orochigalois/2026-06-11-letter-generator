/**
 * Height-measurement based pagination.
 *
 * The body is laid out as a continuous flow so the rendered pages match the
 * content line-for-line: each page is filled completely, and a paragraph that
 * doesn't fit in the remaining space is split across the page boundary (rather
 * than being pushed whole to the next page, which would leave blank lines).
 *
 * Splitting a paragraph yields a continuation chunk; continuations are flagged
 * so the renderer can omit the first-line indent on them. Empty lines in the
 * body are preserved as empty lines.
 *
 * Measurement happens in a real (hidden) DOM node so wrapping matches the
 * preview exactly. Pass a host element with `.measure-host` styling.
 */

export type PaginateStyle = {
  /** Content column width in px (page width minus left/right margin). */
  contentWidth: number;
  /** Usable content height in px (page height minus top/bottom margin). */
  contentHeight: number;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  /** Vertical gap between paragraphs, px. */
  paragraphGap: number;
  /** First-line indent for a paragraph start (CSS length, e.g. "2em"). */
  textIndent: string;
  /**
   * When true, a paragraph that doesn't fit in the remaining space is pushed
   * whole to the next page (it's only split if it can't fit a full page). When
   * false, pages are filled completely and paragraphs flow across boundaries.
   */
  keepParagraphsTogether: boolean;
  /** Title text (rendered only on page 1). Empty = no title. */
  title: string;
  /** Title font size, px. */
  titleFontSize: number;
  /** Gap below the title before the body starts, px. */
  titleGap: number;
};

/** One renderable chunk of a page. */
export type LineSegment = {
  text: string;
  /** True for the first chunk of a paragraph (gets the indent); false for a
   *  continuation produced by splitting across a page boundary. */
  isParagraphStart: boolean;
};

export type PaginateResult = LineSegment[][];

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function paginate(
  host: HTMLElement,
  body: string,
  style: PaginateStyle,
): PaginateResult {
  // Configure the host to match the preview's text column.
  host.style.width = `${style.contentWidth}px`;
  host.style.fontFamily = style.fontFamily;
  host.style.fontSize = `${style.fontSize}px`;
  host.style.lineHeight = String(style.lineHeight);

  const segHtml = (s: LineSegment): string => {
    const indent = s.isParagraphStart ? style.textIndent : "0";
    const inner = s.text === "" ? "<br/>" : escapeHtml(s.text);
    return `<p style="margin:0 0 ${style.paragraphGap}px 0;text-indent:${indent};">${inner}</p>`;
  };

  const measure = (segs: LineSegment[]): number => {
    host.innerHTML = segs.map(segHtml).join("");
    return host.scrollHeight;
  };

  // Measure the title block height (page 1 only).
  let titleReserve = 0;
  if (style.title.trim() !== "") {
    host.innerHTML = `<p style="margin:0;font-size:${style.titleFontSize}px;font-weight:600;line-height:${style.lineHeight};">${escapeHtml(
      style.title,
    )}</p>`;
    titleReserve = host.scrollHeight + style.titleGap;
  }

  const firstAvail = Math.max(0, style.contentHeight - titleReserve);
  const restAvail = style.contentHeight;

  const paragraphs = body.split("\n");
  const pages: LineSegment[][] = [];
  let current: LineSegment[] = [];

  const pushPage = () => {
    if (current.length > 0) {
      pages.push(current);
      current = [];
    }
  };

  for (const para of paragraphs) {
    let remaining = para;
    let isStart = true;

    // Each iteration places as much of `remaining` as fits on the current page.
    for (let guard = 0; guard < 100000; guard++) {
      const avail = pages.length === 0 ? firstAvail : restAvail;
      const seg: LineSegment = { text: remaining, isParagraphStart: isStart };

      if (measure([...current, seg]) <= avail) {
        current.push(seg);
        break;
      }

      // Doesn't fully fit. In "keep together" mode, move the whole paragraph to
      // a fresh page (unless the page is already empty — then it can't fit a
      // full page either, so fall through and split it).
      if (style.keepParagraphsTogether && current.length > 0) {
        pushPage();
        continue;
      }

      // Otherwise fill the remaining space with as much as we can.
      const cut = fitPrefix(measure, current, remaining, isStart, avail);

      if (cut <= 0) {
        // Nothing more fits on this page.
        if (current.length > 0) {
          pushPage();
          continue; // retry on a fresh page
        }
        // Empty page yet nothing fits (page too small) — force one char to
        // avoid an infinite loop.
        current.push({ text: remaining.slice(0, 1), isParagraphStart: isStart });
        pushPage();
        remaining = remaining.slice(1);
        isStart = false;
        if (remaining === "") break;
        continue;
      }

      current.push({ text: remaining.slice(0, cut), isParagraphStart: isStart });
      pushPage();
      remaining = remaining.slice(cut);
      isStart = false; // the rest is a continuation
      if (remaining === "") break;
    }
  }

  pushPage();
  // Always return at least one (possibly empty) page.
  return pages.length > 0 ? pages : [[{ text: "", isParagraphStart: true }]];
}

/**
 * Binary-search the largest prefix length of `text` that still fits within
 * `avail` when appended after the already-placed `current` segments. Backs off
 * to the previous whitespace boundary so Latin words aren't sliced mid-word
 * (CJK has no spaces, so it cuts per character).
 */
function fitPrefix(
  measure: (segs: LineSegment[]) => number,
  current: LineSegment[],
  text: string,
  isStart: boolean,
  avail: number,
): number {
  let lo = 1;
  let hi = text.length;
  let best = 0;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const seg: LineSegment = {
      text: text.slice(0, mid),
      isParagraphStart: isStart,
    };
    if (measure([...current, seg]) <= avail) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  if (best <= 0) return 0;
  if (best >= text.length) return text.length;

  // If we cut in the middle of a Latin word, back up to the last space.
  const nextChar = text[best];
  const prevChar = text[best - 1];
  const isWordChar = (c: string) => /[A-Za-z0-9]/.test(c);
  if (isWordChar(nextChar) && isWordChar(prevChar)) {
    const lastSpace = text.lastIndexOf(" ", best);
    if (lastSpace > 0) return lastSpace + 1;
  }
  return best;
}

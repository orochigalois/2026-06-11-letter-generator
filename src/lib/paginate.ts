/**
 * Height-measurement based pagination.
 *
 * Given the body text and the rendered text styles, split it into pages that
 * each fit within a fixed content box. The first page reserves room for the
 * title. A single paragraph that is too tall to fit on one page is split at a
 * character (or word, for Latin runs) boundary.
 *
 * The measurement is done in a real (hidden) DOM node so wrapping matches the
 * actual preview exactly. Pass a host element with `.measure-host` styling and
 * the same content width as the preview's text column.
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
  /** First-line indent for each paragraph (CSS length, e.g. "2em"). */
  textIndent: string;
  /** Title text (rendered only on page 1). Empty = no title. */
  title: string;
  /** Title font size, px. */
  titleFontSize: number;
  /** Gap below the title before the body starts, px. */
  titleGap: number;
};

export type PaginateResult = string[][];

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

  const paraStyle = `margin:0 0 ${style.paragraphGap}px 0;text-indent:${style.textIndent};`;

  const measure = (paras: string[]): number => {
    host.innerHTML = paras
      .map(
        (p) =>
          `<p style="${paraStyle}">${p === "" ? "<br/>" : escapeHtml(p)}</p>`,
      )
      .join("");
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
  const pages: string[][] = [];
  let current: string[] = [];

  const pushPage = () => {
    if (current.length > 0) {
      pages.push(current);
      current = [];
    }
  };

  for (const para of paragraphs) {
    let remaining = para;

    // Each iteration places as much of `remaining` as fits on the current page.
    // Guard against pathological infinite loops.
    for (let guard = 0; guard < 100000; guard++) {
      const avail = pages.length === 0 ? firstAvail : restAvail;

      if (measure([...current, remaining]) <= avail) {
        current.push(remaining);
        break;
      }

      if (current.length === 0) {
        // A single paragraph doesn't fit on an empty page — split it.
        const cut = fitPrefix(measure, remaining, avail);
        if (cut <= 0) {
          // Even one piece can't fit (tiny page) — force-place to avoid a hang.
          current.push(remaining);
          pushPage();
          remaining = "";
          break;
        }
        const head = remaining.slice(0, cut);
        current.push(head);
        pushPage();
        remaining = remaining.slice(cut);
        if (remaining === "") break;
        // loop continues, placing the rest on a fresh page
      } else {
        // Current page has content; flush it and retry this paragraph fresh.
        pushPage();
      }
    }
  }

  pushPage();
  // Always return at least one (possibly empty) page.
  return pages.length > 0 ? pages : [[""]];
}

/**
 * Binary-search the largest prefix length of `text` whose single-paragraph
 * render fits within `avail`. Backs off to the previous whitespace boundary so
 * Latin words aren't sliced mid-word (CJK has no spaces, so it cuts per char).
 */
function fitPrefix(
  measure: (paras: string[]) => number,
  text: string,
  avail: number,
): number {
  let lo = 1;
  let hi = text.length;
  let best = 0;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (measure([text.slice(0, mid)]) <= avail) {
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

import type { CSSProperties } from "react";
import type { ResolvedLayout } from "@/lib/layout";
import { formatPageNumber } from "@/lib/pageNumber";

type Props = {
  layout: ResolvedLayout;
  /** Paragraphs assigned to this page by the paginator. */
  paragraphs: string[];
  /** Page index (0-based). Title is drawn only on page 0. */
  index: number;
  /** Total page count (for the footer page number). */
  total: number;
};

/**
 * One rendered letter page. This is the exact DOM node captured during export,
 * so it must contain no preview-only chrome (shadows live on the wrapper).
 */
export default function LetterPage({
  layout,
  paragraphs,
  index,
  total,
}: Props) {
  const {
    pageWidth,
    pageHeight,
    margin,
    contentWidth,
    contentHeight,
    lineGapPx,
    fontFamily,
    fontSize,
    lineHeight,
    textIndent,
    title,
    preset,
    customImage,
    showLines,
    showPageNumber,
    pageNumberFontFamily,
    pageNumberPosition,
    pageNumberFormat,
  } = layout;

  const isFirst = index === 0;

  // A custom upload takes priority; otherwise a preset may supply an image.
  const bgImage = customImage ?? preset.image ?? null;

  const pageStyle: CSSProperties = {
    position: "relative",
    width: pageWidth,
    height: pageHeight,
    overflow: "hidden",
    color: preset.ink,
    background: preset.paper,
  };

  const rulingStyle: CSSProperties = showLines
    ? {
        position: "absolute",
        inset: 0,
        backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${
          lineGapPx - 1
        }px, ${preset.line} ${lineGapPx - 1}px, ${preset.line} ${lineGapPx}px)`,
      }
    : {};

  const textStyle: CSSProperties = {
    position: "relative",
    fontFamily,
    fontSize,
    lineHeight,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  };

  const paraStyle: CSSProperties = {
    margin: 0,
    textIndent,
  };

  return (
    <div className="letter-page" data-page-index={index} style={pageStyle}>
      {/* Background image: custom upload or a preset image (cover). */}
      {bgImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bgImage}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
          }}
        />
      )}

      {/* Decorative double frame. */}
      {preset.frame && (
        <>
          <div
            style={{
              position: "absolute",
              inset: Math.round(margin * 0.42),
              border: `2px solid ${preset.frame}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: Math.round(margin * 0.42) + 5,
              border: `1px solid ${preset.frame}`,
              opacity: 0.7,
            }}
          />
        </>
      )}

      {/* Content area (inside the margins). */}
      <div
        style={{
          position: "absolute",
          top: margin,
          left: margin,
          width: contentWidth,
          height: contentHeight,
        }}
      >
        {showLines && <div style={rulingStyle} />}

        <div style={textStyle}>
          {isFirst && title.trim() !== "" && (
            <p style={{ margin: 0, fontWeight: 600, color: preset.accent }}>
              {title}
            </p>
          )}
          {paragraphs.map((p, i) => (
            <p key={i} style={paraStyle}>
              {p === "" ? " " : p}
            </p>
          ))}
        </div>
      </div>

      {/* Page number (only when multi-page and enabled). */}
      {showPageNumber && total > 1 && (
        <div
          style={{
            position: "absolute",
            fontFamily: pageNumberFontFamily,
            fontSize: 13,
            color: preset.accent,
            opacity: 0.75,
            ...pageNumberPositionStyle(pageNumberPosition, margin),
          }}
        >
          {formatPageNumber(index, total, pageNumberFormat)}
        </div>
      )}
    </div>
  );
}

/** Anchor + alignment for the page number based on its chosen corner. */
function pageNumberPositionStyle(
  position: ResolvedLayout["pageNumberPosition"],
  margin: number,
): CSSProperties {
  const hpad = Math.round(margin * 0.5);
  const vpad = Math.round(margin * 0.35);
  switch (position) {
    case "top-left":
      return { top: vpad, left: hpad, textAlign: "left" };
    case "top-right":
      return { top: vpad, right: hpad, textAlign: "right" };
    case "bottom-left":
      return { bottom: vpad, left: hpad, textAlign: "left" };
    case "bottom-right":
      return { bottom: vpad, right: hpad, textAlign: "right" };
    case "bottom-center":
    default:
      return { bottom: vpad, left: 0, width: "100%", textAlign: "center" };
  }
}

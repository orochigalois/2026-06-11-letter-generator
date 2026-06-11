import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "信笺生成器 · Letter Generator",
  description:
    "Write a letter, choose stationery and a font, preview it, and export it as PNG images.",
};

const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=Long+Cang",
    "family=Ma+Shan+Zheng",
    "family=Noto+Sans+SC:wght@400;500;700",
    "family=Noto+Serif+SC:wght@400;600;700",
    "family=ZCOOL+XiaoWei",
    "family=Zhi+Mang+Xing",
  ].join("&") +
  "&display=swap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mehtab Electronics — A Journey Through the Electronics Universe",
  description:
    "A cinematic, interactive flight through cameras, security, solar, smart home, networking and power systems — built by Mehtab Electronics.",
};

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={FONTS_HREF} rel="stylesheet" />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mehtab Electronics — Cameras, CCTV, Solar & Smart Home | Lahore",
  description:
    "Mehtab Electronics — professional camera systems, CCTV security, solar energy, smart home automation, networking and power solutions in Lahore. Installation, maintenance and repair.",
  keywords: [
    "Mehtab Electronics",
    "CCTV Lahore",
    "solar panels Lahore",
    "smart home Pakistan",
    "camera installation",
    "UPS inverter Lahore",
  ],
  openGraph: {
    title: "Mehtab Electronics — Future Electronics",
    description: "Cameras, security, solar, smart home, networking and power — installed and supported in Lahore.",
    type: "website",
    locale: "en_PK",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Mehtab Electronics" }],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#04050a",
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

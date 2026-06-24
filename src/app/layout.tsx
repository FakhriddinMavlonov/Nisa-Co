import type { Metadata } from "next";
import "./globals.css";
import { getLocale } from "next-intl/server";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Nisa&Co – Premium Fashion & Lifestyle",
    template: "%s | Nisa&Co",
  },
  description: "Premium fashion and lifestyle products.",
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let locale = "en";
  try {
    locale = await getLocale();
  } catch {
    // Admin routes don't have locale context
  }

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${playfairDisplay.variable} ${dancingScript.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

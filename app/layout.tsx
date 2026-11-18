import "lenis/dist/lenis.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
import "./editorial.css";
import "./logo.css";
import "./readability.css";
import "./hero.css";
import { RouteTransitions } from "@/components/route-transitions";
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    images: [
      {
        url: "/og-logo.png",
        width: 1200,
        height: 630,
        alt: "The Daily Standard folded newspaper mark",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og-logo.png"] },
  title: {
    default: "The Daily Standard — A wider view",
    template: "%s | The Daily Standard",
  },
  description:
    "Independent perspectives on world affairs, culture, science, and sport.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable}`}>
        <Providers>
          <RouteTransitions>{children}</RouteTransitions>
        </Providers>
      </body>
    </html>
  );
}

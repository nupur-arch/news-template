import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { siteConfig } from "@/src/config/site";
import "./globals.css";

const heading = Fraunces({ subsets: ["latin-ext"], variable: "--font-heading", display: "swap" });
const body = Inter({ subsets: ["latin-ext"], variable: "--font-body-brand", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  title: { default: siteConfig.seoTitle, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  icons: { icon: "/favicon.svg", apple: "/app-icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("cbo-theme");if(t!=="dark"&&t!=="light")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}` }} /></head><body className={`${heading.variable} ${body.variable}`}>{children}</body></html>;
}

import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";
import "@/components/home/carousel.css";
import { MotionProvider } from "@/components/motion/motion-system";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Cordeiro Group | Engenharia, Energia Solar e Automação",
  description: site.description,
  applicationName: site.name,
  // O domínio canônico e o sitemap serão configurados na fase de publicação.
  robots: { index: false, follow: false },
  openGraph: { title: "Cordeiro Group — Soluções integradas", description: site.description, locale: "pt_BR", type: "website", siteName: site.name },
};

export const viewport: Viewport = { themeColor: "#111b27" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={manrope.variable}><body>
    <svg width="0" height="0" aria-hidden="true" className="brand-filters"><defs><filter id="brand-white" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -1 -1 -1 0 3" /></filter></defs></svg>
    <MotionProvider>{children}</MotionProvider></body></html>;
}

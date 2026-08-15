import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav/nav";
import { Footer } from "@/components/footer/footer";
import { AppProviders } from "@/components/providers/app-providers";
import { TrackingScripts } from "@/components/providers/tracking-scripts";

const carena = localFont({
  src: "../public/fonts/Carena-Regular.otf",
  variable: "--font-carena",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smartea — Chá 100% natural, um ritual em cada lata",
  description:
    "Chás naturais Smartea: 6 blends para cada momento do seu dia. Cada lata traz um QR Code que ativa uma jornada de 21 dias no app Smartea+, guiada pela Flora.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${carena.variable} ${montserrat.variable} flex min-h-screen flex-col overflow-x-hidden font-body bg-creme text-tinta antialiased`}
      >
        <AppProviders>
          <Nav />
          <div className="flex-1">{children}</div>
          <Footer />
        </AppProviders>
        <TrackingScripts />
      </body>
    </html>
  );
}

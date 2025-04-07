import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import Script from "next/script";

export const metadata: Metadata = {
  title: "BasketBet Pro",
  description: "Dashboard de apostas esportivas para basquete",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BasketBet Pro",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="bg-gray-100">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BasketBet Pro" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-gray-100">
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 p-2 md:p-6 pt-14 md:pt-6">
            {children}
          </main>
        </div>
        <PWAInstallPrompt />
        <Script src="/sw-register.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

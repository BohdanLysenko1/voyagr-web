import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import 'react-day-picker/style.css';
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { NavbarVisibilityProvider } from "@/contexts/NavbarVisibilityContext";
import { FooterVisibilityProvider } from "@/contexts/FooterVisibilityContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Voyagr",
  description: "Travel deals and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Viewport Meta Tag for iOS Optimization */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content" 
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Website Ownership Verification Script */}
        <Script
          id="website-verification"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                  var script = document.createElement("script");
                  script.async = 1;
                  script.src = 'https://tpembars.com/NDUzMjQ5.js?t=453249';
                  document.head.appendChild(script);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh] flex flex-col`}
      >
        <FavoritesProvider>
          <NavbarVisibilityProvider>
            <FooterVisibilityProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </FooterVisibilityProvider>
          </NavbarVisibilityProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}

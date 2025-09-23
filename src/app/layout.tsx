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

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "./components/site-header";

const fraunces = localFont({
  variable: "--font-fraunces",
  display: "swap",
  src: [{ path: "./fonts/Fraunces-variable.woff2", style: "normal" }],
});

const openRunde = localFont({
  variable: "--font-open-runde",
  display: "swap",
  src: [
    {
      path: "./fonts/OpenRunde-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Activity",
  description: "Your Poke activity timeline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${openRunde.variable} ${fraunces.variable} h-full antialiased bg-[rgb(255,253,250)] dark:bg-[rgb(16,16,18)]`}
    >
      <body className="min-h-full flex flex-col bg-[rgb(255,253,250)] dark:bg-[rgb(16,16,18)]">
          <SiteHeader />
          <div className="pt-[83px]">{children}</div>
        </body>
    </html>
  );
}

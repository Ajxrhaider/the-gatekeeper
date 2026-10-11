import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "The Gatekeeper | Hizaki Labs",
  description:
    "A Hizaki Labs prompt-injection playground. Test a digital guard's instruction boundaries in a controlled demo.",
  applicationName: "The Gatekeeper",
  authors: [{ name: "John Hizaki" }],
  creator: "John Hizaki",
  publisher: "Hizaki Labs",
  keywords: [
    "Hizaki Labs",
    "prompt injection",
    "AI security",
    "Gemini 3.5 Flash-Lite",
    "Google Gemini API",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "The Gatekeeper | Hizaki Labs",
    description:
      "A prompt-injection challenge exploring how AI systems handle untrusted instructions.",
    siteName: "Hizaki Labs",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}

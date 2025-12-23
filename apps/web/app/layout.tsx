import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "RentFusion - Find Your Dream Home in 6 Days",
    template: "%s | RentFusion"
  },
  description:
    "AI-powered rental search monitoring 1,500+ sources. Get alerts in 15 seconds. Join 12,400+ successful renters.",
  keywords: ["rental", "housing", "Netherlands", "Amsterdam", "Utrecht", "Rotterdam", "apartment finder"],
  authors: [{ name: "RentFusion" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rentfusion.nl",
    title: "RentFusion - Find Your Dream Home Fast",
    description: "AI monitors 1,500+ rental sources. 15-second alerts. 94% success rate.",
    siteName: "RentFusion"
  },
  twitter: {
    card: "summary_large_image",
    title: "RentFusion",
    description: "Find rentals faster with AI"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Providers>
            {children}
            <Toaster position="top-right" richColors />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

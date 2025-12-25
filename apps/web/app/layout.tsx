import "./globals.css";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";

const inter = Inter({ 
  subsets: ["latin"], 
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["300", "500", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Uprent Plus - Find Your Dream Home in 6 Days",
    template: "%s | Uprent Plus"
  },
  description:
    "AI-powered rental search monitoring 1,500+ sources. Get alerts in 15 seconds. Join 12,400+ successful renters.",
  keywords: ["rental", "housing", "Netherlands", "Amsterdam", "Utrecht", "Rotterdam", "apartment finder"],
  authors: [{ name: "Uprent Plus" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://uprent.nl",
    title: "Uprent Plus - Find Your Dream Home Fast",
    description: "AI monitors 1,500+ rental sources. 15-second alerts. 94% success rate.",
    siteName: "Uprent Plus"
  },
  twitter: {
    card: "summary_large_image",
    title: "Uprent Plus",
    description: "Find rentals faster with AI"
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    languages: {
      'en': 'https://uprent.nl',
      'nl': 'https://uprent.nl/nl',
      'de': 'https://uprent.nl/de',
      'ar': 'https://uprent.nl/ar',
      'ru': 'https://uprent.nl/ru',
      'fr': 'https://uprent.nl/fr',
      'es': 'https://uprent.nl/es',
      'it': 'https://uprent.nl/it',
      'pl': 'https://uprent.nl/pl',
      'pt': 'https://uprent.nl/pt',
      'ja': 'https://uprent.nl/ja',
      'zh-CN': 'https://uprent.nl/zh-CN',
      'ko': 'https://uprent.nl/ko',
      'sv': 'https://uprent.nl/sv',
      'tr': 'https://uprent.nl/tr',
      'vi': 'https://uprent.nl/vi',
      'th': 'https://uprent.nl/th',
      'id': 'https://uprent.nl/id',
      'hi': 'https://uprent.nl/hi',
      'no': 'https://uprent.nl/no',
      'da': 'https://uprent.nl/da',
      'fi': 'https://uprent.nl/fi',
      'cs': 'https://uprent.nl/cs',
      'ro': 'https://uprent.nl/ro',
      'hu': 'https://uprent.nl/hu',
      'el': 'https://uprent.nl/el',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} font-sans`}>
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

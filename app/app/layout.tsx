import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import 'leaflet/dist/leaflet.css'

import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'

import AppMantineProvider from './mantine-provider'



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MyHome | Διαχείριση Ακινήτων",
    template: "%s | MyHome",
  },
  description:
    "Η MyHome είναι μια πλατφόρμα διαχείρισης ακινήτων: καταχώρισε ακίνητα, ενοικιαστές, συμβόλαια, τεχνικούς και συντηρήσεις σε ένα ενιαίο dashboard.",
  keywords: [
    "διαχείριση ακινήτων",
    "ενοικιαστές",
    "συντηρήσεις ακινήτων",
    "συμβόλαια ενοικίασης",
    "property management",
  ],
  openGraph: {
    title: "MyHome | Διαχείριση Ακινήτων",
    description:
      "Οργάνωσε ακίνητα, ενοικιαστές, συμβόλαια και συντηρήσεις σε ένα ενιαίο dashboard.",
    siteName: "MyHome",
    locale: "el_GR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyHome | Διαχείριση Ακινήτων",
    description:
      "Οργάνωσε ακίνητα, ενοικιαστές, συμβόλαια και συντηρήσεις σε ένα ενιαίο dashboard.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="el"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      {...mantineHtmlProps}
    >
      {/* <head>
        <ColorSchemeScript />
      </head> */}

      <body className="min-h-full flex flex-col">
        <AppMantineProvider>
          {children}
        </AppMantineProvider>
      </body>
    </html>
  );
}

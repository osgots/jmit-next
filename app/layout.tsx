import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "JMIT Next | Modern College Information Portal",
    template: "%s | JMIT Next",
  },

  description:
    "A modern, responsive and searchable information management portal inspired by Seth Jai Parkash Mukand Lal Institute of Engineering & Technology.",

  keywords: [
    "JMIT",
    "JMIT Radaur",
    "JMIT Next",
    "college portal",
    "engineering college",
    "BTech",
    "CSE",
    "JMIT notices",
  ],

  authors: [
    {
      name: "JMIT Next Project",
    },
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "JMIT Next",
    description:
      "Modern College Information & Management Portal",
    type: "website",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

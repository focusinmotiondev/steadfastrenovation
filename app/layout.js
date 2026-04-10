import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "../components/SiteChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Steadfast Renovation Ltd",
  description: "Premium home renovation services across Ontario.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><SiteChrome>{children}</SiteChrome></body>
    </html>
  );
}

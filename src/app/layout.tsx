import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "MediBook — Book trusted doctors online in minutes",
  description: "Search verified specialists by name, specialty or availability, book an appointment instantly and message your doctor from one secure dashboard.",
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased min-h-screen flex flex-col`}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}

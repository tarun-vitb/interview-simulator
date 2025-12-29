import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jobbr AI - AI-Powered Interview Simulation",
  description: "Practice technical interviews with AI-powered feedback and evaluation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}


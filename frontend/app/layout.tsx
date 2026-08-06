import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "NayiUdaan AI",
  description: "AI-powered career comeback platform for women."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

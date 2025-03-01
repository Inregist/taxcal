import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tax Calculator",
  description: "Tax calculator for Thai people",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}

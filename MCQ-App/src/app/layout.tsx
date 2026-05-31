import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "MCQ Duolingo - Gamified Learning",
  description:
    "Master MCQ with Duolingo-style progression, fast-paced gameplay, and addictive mechanics",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

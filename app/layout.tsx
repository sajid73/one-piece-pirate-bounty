import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pirate Bounty — Create Your Wanted Poster",
  description:
    "Create a stunning vintage pirate bounty poster with your photo. Customize every detail and download in high resolution.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Pirata+One&family=Cinzel:wght@400;700;900&family=IM+Fell+English:ital@0;1&family=Special+Elite&family=Almendra:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

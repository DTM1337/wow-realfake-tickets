import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real Fake Tickets — Way Out West",
  description:
    "Blev du scammad på festivalbiljetter? Way Out West ger lurade fans en ny chans. Ladda upp din scam-story och din fejkbiljett — den kan bli en riktig entré.",
  openGraph: {
    title: "Real Fake Tickets — Way Out West",
    description:
      "Din fejkbiljett kan bli en riktig entré till Way Out West. Ladda upp din scam-story.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}

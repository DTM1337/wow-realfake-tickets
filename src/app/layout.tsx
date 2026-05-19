import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real Fake Tickets — Way Out West",
  description:
    "Scamming fans has become an industry and fake tickets are at an all time high, leaving fans broke and devastated outside arenas around the globe. tour moves on, fans miss out. Luckily, many tours make a stop at Way Out West? That's why this year, we're giving devastated fans a new chance. Your fake ticket can now become a real entry to Way Out West. Apply with your scam-story to get the opportunity to experience your favorite artist live, once and for all.",
  openGraph: {
    title: "Real Fake Tickets — Way Out West",
    description:
      "Scamming fans has become an industry and fake tickets are at an all time high, leaving fans broke and devastated outside arenas around the globe. Your fake ticket can now become a real entry to Way Out West.",
    type: "website",
    images: ["/images/WristBand04.jpg"],
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

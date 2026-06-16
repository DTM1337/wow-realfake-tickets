import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "WOW REALFAKE TICKETS",
  description:
    "Scamming fans has become an industry and fake tickets are at an all time high, leaving fans broke and devastated outside arenas around the globe. tour moves on, fans miss out. Luckily, many tours make a stop at Way Out West? That's why this year, we're giving devastated fans a new chance. Your fake ticket can now become a real entry to Way Out West. Apply with your scam-story to get the opportunity to experience your favorite artist live, once and for all.",
  openGraph: {
    title: "WOW REALFAKE TICKETS",
    description:
      "Scamming fans has become an industry and fake tickets are at an all time high, leaving fans broke and devastated outside arenas around the globe. Your fake ticket can now become a real entry to Way Out West.",
    type: "website",
    images: [asset("/images/wow-kv.jpg")],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" style={{
      "--modal-texture-url": `url("${asset("/images/modal-texture.png")}")`,
    } as React.CSSProperties}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

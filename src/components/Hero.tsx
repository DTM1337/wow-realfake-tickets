import { asset } from "@/lib/asset";

const YOUTUBE_ID = "aoGPWpQrudo";
const CAMPAIGN_END = new Date("2026-07-09T00:00:00+02:00");

export default function Hero() {
  const campaignEnded = new Date() >= CAMPAIGN_END;

  return (
    <section className="hero">
      <div className="hero__video" style={campaignEnded ? { opacity: 0.25 } : undefined}>
        <iframe
          src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&rel=0&playsinline=1`}
          title="Way Out West — Real Fake Tickets"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
      {campaignEnded && (
        <>
          <img
            src={asset("/images/hero-desktop-end.png")}
            alt=""
            className="hero__end hero__end--desktop"
          />
          <img
            src={asset("/images/hero-mobile-end.png")}
            alt=""
            className="hero__end hero__end--mobile"
          />
        </>
      )}
    </section>
  );
}

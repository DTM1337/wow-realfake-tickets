const YOUTUBE_ID = "aoGPWpQrudo";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__video">
        <iframe
          src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&rel=0&playsinline=1`}
          title="Way Out West — Real Fake Tickets"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}

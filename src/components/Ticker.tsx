/**
 * Helbredds-ticker som loopar åt vänster. Ren CSS-animation, ingen JS —
 * därför en server-komponent. Styling ligger i globals.css (.ticker*).
 *
 * Två identiska grupper i spåret; animationen flyttar -50% (exakt en
 * gruppbredd) vilket ger en sömlös loop oavsett bildbredd.
 */
export default function Ticker() {
  const COPIES = 3; // höj om du har skärmar bredare än ~5700px

  return (
    <a
      href="https://www.wayoutwest.se"
      aria-label="Way Out West, 13–15 augusti – köp biljetter"
      className="ticker"
    >
      <div className="ticker__track">
        {[0, 1].map((group) => (
          <div className="ticker__group" key={group} aria-hidden={group === 1}>
            {Array.from({ length: COPIES }).map((_, i) => (
              <img
                key={i}
                src="/images/ticker-strip.png"
                alt=""
                className="ticker__img"
                draggable={false}
              />
            ))}
          </div>
        ))}
      </div>
    </a>
  );
}

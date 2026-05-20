"use client";

import { useState } from "react";

/** YouTube-id för hero-videon. Byt mot festival-videons id (delen efter v= i URL:en). */
const YOUTUBE_ID = "dQw4w9WgXcQ";

/**
 * Play-knappen på stillbilden byter ut hero-bilden mot en YouTube-embed.
 * När videon visas används YouTubes egna spelarkontroller.
 */
export default function Hero() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="hero">
      <picture>
        <source media="(max-width: 767px)" srcSet="/images/hero-mobile.png" />
        <img src="/images/hero-desktop.png" alt="Way Out West — Real Fake Tickets" />
      </picture>
    </section>
  );
}

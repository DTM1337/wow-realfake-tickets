"use client";

import { useState } from "react";
import { asset } from "@/lib/asset";

const YOUTUBE_ID = "aoGPWpQrudo";

export default function Hero() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="hero">
      {playing ? (
        <div className="hero__video">
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
            title="Way Out West — Real Fake Tickets"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <>
          <picture>
            <source media="(max-width: 767px)" srcSet={asset("/images/hero-mobile.png")} />
            <img src={asset("/images/hero-desktop.png")} alt="Way Out West — Real Fake Tickets" />
          </picture>
          <button
            type="button"
            className="hero__play"
            onClick={() => setPlaying(true)}
            aria-label="Spela upp film"
          >
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="40" cy="40" r="38" stroke="#ffb4dd" strokeWidth="2" fill="rgba(10,10,10,0.5)" />
              <polygon points="32,24 32,56 58,40" fill="#ffb4dd" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}

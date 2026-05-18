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
      {playing ? (
        <div className="hero__video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&controls=1&rel=0&playsinline=1`}
            title="Way Out West — Real Fake Tickets"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <>
          <picture>
            <source media="(max-width: 767px)" srcSet="/images/hero-mobile.png" />
            <img
              src="/images/hero-desktop.png"
              alt="Way Out West — Real Fake Tickets"
            />
          </picture>
          <button
            className="hero__play"
            onClick={() => setPlaying(true)}
            aria-label="Spela upp video"
          >
            <svg
              viewBox="0 0 100 100"
              width="100%"
              height="100%"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="rgba(0,0,0,0.35)"
                stroke="#ffffff"
                strokeWidth="3"
              />
              <path d="M40 32 L70 50 L40 68 Z" fill="#ffffff" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}

import Ticker from "@/components/Ticker";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import UploadSection from "@/components/UploadSection";
import FAQ from "@/components/FAQ";
import { asset } from "@/lib/asset";

export default function Home() {
  return (
    <main>
      {/*
        Riktig text för SEO + skärmläsare.
        Designen bakar in all synlig text i sektionsbilderna, så den här
        texten är osynlig på skärm men läses av Google och skärmläsare.
      */}
      <h1 className="srOnly">WOW REALFAKE TICKETS</h1>
      <p className="srOnly">
        Scamming av festivalbiljetter är ett växande problem. Way Out West ger
        lurade fans en ny chans: din fejkbiljett kan bli en riktig entré. Ladda
        upp din scam-story och en bild på fejkbiljetten för chansen att se din
        favoritartist live.
      </p>

      <Ticker />
      <Hero />

      <Section
        id="real-fake-tickets"
        desktop={asset("/images/realfake-desktop.png")}
        mobile={asset("/images/realfake-mobile.png")}
        alt="WOW Admit One — Real Fake Tickets"
      />

      <UploadSection />

      <Section
        id="scam-tickets"
        desktop={asset("/images/scam-desktop.png")}
        mobile={asset("/images/scam-mobile.png")}
        alt="Scam tickets now valid"
      />

      <FAQ />

      <Section
        id="footer"
        desktop={asset("/images/footer-desktop.png")}
        mobile={asset("/images/footer-mobile.png")}
        alt="Way Out West — all rights reserved"
      />
    </main>
  );
}

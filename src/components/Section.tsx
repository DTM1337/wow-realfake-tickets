type Props = {
  id?: string;
  desktop: string;
  mobile: string;
  alt: string;
};

/**
 * Generisk helbreddssektion.
 * Byter bild vid 768px — desktop- och mobil-crop är komponerade var för sig
 * i Figma. Mellan brytpunkterna skalar bilden fluid (width: 100%).
 */
export default function Section({ id, desktop, mobile, alt }: Props) {
  const showAnimatedTitle = id === "real-fake-tickets";

  return (
    <section id={id} className="section">
      <picture>
        <source media="(max-width: 767px)" srcSet={mobile} />
        <img src={desktop} alt={alt} />
      </picture>
      {showAnimatedTitle && (
        <div className="sectionTitle" aria-hidden="true">
          <img className="sectionTitle__frame sectionTitle__frame--1" src="/images/hero-title-1.png" alt="" />
          <img className="sectionTitle__frame sectionTitle__frame--2" src="/images/hero-title-2.png" alt="" />
          <img className="sectionTitle__frame sectionTitle__frame--3" src="/images/hero-title-3.png" alt="" />
        </div>
      )}
    </section>
  );
}

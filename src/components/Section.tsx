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
  return (
    <section id={id} className="section">
      <picture>
        <source media="(max-width: 767px)" srcSet={mobile} />
        <img src={desktop} alt={alt} />
      </picture>
    </section>
  );
}

const faqs = [
  {
    q: "How does it work?",
    a: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
  },
  {
    q: "How does it work?",
    a: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
  },
];

export default function FAQ() {
  return (
    <section className="faq">
      <div className="faq__title" aria-label="Frequently Asked Questions">
        <img className="sectionTitle__frame sectionTitle__frame--1" src="/images/faq-title-1.png" alt="" />
        <img className="sectionTitle__frame sectionTitle__frame--2" src="/images/faq-title-2.png" alt="" />
        <img className="sectionTitle__frame sectionTitle__frame--3" src="/images/faq-title-3.png" alt="" />
      </div>
      <div className="faq__list">
        {faqs.map((item, i) => (
          <div key={i} className="faq__item">
            <p className="faq__q">Q: {item.q}</p>
            <p className="faq__a">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

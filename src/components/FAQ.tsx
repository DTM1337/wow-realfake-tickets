import { asset } from "@/lib/asset";

const faqs = [
  {
    q: "What is Way Out West?",
    a: "Way Out West is a music festival held annually in Slottsskogen, Gothenburg, Sweden, since 2007. Every year, the festival brings together more than 120 artists from around the world, alongside a wide range of food experiences, film screenings, talks, and other cultural events.\n\nWay Out West is also known for its long-standing commitment to sustainability. Since day one, environmental and social responsibility have been a core part of the festival's identity, from serving a fully vegetarian food offering to continuously working to reduce its environmental footprint.\n\nWay Out West is organized by Luger.",
  },
  {
    q: "Why is Way Out West doing this?",
    a: "Live music should be about unforgettable experiences, not ticket scams.\n\nWith this campaign, we want to shine light on the growing problem of fake concert tickets while giving fans a second chance to experience their favorite artist once and for all.",
  },
  {
    q: "Why do I need to be 18 years or older to participate?",
    a: "The simple answer is that the prize in this promotion consists of Way Out West 3-Day Festival Passes, which are only valid for attendees aged 18 or older.",
  },
  {
    q: "During what period can I participate?",
    a: "The Promotion begins on 24 June 2026 at 00:00 and ends on 8 July 2026 at 23:59, based on Swedish local time (Central European Summer Time (CEST), UTC+2).\n\nEntries submitted before or after the Promotion Period will not be eligible.",
  },
  {
    q: "How to participate?",
    a: "To enter the Promotion, participants must visit wayoutwest.se/realfaketickets, complete the entry form, and upload material relating to an experience involving fraudulent, counterfeit, or invalid concert tickets.\n\nExamples of acceptable materials include screenshots, receipts, correspondence, ticket images, or similar content.\n\nNo purchase is necessary to enter or win. A purchase will not increase a participant's chances of winning.",
  },
  {
    q: "What proof can I attach?",
    a: "You may upload any material related to your experience with fraudulent, counterfeit, or invalid concert tickets.\n\nExamples include:\n- Tell your story as video\n- Tell your story as free text\n- Link to your social media profile's story or post\n- Ticket images\n- Screenshots of conversations or messages\n- Receipts or payment confirmations\n- Email correspondence\n- Screenshots from ticket marketplaces or social media\n- Any other material that helps tell your story",
  },
  {
    q: "How do you know that the submitted stories and materials are genuine?",
    a: "We can't verify every single submission, but we choose to trust people. Part of that is why we ask applicants to share their full story so we can assess its credibility. We want the tickets to go to people who have had a genuinely bad experience. And after all, we don't want to get scammed ourselves.\n\nHowever, \"The Real Fake Tickets\" is a creative campaign designed to raise awareness about ticket fraud and give people an opportunity to share their experiences. Winners are selected by a jury based on criteria such as originality and storytelling, rather than on formal verification of submitted materials.\n\nThat said, we reserve the right to remove entries that appear misleading, inappropriate, or inconsistent with the spirit of the campaign.",
  },
  {
    q: "Do fake tickets normally appear at Way Out West?",
    a: "As with all major events, counterfeit tickets occasionally surface for Way Out West as well. The festival takes this issue seriously and works actively to combat ticket fraud, including extensive communication ahead of each event to remind visitors that only tickets purchased through the festival's official ticketing partner can be guaranteed as valid. Buying tickets on the secondary market always comes with a degree of risk.\n\nOf course, the best thing is to not get scammed in the first place. HERE are some tips on how to protect yourself from ticket scams.",
    link: "https://discover.ticketmaster.co.uk/hq/how-to-protect-yourself-against-ticketing-scams-61211/",
  },
];

export default function FAQ() {
  return (
    <section className="faq">
      <div className="faq__title" aria-label="Frequently Asked Questions">
        <img className="sectionTitle__frame sectionTitle__frame--1" src={asset("/images/faq-title-1.png")} alt="" />
        <img className="sectionTitle__frame sectionTitle__frame--2" src={asset("/images/faq-title-2.png")} alt="" />
        <img className="sectionTitle__frame sectionTitle__frame--3" src={asset("/images/faq-title-3.png")} alt="" />
      </div>
      <div className="faq__list">
        {faqs.map((item, i) => (
          <div key={i} className="faq__item">
            <p className="faq__q">Q: {item.q}</p>
            <div className="faq__a">
              {item.a.split("\n").map((line, j) =>
                line === "" ? <br key={j} /> : <p key={j}>{line}</p>
              )}
              {item.link && (
                <p>
                  <a href={item.link} target="_blank" rel="noreferrer">
                    {item.link}
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the Midnight 12:00 AM doorstep surprise work?",
      a: "Our stealth decor crew arrives quietly outside your apartment or home around 11:30 PM. We lay down red carpets or rose petal pathways, arrange fairy-light arches, setup the celebration cake and gift boxes. Exactly at 12:00 AM midnight, we trigger the reveal (with music, sparklers, or door chime) as your partner or family member opens the door."
    },
    {
      q: "What does '(Our Side)' mean on package inclusions?",
      a: "Where an inclusion is designated as '(Our Side)' (such as birthday cake, ring/curated gift box, or return gifts), Movement Craft personally supplies and curates that item so you don't have to scramble to buy them. If you prefer to supply your own custom gift or specialty cake, we seamlessly incorporate yours instead."
    },
    {
      q: "Are the cold sparkler pyrotechnics safe for indoor venues and homes?",
      a: "Yes! We use specialized cold pyro fountains. They produce smokeless, non-flammable cold sparks that are safe to touch and won't trigger smoke alarms or burn clothing, making them safe for indoors, banquets, cafes, and rooftop parties."
    },
    {
      q: "How much in advance should we book with Movement Craft?",
      a: "For weekend midnight slots, private theatre bookings, and elaborate proposal arches, we recommend booking 2 to 5 days in advance. However, we also accommodate same-day urgent surprise requests in Chhatrapati Sambhaji Nagar subject to crew availability."
    },
    {
      q: "Which areas in Chhatrapati Sambhaji Nagar do you serve?",
      a: "We cover all major neighborhoods including CIDCO (all sectors N-1 to N-11), Connaught Place, Garkheda, Nirala Bazar, Samarth Nagar, Seven Hills, Jalna Road, Beed Bypass, Osmanpura, Waluj, Chikalthana, and surrounding resorts."
    },
    {
      q: "Can we customize an existing package or create a totally new surprise concept?",
      a: "Absolutely! You can use our online Surprise Customizer tool to add live guitarists, drone video reels, extra cold pyros, or custom neon signs. You can also chat directly with founder Kuldeep Rajput to create a one-of-a-kind concept."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-[#080808] border-b border-[#D4AF37]/20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1810] border border-[#D4AF37]/30 text-xs text-[#F5D77F] uppercase tracking-widest font-semibold">
            Clear Answers
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
            Frequently Asked <span className="text-gold-gradient">Questions</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Everything you need to know about booking, secrecy, inclusions, and timelines.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-xl bg-[#12110D] border border-[#D4AF37]/20 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#1A1710] transition-colors"
                >
                  <span className="font-cinzel text-base font-bold text-white">
                    {faq.q}
                  </span>
                  <div className={`w-6 h-6 rounded-full bg-[#1E1A11] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-[#D4AF37]/10 bg-[#0E0D0A]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

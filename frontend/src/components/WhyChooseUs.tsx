import React from 'react';
import { ShieldCheck, HeartHandshake, Sparkles, MapPin, Award, UserCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />,
      title: "100% Confidential Secrecy",
      description: "We communicate only on your preferred channel and timing. Your loved one won't suspect a single detail until the magical reveal happens."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#D4AF37]" />,
      title: "Complete All-In-One Service",
      description: "From entrance arches and candlelit pathways to fresh gourmet cakes, curated gifts, fireworks, and 4K Instagram reels — we supply it all."
    },
    {
      icon: <UserCheck className="w-6 h-6 text-[#D4AF37]" />,
      title: "Direct Founder Attention",
      description: "Every single surprise is personally supervised by Kuldeep Rajput to ensure flawless execution and genuine emotional impact."
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#D4AF37]" />,
      title: "Local Sambhaji Nagar Roots",
      description: "Deep relationships with premier cafes, private screening halls, and rooftop venues across CIDCO, Nirala Bazar, Beed Bypass, and Connaught Place."
    }
  ];

  return (
    <section className="py-20 bg-[#0A0A0A] border-b border-[#D4AF37]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1810] border border-[#D4AF37]/30 text-xs text-[#F5D77F] uppercase tracking-widest font-semibold">
            The Movement Craft Standard
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Why Trust Us With <span className="text-gold-gradient">Your Special Day</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            "More than just events... turning moments into memories." 
            We treat your celebration with the respect and excitement it deserves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#12110D] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#1E1A11] border border-[#D4AF37]/40 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-white">
                  {pillar.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { Check, Sparkles, MessageCircle, ArrowUpRight } from 'lucide-react';
import { SurprisePackage, BusinessConfig, PackageInclusion } from '../types';

interface PackagesSectionProps {
  packages: SurprisePackage[];
  config: BusinessConfig;
  onSelectPackageForCustomizing: (pkg: SurprisePackage) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  config,
  onSelectPackageForCustomizing
}) => {
  const formatInr = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const createWhatsAppLink = (pkg: SurprisePackage) => {
    const text = `Hello Kuldeep! I am interested in booking the *${pkg.title}* (${formatInr(pkg.startingPrice)}) with Movement Craft in Chhatrapati Sambhaji Nagar. Please let me know available slots.`;
    return `https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  // Only show published packages on public site
  const publishedPackages = packages.filter(p => p.isPublished !== false);

  return (
    <section id="packages" className="py-20 bg-[#0A0A0A] border-b border-[#D4AF37]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1810] border border-[#D4AF37]/30 text-xs text-[#F5D77F] uppercase tracking-widest font-semibold">
            Official Brochure Concepts
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Curated <span className="text-gold-gradient">Surprise Packages</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Every package is meticulously executed with our signature attention to detail. 
            Select any package to customize its inclusions, fireworks, live music, or gift hampers.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`group rounded-2xl bg-[#12110D] border transition-all duration-300 flex flex-col overflow-hidden relative ${
                pkg.popular 
                  ? 'border-[#D4AF37]/60 shadow-xl gold-glow-sm' 
                  : 'border-[#D4AF37]/25 hover:border-[#D4AF37]/50'
              }`}
            >
              {/* Card Image Area */}
              <div className="relative h-60 overflow-hidden bg-black">
                <img
                  src={pkg.image || '/assets/movement_craft_packages.jpeg'}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/movement_craft_packages.jpeg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12110D] via-transparent to-black/40" />
                
                {/* Badge if present */}
                {pkg.badge && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider shadow-md">
                    {pkg.badge}
                  </span>
                )}

                {/* Title inside card preview */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-cinzel text-xl font-bold text-white drop-shadow-md">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-[#F5D77F] font-serif italic">
                    {pkg.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                
                <div className="space-y-4">
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Price Row */}
                  <div className="pt-2 border-t border-[#D4AF37]/15 flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-wider text-zinc-400">Starting from</span>
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-2">
                        <span className="text-2xl font-bold text-[#FFF3D1] font-sans tabular-nums">
                          {formatInr(pkg.startingPrice)}
                        </span>
                        {pkg.discountedPrice && (
                          <span className="text-xs text-zinc-500 line-through tabular-nums">
                            {formatInr(pkg.discountedPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 block">
                        {pkg.customizationEnabled !== false ? '+ customized add-ons' : 'Fixed package'}
                      </span>
                    </div>
                  </div>

                  {/* Listed Inclusions from Brochure */}
                  <div className="space-y-2.5 pt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                      Package Inclusions:
                    </p>
                    <ul className="space-y-2">
                      {pkg.inclusions.map((inc: PackageInclusion, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-200">
                          <div className="w-4 h-4 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-[#D4AF37]" />
                          </div>
                          <span className="flex-1">
                            {inc.text}{' '}
                            {inc.isOurSide && (
                              <span className="inline-block ml-1 px-1.5 py-0.2 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D77F] text-[10px] font-semibold">
                                (Our Side)
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-col gap-2.5">
                  {pkg.customizationEnabled !== false && (
                    <button
                      onClick={() => onSelectPackageForCustomizing(pkg)}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#221D12] hover:bg-[#2A2315] border border-[#D4AF37]/50 text-[#F5D77F] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Customize This Package</span>
                    </button>
                  )}

                  <a
                    href={createWhatsAppLink(pkg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all text-center"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-black" />
                    <span>Inquire On WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Brochure Callout Note */}
        <div className="mt-12 text-center text-xs text-zinc-400">
          * Inclusions marked with <span className="text-[#F5D77F] font-semibold">(Our Side)</span> are provided and curated directly by Movement Craft.
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { Sparkles, ArrowRight, Shield, Clock, Camera, Flame } from 'lucide-react';
import { BusinessConfig } from '../types';
import heroImage from '../assets/images/hero_luxury_surprise_setup_1793027122212.jpg';

interface HeroProps {
  config: BusinessConfig;
  onOpenCustomizer: () => void;
  onOpenBrochures: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onOpenCustomizer, onOpenBrochures }) => {
  return (
    <section className="relative overflow-hidden bg-[#080808] border-b border-[#D4AF37]/20 pt-8 pb-16 lg:py-24">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Message & Direct CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Founder badge & Location */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16140E] border border-[#D4AF37]/30 text-xs text-[#E5DFD3]">
              <span className="text-[#D4AF37] font-semibold">Founder: {config.founder}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-300">{config.location}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Surprise Events & <br />
              <span className="text-gold-gradient">Special Moments</span>
            </h1>

            {/* Taglines */}
            <div className="space-y-2">
              <p className="text-lg sm:text-xl font-serif italic text-[#F5D77F]/90 max-w-xl mx-auto lg:mx-0">
                "{config.tagline}"
              </p>
              <p className="text-sm font-sans text-zinc-400 max-w-xl mx-auto lg:mx-0">
                "Hum sirf event plan nahi karte, yaadein banate hai, apno ke saath."
              </p>
            </div>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Chhatrapati Sambhaji Nagar's premier surprise planners. From midnight 12 AM doorstep reveals, 
              romantic candlelight dinners, private silver-screen theatre surprises to grand fireworks entries 
              and cinematic video reels.
            </p>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenCustomizer}
                className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#AA820A] text-black font-semibold text-sm tracking-wider uppercase hover:brightness-110 active:scale-98 transition-all shadow-lg gold-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Plan Your Surprise</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#packages"
                className="w-full sm:w-auto px-7 py-3.5 rounded-lg border border-[#D4AF37]/50 hover:bg-[#1C180E] text-[#F3EFE0] text-sm font-medium tracking-wide transition-all text-center"
              >
                View Flagship Packages
              </a>
            </div>

            {/* Quick Link to original brochures */}
            <div className="pt-2 text-xs text-zinc-400 flex items-center justify-center lg:justify-start gap-2">
              <span>Have the official menu poster?</span>
              <button
                onClick={onOpenBrochures}
                className="text-[#D4AF37] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                Inspect Official Posters
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Brand Medallion */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-[#D4AF37]/40 p-2 bg-[#12110D] shadow-2xl gold-glow">
              <div className="relative h-96 sm:h-[460px] rounded-xl overflow-hidden">
                <img
                  src={heroImage}
                  alt="Luxury Surprise Event Setup by Movement Craft"
                  className="w-full h-full object-cover brightness-95 hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/hero_luxury_surprise_setup_1793027122212.jpg';
                  }}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Floating Brand Stamp */}
                <div className="absolute top-4 right-4 bg-black/85 backdrop-blur-md border border-[#D4AF37]/50 rounded-xl p-2.5 flex items-center gap-3">
                  <img
                    src="/assets/movement_craft_logo.jpeg"
                    alt="MC Official Emblem"
                    className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                  />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">Official Planner</p>
                    <p className="text-xs font-bold text-white">Chhatrapati Sambhaji Nagar</p>
                  </div>
                </div>

                {/* Bottom Card Info */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-[#D4AF37]/30 rounded-xl p-4 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#D4AF37]">Available Tonight</p>
                      <h4 className="font-cinzel text-lg font-bold text-white">Midnight & Romantic Setups</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-zinc-400 block">Direct Booking</span>
                      <span className="text-xs font-semibold text-[#F5D77F]">+91 8793877192</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4-Item Trust Feature Strip */}
        <div className="mt-14 pt-8 border-t border-[#D4AF37]/20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#19160E] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">100% Confidential</p>
              <p className="text-xs text-zinc-400">Zero chance of spoiling surprises</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#19160E] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">12:00 AM Precision</p>
              <p className="text-xs text-zinc-400">Exact midnight doorstep arrival</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#19160E] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Pyros & Cold Smoke</p>
              <p className="text-xs text-zinc-400">Indoor safe sparklers & fog</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#19160E] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Cinematic 4K Reels</p>
              <p className="text-xs text-zinc-400">Capture genuine teary reactions</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

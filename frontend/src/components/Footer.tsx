import React from 'react';
import { Phone, MessageCircle, Instagram, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { BusinessConfig } from '../types';

interface FooterProps {
  config: BusinessConfig;
  onOpenAdmin: () => void;
  onOpenBrochures: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenAdmin, onOpenBrochures }) => {
  return (
    <footer className="bg-[#050505] border-t border-[#D4AF37]/25 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/60 p-0.5 gold-glow-sm bg-black">
                <img
                  src="/assets/movement_craft_logo.jpeg"
                  alt="Movement Craft Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-[#FFF3D1] tracking-wider">
                  MOVEMENT CRAFT
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  Surprise Event Planners
                </p>
              </div>
            </div>

            <p className="text-zinc-300 text-xs leading-relaxed max-w-sm">
              "{config.tagline}"
            </p>
            <p className="text-zinc-500 text-xs italic">
              "Hum sirf event plan nahi karte, yaadein banate hai, apno ke saath."
            </p>

            <div className="pt-2 text-zinc-300 flex items-center gap-2">
              <span className="text-[#D4AF37] font-semibold">Founder:</span>
              <span>{config.founder}</span>
              <span className="text-zinc-600">·</span>
              <span>Chhatrapati Sambhaji Nagar, MH</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
              Surprise Categories
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#packages" className="hover:text-[#D4AF37] transition-colors">Birthday Surprise (Fire Entry)</a></li>
              <li><a href="#packages" className="hover:text-[#D4AF37] transition-colors">Midnight 12 AM Surprise</a></li>
              <li><a href="#packages" className="hover:text-[#D4AF37] transition-colors">Proposal & Marry Me Setup</a></li>
              <li><a href="#packages" className="hover:text-[#D4AF37] transition-colors">Theatre Big Screen Tribute</a></li>
              <li><a href="#packages" className="hover:text-[#D4AF37] transition-colors">Cafe Candlelight Dinner</a></li>
              <li><a href="#services" className="hover:text-[#D4AF37] transition-colors">All 14+ Services Menu</a></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
              Direct Contact
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <a href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {config.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <a href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {config.whatsapp} (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-pink-400" />
                <a href="https://www.instagram.com/movementcraft.events/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {config.instagram}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-zinc-400">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Chhatrapati Sambhaji Nagar (Aurangabad), Maharashtra, India</span>
              </li>
            </ul>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenBrochures}
                className="text-xs text-[#F5D77F] hover:underline"
              >
                Official Brochures
              </button>
              <span className="text-zinc-700">·</span>
              <button
                onClick={onOpenAdmin}
                className="text-xs text-zinc-400 hover:text-[#D4AF37] flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Owner Admin</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <p>© {new Date().getFullYear()} Movement Craft. All rights reserved. Designed for Kuldeep Rajput.</p>
          <p className="flex items-center gap-1">
            Crafting memories across Chhatrapati Sambhaji Nagar <Heart className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
          </p>
        </div>

      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { Menu, X, Phone, MessageCircle, ShieldCheck, FileText } from 'lucide-react';
import { BusinessConfig } from '../types';

interface NavbarProps {
  config: BusinessConfig;
  onOpenAdmin: () => void;
  onOpenBrochures: () => void;
  onOpenCustomizer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  onOpenAdmin,
  onOpenBrochures,
  onOpenCustomizer
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Announcement Bar if enabled */}
      {config.announcement?.enabled && (
        <div className="bg-[#14120C] border-b border-[#D4AF37]/20 py-1.5 px-4 text-center text-xs text-[#E5DFD3] tracking-wide flex items-center justify-center gap-2">
          <span>{config.announcement.text}</span>
          <a
            href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`}
            className="text-[#D4AF37] hover:underline font-semibold whitespace-nowrap ml-1"
          >
            Call Now
          </a>
        </div>
      )}

      {/* Main Top Bar following Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-[#080808]/90 backdrop-blur-md border-b border-[#D4AF37]/20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand title & Official Logo (single line wordmark) */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#D4AF37]/60 p-0.5 gold-glow-sm bg-black">
              <img
                src="/assets/movement_craft_logo.jpeg"
                alt="Movement Craft Logo"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // Fallback if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-[#FFF3D1] group-hover:text-[#D4AF37] transition-colors whitespace-nowrap">
                MOVEMENT CRAFT
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/80 font-sans whitespace-nowrap">
                Surprise Event Planners
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#E5DFD3]/90">
            <a
              href="#packages"
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap"
            >
              Packages
            </a>
            <a
              href="#services"
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap"
            >
              Surprise Menu
            </a>
            <a
              href="#addons"
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap"
            >
              Add-Ons
            </a>
            <button
              onClick={onOpenBrochures}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              Official Brochure
            </button>
            <a
              href="#contact"
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Owner Admin Key */}
            <button
              onClick={onOpenAdmin}
              title="Admin Portal (Kuldeep Rajput)"
              className="p-2 text-[#E5DFD3]/60 hover:text-[#D4AF37] hover:bg-[#1A1813] rounded-lg transition-colors"
              aria-label="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>

            {/* Primary Action Button */}
            <a
              href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Kuldeep! I want to plan a surprise event with Movement Craft in Chhatrapati Sambhaji Nagar.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#AA820A] text-black font-semibold text-xs tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all shadow-md gold-glow-sm whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Book On WhatsApp</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#E5DFD3] hover:text-[#D4AF37] rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0C0B08] border-b border-[#D4AF37]/20 px-6 py-5 space-y-4">
            <div className="flex flex-col space-y-3 text-base font-medium text-[#E5DFD3]">
              <a
                href="#packages"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#D4AF37]"
              >
                Surprise Packages
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#D4AF37]"
              >
                Services Menu (14+ Types)
              </a>
              <a
                href="#addons"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#D4AF37]"
              >
                Special Add-Ons
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBrochures();
                }}
                className="text-left py-1 hover:text-[#D4AF37] flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                View Original Brochures
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCustomizer();
                }}
                className="text-left py-1 text-[#F5D77F] font-semibold"
              >
                ✨ Build Custom Surprise
              </button>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#D4AF37]"
              >
                Contact & Location
              </a>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-col gap-2.5">
              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Kuldeep! I want to plan a surprise event with Movement Craft.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-semibold text-xs tracking-wider uppercase text-center"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                Book via WhatsApp
              </a>
              <a
                href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider text-center"
              >
                <Phone className="w-4 h-4" />
                Call +91 8793877192
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

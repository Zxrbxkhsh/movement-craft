import React, { useState } from 'react';
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react';

interface BrochuresModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrochuresModal: React.FC<BrochuresModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'services' | 'logo'>('packages');

  if (!isOpen) return null;

  const posters = {
    packages: {
      title: "Surprise Packages & Inclusions Brochure",
      subtitle: "Official brochure covering Birthday, Midnight, Theatre, Cafe & Proposal packages",
      src: "/assets/movement_craft_packages.jpeg"
    },
    services: {
      title: "Surprise Services Booking Menu",
      subtitle: "Official menu featuring 14+ booking categories & founder credentials",
      src: "/assets/movement_craft_services.jpeg"
    },
    logo: {
      title: "Official Movement Craft Brand Medallion",
      subtitle: "Golden circular insignia & Founder Kuldeep Rajput signature",
      src: "/assets/movement_craft_logo.jpeg"
    }
  };

  const current = posters[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto rounded-2xl bg-[#0F0E0C] border border-[#D4AF37]/50 shadow-2xl gold-glow overflow-hidden text-white flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#16140E] border-b border-[#D4AF37]/30 flex items-center justify-between">
          <div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#FFF3D1]">
              Official Movement Craft Posters
            </h3>
            <p className="text-xs text-zinc-400">
              Verified original brand assets and service literature
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#D4AF37]/20 bg-[#110F0A] overflow-x-auto">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'packages'
                ? 'border-b-2 border-[#D4AF37] text-[#F5D77F] bg-[#1A1810]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Packages Reference
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'services'
                ? 'border-b-2 border-[#D4AF37] text-[#F5D77F] bg-[#1A1810]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Services Menu
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'logo'
                ? 'border-b-2 border-[#D4AF37] text-[#F5D77F] bg-[#1A1810]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Official Logo
          </button>
        </div>

        {/* Poster Viewer Container */}
        <div className="p-4 sm:p-8 flex flex-col items-center bg-[#070707] min-h-[400px] max-h-[70vh] overflow-y-auto">
          <div className="text-center mb-4 space-y-1">
            <h4 className="font-cinzel text-base sm:text-lg font-bold text-white">
              {current.title}
            </h4>
            <p className="text-xs text-[#D4AF37]">
              {current.subtitle}
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-[#D4AF37]/40 max-w-full sm:max-w-lg shadow-2xl bg-black">
            <img
              src={current.src}
              alt={current.title}
              className="w-full h-auto object-contain max-h-[500px]"
            />
          </div>

          {/* Action links */}
          <div className="mt-6 flex items-center gap-4">
            <a
              href={current.src}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#1B1811] hover:bg-[#252015] border border-[#D4AF37]/30 text-xs text-[#F5D77F] font-semibold flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Full Resolution</span>
            </a>
            <a
              href={current.src}
              download
              className="px-4 py-2 rounded-lg bg-[#1B1811] hover:bg-[#252015] border border-[#D4AF37]/30 text-xs text-zinc-300 font-semibold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

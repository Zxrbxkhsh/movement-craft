import React, { useState } from 'react';
import { Phone, MessageCircle, Instagram, MapPin, Send, Check, Sparkles } from 'lucide-react';
import { BusinessConfig } from '../types';
import { CHHATRAPATI_SAMBHAJI_NAGAR_AREAS } from '../data/initialData';
import { submitInquiryApi } from '../lib/storage';

interface ContactSectionProps {
  config: BusinessConfig;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ config }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('Birthday Surprise');
  const [area, setArea] = useState(CHHATRAPATI_SAMBHAJI_NAGAR_AREAS[0]);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date) {
      alert("Please provide your Name, Phone Number, and Date.");
      return;
    }

    setSubmitted(true);

    // Save inquiry to backend database asynchronously
    submitInquiryApi({
      name: name.trim(),
      phone: phone.trim(),
      occasion: eventType,
      date,
      area,
      notes: notes.trim()
    });

    // Build WhatsApp URL
    const text = `*Direct Surprise Booking Inquiry — Movement Craft*\n` +
      `👤 *Name:* ${name.trim()}\n` +
      `📞 *Phone:* ${phone.trim()}\n` +
      `✨ *Occasion:* ${eventType}\n` +
      `📅 *Date:* ${date}\n` +
      `📍 *Location:* ${area}\n` +
      (notes.trim() ? `📝 *Notes:* ${notes.trim()}\n` : '') +
      `\n_Inquiry for Founder Kuldeep Rajput (Movement Craft)_`;

    const waUrl = `https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-[#0A0A0A] border-b border-[#D4AF37]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Details & Brand Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1810] border border-[#D4AF37]/30 text-xs text-[#F5D77F] uppercase tracking-widest font-semibold">
              Get In Touch
            </div>
            
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white leading-tight">
              Let's Plan Your <br />
              <span className="text-gold-gradient">Unforgettable Moment</span>
            </h2>

            <p className="text-zinc-300 text-sm leading-relaxed">
              Every surprise has a story. Speak directly with Founder Kuldeep Rajput or submit your event brief below for immediate availability checks.
            </p>

            {/* Direct Contact Cards */}
            <div className="space-y-4 pt-2">
              
              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Kuldeep! I would like to plan a surprise event with Movement Craft.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#14120D] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">Instant WhatsApp</span>
                  <span className="text-base font-bold text-white">{config.whatsapp}</span>
                </div>
              </a>

              {/* Phone Call Card */}
              <a
                href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`}
                className="p-4 rounded-xl bg-[#14120D] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">Direct Call</span>
                  <span className="text-base font-bold text-white">{config.phone}</span>
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href="https://www.instagram.com/movementcraft.events/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#14120D] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 to-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">Official Instagram</span>
                  <span className="text-base font-bold text-white">{config.instagram}</span>
                </div>
              </a>

              {/* Location Card */}
              <div className="p-4 rounded-xl bg-[#14120D] border border-[#D4AF37]/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1E1A11] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">Operational City</span>
                  <span className="text-sm font-semibold text-white">{config.location}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Direct Quick Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#12110D] border border-[#D4AF37]/40 shadow-2xl gold-glow relative">
              
              <div className="mb-6 space-y-1">
                <h3 className="font-cinzel text-xl font-bold text-white">
                  Quick Surprise Booking Request
                </h3>
                <p className="text-xs text-zinc-400">
                  Submit details below to confirm date availability & lock your secret slot.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  <h4 className="font-cinzel text-xl font-bold text-white">Thank You, {name}!</h4>
                  <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                    Your inquiry has been logged. Founder Kuldeep Rajput will contact you shortly via WhatsApp.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs text-[#D4AF37] hover:underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amit Patil"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                        Surprise Category
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="Birthday Surprise">Birthday Surprise (Fire & Smoke Entry)</option>
                        <option value="Midnight Surprise">Midnight 12 AM Surprise</option>
                        <option value="Proposal Surprise">Proposal or Special Surprise</option>
                        <option value="Theatre Surprise">Private Theatre Big Screen Surprise</option>
                        <option value="Cafe Surprise">Cafe & Romantic Candlelight</option>
                        <option value="Anniversary Surprise">Anniversary Surprise</option>
                        <option value="Rose Surprise">Rose Surprise (Floral Cascade)</option>
                        <option value="Love Letter Surprise">Love Letter & Scroll Surprise</option>
                        <option value="Custom Surprise">Custom Dream Surprise</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                        Target Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Neighborhood in Chhatrapati Sambhaji Nagar
                    </label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                    >
                      {CHHATRAPATI_SAMBHAJI_NAGAR_AREAS.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Special Requests / Confidential Secrecy Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Target person name, specific timing, cake flavor preference, quiet entry instructions..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#AA820A] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all shadow-lg gold-glow cursor-pointer"
                  >
                    <Send className="w-4 h-4 fill-black" />
                    <span>Send Inquiry & Open WhatsApp</span>
                  </button>

                  <p className="text-[11px] text-zinc-400 text-center">
                    🔒 All submissions are 100% confidential. We never reveal surprise details to unauthorized contacts.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, MessageCircle, Calendar, Clock, MapPin, User, Phone, FileText } from 'lucide-react';
import { SurprisePackage, AddonItem, BusinessConfig, PackageInclusion } from '../types';
import { CHHATRAPATI_SAMBHAJI_NAGAR_AREAS } from '../data/initialData';
import { submitInquiryApi } from '../lib/storage';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: SurprisePackage[];
  addons: AddonItem[];
  config: BusinessConfig;
  preselectedPackage?: SurprisePackage | null;
  preselectedServiceName?: string | null;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  packages,
  addons,
  config,
  preselectedPackage,
  preselectedServiceName
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Midnight (11:30 PM - 12:30 AM)');
  const [locationArea, setLocationArea] = useState(CHHATRAPATI_SAMBHAJI_NAGAR_AREAS[0]);
  const [addressDetails, setAddressDetails] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Initialize preselection
  useEffect(() => {
    if (preselectedPackage) {
      setSelectedPackageId(preselectedPackage.id);
    } else if (packages.length > 0 && !selectedPackageId) {
      setSelectedPackageId(packages[0].id);
    }
  }, [preselectedPackage, packages]);

  if (!isOpen) return null;

  const currentPkg = packages.find(p => p.id === selectedPackageId);
  const basePrice = currentPkg ? currentPkg.startingPrice : 3000;
  const isCustomizable = currentPkg?.customizationEnabled !== false;

  // Use package-specific addons if available, otherwise global addons
  const availableAddons = (currentPkg?.addons && currentPkg.addons.length > 0)
    ? currentPkg.addons
    : addons;

  const selectedAddonsList = availableAddons.filter(a => selectedAddonIds.includes(a.id));
  const addonsTotal = selectedAddonsList.reduce((acc, a) => acc + a.price, 0);
  const grandTotal = basePrice + addonsTotal;

  const toggleAddon = (id: string) => {
    setSelectedAddonIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const formatInr = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleOpenWhatsApp = () => {
    const fullLocation = addressDetails.trim() 
      ? `${locationArea} (${addressDetails.trim()})`
      : locationArea;

    // Build WhatsApp pre-filled text
    let text = `*New Surprise Event Enquiry — Movement Craft*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (customerName.trim()) {
      text += `👤 *Client Name:* ${customerName.trim()}\n`;
    }
    if (phone.trim()) {
      text += `📞 *Phone:* ${phone.trim()}\n`;
    }
    text += `✨ *Package:* ${currentPkg ? currentPkg.title : (preselectedServiceName || "Custom Surprise")}\n`;
    if (date) {
      text += `📅 *Date:* ${date}\n`;
      text += `⏰ *Time Slot:* ${timeSlot}\n`;
    }
    text += `📍 *Area:* ${fullLocation}\n`;
    
    if (selectedAddonsList.length > 0) {
      text += `\n*Selected Special Add-Ons:*\n`;
      selectedAddonsList.forEach(addon => {
        text += `• ${addon.name} — ${formatInr(addon.price)}\n`;
      });
    }

    text += `\n💰 *Estimated Budget:* ${formatInr(grandTotal)}\n`;

    if (specialRequests.trim()) {
      text += `\n📝 *Notes:* ${specialRequests.trim()}\n`;
    }

    text += `\n_Enquiry for Founder Kuldeep Rajput (Movement Craft, Chhatrapati Sambhaji Nagar)_`;

    // Persist blueprint customization to backend database
    submitInquiryApi({
      name: customerName.trim(),
      phone: phone.trim(),
      occasion: 'Customizer Blueprint',
      packageTitle: currentPkg ? currentPkg.title : (preselectedServiceName || 'Custom Surprise'),
      date,
      timeSlot,
      area: locationArea,
      addressDetails: addressDetails.trim(),
      addons: selectedAddonsList.map(a => ({ id: a.id, name: a.name, price: a.price })),
      estimatedBudget: grandTotal,
      notes: specialRequests.trim()
    });

    const waUrl = `https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-[#0F0E0B] border border-[#D4AF37]/50 shadow-2xl gold-glow overflow-hidden text-white flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#17140D] to-[#221D12] border-b border-[#D4AF37]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-xl font-bold text-[#FFF3D1]">
                Custom Surprise Blueprint
              </h3>
              <p className="text-xs text-zinc-400">
                Tailor your event inclusions, location, and schedule for Chhatrapati Sambhaji Nagar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Form */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Step 1: Choose Package */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2">
              <span>1. Select Base Surprise Concept</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {packages.map(pkg => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                    selectedPackageId === pkg.id
                      ? 'bg-[#221D12] border-[#D4AF37] gold-glow-sm'
                      : 'bg-[#151410] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <p className="font-cinzel text-sm font-bold text-white">{pkg.title}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{pkg.subtitle}</p>
                  </div>
                  <span className="text-xs font-bold text-[#F5D77F] tabular-nums whitespace-nowrap ml-2">
                    {formatInr(pkg.startingPrice)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Inclusions summary for selected package */}
          {currentPkg && (
            <div className="p-4 rounded-xl bg-[#14120C] border border-[#D4AF37]/25 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[#D4AF37] uppercase tracking-wider">
                  Included in {currentPkg.title}:
                </p>
                {!isCustomizable && (
                  <span className="text-[10px] text-amber-300 font-semibold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-600/40">
                    Fixed Inclusions
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
                {currentPkg.inclusions.map((inc: PackageInclusion, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span>{inc.text} {inc.isOurSide && <span className="text-[#F5D77F] font-semibold">(Our Side)</span>}</span>
                  </div>
                ))}
              </div>
              {currentPkg.terms && (
                <p className="text-[11px] text-zinc-400 italic pt-1 border-t border-zinc-800">
                  Note: {currentPkg.terms}
                </p>
              )}
            </div>
          )}

          {/* Step 2: Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>2. Event Date (Optional)</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>3. Preferred Time Slot</span>
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="Midnight (11:30 PM - 12:30 AM)">Midnight (11:30 PM - 12:30 AM) ★ Top Pick</option>
                <option value="Sunset Special (05:00 PM - 07:00 PM)">Sunset Special (05:00 PM - 07:00 PM)</option>
                <option value="Evening Romantic (07:30 PM - 09:30 PM)">Evening Romantic (07:30 PM - 09:30 PM)</option>
                <option value="Afternoon Celebration (01:00 PM - 03:30 PM)">Afternoon Celebration (01:00 PM - 03:30 PM)</option>
                <option value="Custom Time Slot">Custom Time Slot</option>
              </select>
            </div>
          </div>

          {/* Step 3: Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>4. Area in Chhatrapati Sambhaji Nagar</span>
              </label>
              <select
                value={locationArea}
                onChange={(e) => setLocationArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              >
                {CHHATRAPATI_SAMBHAJI_NAGAR_AREAS.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Venue Name / Neighborhood Detail (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Near Prozone Mall / Home / Rooftop"
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Step 4: Special Add-Ons selection */}
          {isCustomizable && availableAddons.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                5. Add Special Enhancements
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableAddons.map(addon => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-[#221D12] border-[#D4AF37] text-white'
                          : 'bg-[#151410] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-zinc-600'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{addon.name}</p>
                          <p className="text-[10px] text-zinc-400 line-clamp-1">{addon.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#F5D77F] tabular-nums whitespace-nowrap ml-2">
                        +{formatInr(addon.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer contact fields for prefilling message */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Your Name (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>Your Contact Number (Optional)</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. +91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Confidential Requests or Notes (Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Keep confidential until doorbell rings, preferred cake flavor, special song request..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* Total Summary Footer */}
          <div className="p-4 rounded-xl bg-[#1D1910] border border-[#D4AF37]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-zinc-400">Estimated Total (Base + {selectedAddonIds.length} Add-ons):</p>
              <p className="text-2xl font-bold text-[#FFF3D1] font-sans tabular-nums">
                {formatInr(grandTotal)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all shadow-md gold-glow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Discuss on WhatsApp (+91 8793877192)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

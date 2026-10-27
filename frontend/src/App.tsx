import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PackagesSection } from './components/PackagesSection';
import { ServicesGrid } from './components/ServicesGrid';
import { AddonsSection } from './components/AddonsSection';
import { GallerySection } from './components/GallerySection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CustomizerModal } from './components/CustomizerModal';
import { BrochuresModal } from './components/BrochuresModal';
import { AdminPanel } from './components/AdminPanel';
import { loadInitialState, fetchPackagesApi, fetchConfigApi, fetchAddonsApi, fetchServicesApi } from './lib/storage';
import { SurprisePackage, BusinessConfig, SurpriseService, AddonItem } from './types';
import { MessageCircle, Sparkles } from 'lucide-react';

export function App() {
  const initialState = loadInitialState();
  const [config, setConfig] = useState<BusinessConfig>(initialState.config);
  const [packages, setPackages] = useState<SurprisePackage[]>(initialState.packages);
  const [services, setServices] = useState<SurpriseService[]>(initialState.services);
  const [addons, setAddons] = useState<AddonItem[]>(initialState.addons);

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isBrochuresOpen, setIsBrochuresOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedPackageForCustomizer, setSelectedPackageForCustomizer] = useState<SurprisePackage | null>(null);
  const [selectedServiceForCustomizer, setSelectedServiceForCustomizer] = useState<string | null>(null);

  // Live data fetch from server
  const refreshData = useCallback(async () => {
    try {
      const [fetchedPackages, fetchedConfig, fetchedAddons, fetchedServices] = await Promise.all([
        fetchPackagesApi(),
        fetchConfigApi(),
        fetchAddonsApi(),
        fetchServicesApi()
      ]);
      if (fetchedPackages && fetchedPackages.length > 0) {
        setPackages(fetchedPackages);
      }
      if (fetchedConfig && fetchedConfig.name) {
        setConfig(fetchedConfig);
      }
      if (fetchedAddons && fetchedAddons.length > 0) {
        setAddons(fetchedAddons);
      }
      if (fetchedServices && fetchedServices.length > 0) {
        setServices(fetchedServices);
      }
    } catch (e) {
      console.error('Failed to refresh data from server:', e);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleOpenCustomizerWithPackage = (pkg: SurprisePackage) => {
    setSelectedPackageForCustomizer(pkg);
    setSelectedServiceForCustomizer(null);
    setIsCustomizerOpen(true);
  };

  const handleOpenCustomizerWithService = (serviceName: string) => {
    const matched = packages.find(p => p.title.toLowerCase().includes(serviceName.toLowerCase()));
    setSelectedPackageForCustomizer(matched || null);
    setSelectedServiceForCustomizer(serviceName);
    setIsCustomizerOpen(true);
  };

  const handleOpenGeneralCustomizer = () => {
    setSelectedPackageForCustomizer(null);
    setSelectedServiceForCustomizer(null);
    setIsCustomizerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F3EFE0] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-white relative">
      
      {/* Top Navbar */}
      <Navbar
        config={config}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBrochures={() => setIsBrochuresOpen(true)}
        onOpenCustomizer={handleOpenGeneralCustomizer}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          config={config}
          onOpenCustomizer={handleOpenGeneralCustomizer}
          onOpenBrochures={() => setIsBrochuresOpen(true)}
        />

        {/* Packages Section (Curated Flagship Packages from Server) */}
        <PackagesSection
          packages={packages}
          config={config}
          onSelectPackageForCustomizing={handleOpenCustomizerWithPackage}
        />

        {/* Services Menu Grid (14+ categories from Reference 2) */}
        <ServicesGrid
          services={services}
          config={config}
          onOpenCustomizerForService={handleOpenCustomizerWithService}
        />

        {/* Addons Section */}
        <AddonsSection
          addons={addons}
          onOpenCustomizer={handleOpenGeneralCustomizer}
        />

        {/* Visual Gallery */}
        <GallerySection />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* FAQ Section */}
        <FaqSection />

        {/* Contact & Direct Booking WhatsApp Form */}
        <ContactSection config={config} />
      </main>

      {/* Footer */}
      <Footer
        config={config}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBrochures={() => setIsBrochuresOpen(true)}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Floating Customizer Button */}
        <button
          onClick={handleOpenGeneralCustomizer}
          className="pointer-events-auto px-4 py-2.5 rounded-full bg-[#1A1810] border border-[#D4AF37]/60 text-[#F5D77F] text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-2xl hover:scale-105 transition-all gold-glow-sm cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="hidden sm:inline">Build Custom Surprise</span>
          <span className="sm:hidden">Customizer</span>
        </button>

        {/* Floating WhatsApp Button */}
        <a
          href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Kuldeep! I would like to inquire about a surprise event in Chhatrapati Sambhaji Nagar.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all gold-glow group relative"
          title="Chat directly with Kuldeep Rajput on WhatsApp"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-white stroke-none" />
          <span className="absolute right-16 bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#D4AF37]/30 shadow-lg">
            Chat with Kuldeep
          </span>
        </a>
      </div>

      {/* Interactive Modals */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        packages={packages}
        addons={addons}
        config={config}
        preselectedPackage={selectedPackageForCustomizer}
        preselectedServiceName={selectedServiceForCustomizer}
      />

      <BrochuresModal
        isOpen={isBrochuresOpen}
        onClose={() => setIsBrochuresOpen(false)}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        packages={packages}
        onDataChanged={refreshData}
      />

    </div>
  );
}
export default App;

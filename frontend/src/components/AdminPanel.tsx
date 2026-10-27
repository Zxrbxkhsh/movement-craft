import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  LogOut,
  Package,
  Settings,
  CheckCircle2,
  Phone,
  MessageCircle,
  Trash2,
  Plus,
  Save,
  Check,
  AlertCircle,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  Sparkles
} from 'lucide-react';
import { BusinessConfig, SurprisePackage, PackageInclusion, AddonItem, InquiryItem } from '../types';
import {
  loginAdminApi,
  checkAdminAuthApi,
  logoutAdminApi,
  savePackageApi,
  deletePackageApi,
  uploadPackagePhotoApi,
  saveConfigApi,
  fetchInquiriesApi,
  updateInquiryStatusApi
} from '../lib/storage';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: BusinessConfig;
  packages: SurprisePackage[];
  onDataChanged: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  config,
  packages,
  onDataChanged
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'packages' | 'inquiries' | 'settings'>('packages');

  // Package editor state
  const [editingPackage, setEditingPackage] = useState<SurprisePackage | null>(null);
  const [isNewPackage, setIsNewPackage] = useState(false);
  const [packageSaveError, setPackageSaveError] = useState('');
  const [isSavingPackage, setIsSavingPackage] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Photo upload state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inclusions temporary input
  const [newInclusionText, setNewInclusionText] = useState('');
  const [newInclusionOurSide, setNewInclusionOurSide] = useState(false);

  // Add-on temporary input
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState<number>(500);
  const [newAddonDesc, setNewAddonDesc] = useState('');

  // Settings state
  const [editConfig, setEditConfig] = useState<BusinessConfig>(config);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const loadBackendData = async () => {
    try {
      setLoadingInquiries(true);
      const inq = await fetchInquiriesApi();
      setInquiries(inq);
      setLoadingInquiries(false);
    } catch (e) {
      console.warn('Failed to load inquiries in admin panel:', e);
      setLoadingInquiries(false);
    }
  };

  // Check auth on open
  useEffect(() => {
    if (isOpen) {
      setCheckingAuth(true);
      checkAdminAuthApi().then(authed => {
        setIsAuthenticated(authed);
        setCheckingAuth(false);
        if (authed) {
          loadBackendData();
        }
      });
      setEditConfig(config);
      setLoginError('');
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // AUTH HANDLERS
  // -------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setLoginError('Please enter your administrator password.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    const res = await loginAdminApi(password);
    setIsLoggingIn(false);

    if (res.success) {
      setIsAuthenticated(true);
      setPassword('');
      onDataChanged();
      loadBackendData();
    } else {
      setLoginError(res.error || 'Authentication failed. Invalid administrator credentials.');
    }
  };

  const handleLogout = async () => {
    await logoutAdminApi();
    setIsAuthenticated(false);
    setPassword('');
    setEditingPackage(null);
  };

  // -------------------------------------------------------------
  // PACKAGE MANAGEMENT HANDLERS
  // -------------------------------------------------------------
  const handleStartAddPackage = () => {
    if (packages.length >= 25) {
      alert("Package limit reached. Maximum 25 packages allowed.");
      return;
    }

    const newPkg: SurprisePackage = {
      id: 'pkg_' + Date.now().toString(36),
      title: '',
      subtitle: '',
      description: '',
      image: '/assets/movement_craft_packages.jpeg',
      badge: '',
      startingPrice: 2999,
      discountedPrice: undefined,
      inclusions: [
        { text: "Special Theme Decor" },
        { text: "Celebration Cake", isOurSide: true }
      ],
      addons: [],
      customizationEnabled: true,
      displayOrder: packages.length + 1,
      isPublished: true,
      popular: false,
      terms: ''
    };

    setEditingPackage(newPkg);
    setIsNewPackage(true);
    setPackageSaveError('');
    setUploadError('');
  };

  const handleStartEditPackage = (pkg: SurprisePackage) => {
    setEditingPackage({
      ...pkg,
      inclusions: Array.isArray(pkg.inclusions) ? [...pkg.inclusions] : [],
      addons: Array.isArray(pkg.addons) ? [...pkg.addons] : []
    });
    setIsNewPackage(false);
    setPackageSaveError('');
    setUploadError('');
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;

    if (!editingPackage.title.trim()) {
      setPackageSaveError("Package title is required.");
      return;
    }
    if (editingPackage.startingPrice <= 0) {
      setPackageSaveError("Please enter a valid starting price.");
      return;
    }

    setIsSavingPackage(true);
    setPackageSaveError('');

    const res = await savePackageApi(editingPackage, isNewPackage);
    setIsSavingPackage(false);

    if (res.success) {
      setEditingPackage(null);
      onDataChanged();
    } else {
      setPackageSaveError(res.error || "Failed to save package.");
    }
  };

  const handleDeletePackage = async (id: string) => {
    const res = await deletePackageApi(id);
    setDeleteConfirmId(null);
    if (res.success) {
      if (editingPackage?.id === id) {
        setEditingPackage(null);
      }
      onDataChanged();
    } else {
      alert(res.error || "Failed to delete package.");
    }
  };

  // Photo Upload Handler
  const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPackage) return;

    setIsUploadingPhoto(true);
    setUploadError('');

    const res = await uploadPackagePhotoApi(file);
    setIsUploadingPhoto(false);

    if (res.success && res.url) {
      setEditingPackage({
        ...editingPackage,
        image: res.url
      });
    } else {
      setUploadError(res.error || "Failed to upload photo.");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    if (!editingPackage) return;
    setEditingPackage({
      ...editingPackage,
      image: '/assets/movement_craft_packages.jpeg'
    });
  };

  // Inclusions Reordering & Management
  const handleAddInclusion = () => {
    if (!newInclusionText.trim() || !editingPackage) return;
    const updatedInclusions = [
      ...editingPackage.inclusions,
      { text: newInclusionText.trim(), isOurSide: newInclusionOurSide }
    ];
    setEditingPackage({ ...editingPackage, inclusions: updatedInclusions });
    setNewInclusionText('');
    setNewInclusionOurSide(false);
  };

  const handleRemoveInclusion = (index: number) => {
    if (!editingPackage) return;
    const updated = editingPackage.inclusions.filter((_, i) => i !== index);
    setEditingPackage({ ...editingPackage, inclusions: updated });
  };

  const handleMoveInclusion = (index: number, direction: 'up' | 'down') => {
    if (!editingPackage) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= editingPackage.inclusions.length) return;

    const items = [...editingPackage.inclusions];
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;
    setEditingPackage({ ...editingPackage, inclusions: items });
  };

  // Add-ons Reordering & Management
  const handleAddAddon = () => {
    if (!newAddonName.trim() || !editingPackage) return;
    const newAddon: AddonItem = {
      id: 'addon_' + Date.now().toString(36),
      name: newAddonName.trim(),
      price: Number(newAddonPrice) || 0,
      description: newAddonDesc.trim(),
      category: 'decor'
    };
    const updated = [...(editingPackage.addons || []), newAddon];
    setEditingPackage({ ...editingPackage, addons: updated });
    setNewAddonName('');
    setNewAddonPrice(500);
    setNewAddonDesc('');
  };

  const handleRemoveAddon = (index: number) => {
    if (!editingPackage || !editingPackage.addons) return;
    const updated = editingPackage.addons.filter((_, i) => i !== index);
    setEditingPackage({ ...editingPackage, addons: updated });
  };

  const handleMoveAddon = (index: number, direction: 'up' | 'down') => {
    if (!editingPackage || !editingPackage.addons) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= editingPackage.addons.length) return;

    const items = [...editingPackage.addons];
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;
    setEditingPackage({ ...editingPackage, addons: items });
  };

  // -------------------------------------------------------------
  // SETTINGS HANDLER
  // -------------------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsError('');
    setSettingsSuccess(false);

    const res = await saveConfigApi(editConfig);
    setIsSavingSettings(false);

    if (res.success) {
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
      onDataChanged();
    } else {
      setSettingsError(res.error || 'Failed to update settings.');
    }
  };

  const formatInr = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto rounded-2xl bg-[#0F0E0C] border border-[#D4AF37]/50 shadow-2xl gold-glow overflow-hidden text-white flex flex-col min-h-[580px] max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 bg-[#16140E] border-b border-[#D4AF37]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#FFF3D1]">
                Movement Craft Owner Portal
              </h3>
              <p className="text-xs text-zinc-400">
                Founder: {config.founder} · Chhatrapati Sambhaji Nagar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 hover:bg-red-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {checkingAuth ? (
          <div className="flex-1 flex items-center justify-center p-12 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37] mr-2" />
            <span>Verifying session...</span>
          </div>
        ) : !isAuthenticated ? (
          /* Secure Login Screen — No Demo/Quick Login */
          <div className="flex-1 p-6 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#1A1810] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto gold-glow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="font-cinzel text-2xl font-bold text-white">
                Admin Authentication
              </h4>
              <p className="text-xs text-zinc-400">
                Enter your authorized administrator password to manage packages, upload photos, and update website settings.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Administrator Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-center text-white tracking-widest focus:border-[#D4AF37] focus:outline-none pr-11"
                  autoFocus
                  disabled={isLoggingIn}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Access Admin Panel</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tab Navigation */}
            <div className="flex border-b border-[#D4AF37]/20 bg-[#14120D] overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab('packages');
                  setEditingPackage(null);
                }}
                className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === 'packages' ? 'border-b-2 border-[#D4AF37] text-[#F5D77F] bg-[#1E1B13]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Packages & Inclusions ({packages.length})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('inquiries');
                  setEditingPackage(null);
                }}
                className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === 'inquiries' ? 'border-b-2 border-[#D4AF37] text-[#F5D77F] bg-[#1E1B13]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Client Inquiries ({inquiries.length})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setEditingPackage(null);
                }}
                className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === 'settings' ? 'border-b-2 border-[#D4AF37] text-[#F5D77F] bg-[#1E1B13]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Website Settings</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              
              {/* TAB 1: COMPLETE PACKAGE MANAGEMENT */}
              {activeTab === 'packages' && (
                <div className="space-y-6">
                  {editingPackage ? (
                    /* PACKAGE EDITOR FORM */
                    <form onSubmit={handleSavePackage} className="p-6 rounded-xl bg-[#14120D] border border-[#D4AF37]/40 space-y-6">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                        <div>
                          <h4 className="font-cinzel text-xl font-bold text-[#FFF3D1]">
                            {isNewPackage ? 'Add New Surprise Package' : `Edit: ${editingPackage.title}`}
                          </h4>
                          <p className="text-xs text-zinc-400">
                            Configure inclusions, photographs, optional add-ons, pricing, and visibility.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingPackage(null)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      {packageSaveError && (
                        <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                          <span>{packageSaveError}</span>
                        </div>
                      )}

                      {/* Package Photo Management Section */}
                      <div className="p-4 rounded-xl bg-[#191712] border border-[#D4AF37]/30 space-y-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] block">
                          Package Photograph
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-[#D4AF37]/40 bg-black shrink-0">
                            <img
                              src={editingPackage.image || '/assets/movement_craft_packages.jpeg'}
                              alt="Package preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/assets/movement_craft_packages.jpeg';
                              }}
                            />
                            {isUploadingPhoto && (
                              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                onChange={handlePhotoSelected}
                                className="hidden"
                                id="photoFileInput"
                              />
                              <label
                                htmlFor="photoFileInput"
                                className="px-3.5 py-2 rounded-lg bg-[#221D12] hover:bg-[#2C2517] border border-[#D4AF37]/40 text-xs font-semibold text-[#F5D77F] flex items-center gap-2 cursor-pointer transition-all"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>{editingPackage.image ? 'Replace Photograph' : 'Upload Photograph'}</span>
                              </label>

                              {editingPackage.image && (
                                <button
                                  type="button"
                                  onClick={handleRemovePhoto}
                                  className="px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-800 text-xs text-red-300 transition-all cursor-pointer"
                                >
                                  Remove Photo
                                </button>
                              )}
                            </div>

                            <p className="text-[11px] text-zinc-400">
                              Upload from your phone or laptop. Supports JPG, PNG, WebP up to 10MB. Stored persistently on server.
                            </p>

                            {uploadError && (
                              <p className="text-xs text-red-400">{uploadError}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Basic Details: Title, Badge, Subtitle */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 block">Package Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Birthday Surprise"
                            value={editingPackage.title}
                            onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 block">Card Badge (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Most Popular"
                            value={editingPackage.badge || ''}
                            onChange={(e) => setEditingPackage({ ...editingPackage, badge: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Subtitle & Full Description */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300 block">Short Description / Subtitle</label>
                        <input
                          type="text"
                          placeholder="e.g. Glamorous entry & celebratory birthday atmosphere"
                          value={editingPackage.subtitle}
                          onChange={(e) => setEditingPackage({ ...editingPackage, subtitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300 block">Full Description</label>
                        <textarea
                          rows={3}
                          placeholder="Detailed description of what the customer experiences..."
                          value={editingPackage.description}
                          onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>

                      {/* Pricing: Starting Price & Discounted Price */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[#D4AF37] block">Base Price (₹ INR) *</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={editingPackage.startingPrice}
                            onChange={(e) => setEditingPackage({ ...editingPackage, startingPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 block">Discounted Price (₹ INR, Optional)</label>
                          <input
                            type="number"
                            min={0}
                            placeholder="Leave empty if regular"
                            value={editingPackage.discountedPrice || ''}
                            onChange={(e) => setEditingPackage({
                              ...editingPackage,
                              discountedPrice: e.target.value ? Number(e.target.value) : undefined
                            })}
                            className="w-full px-3 py-2 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 block">Display Order</label>
                          <input
                            type="number"
                            value={editingPackage.displayOrder || 1}
                            onChange={(e) => setEditingPackage({ ...editingPackage, displayOrder: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white font-mono"
                          />
                        </div>
                      </div>

                      {/* Toggles: Published, Customization, Popular */}
                      <div className="p-4 rounded-xl bg-[#191712] border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingPackage.isPublished !== false}
                            onChange={(e) => setEditingPackage({ ...editingPackage, isPublished: e.target.checked })}
                            className="w-4 h-4 accent-[#D4AF37]"
                          />
                          <span className="text-xs font-semibold text-white">Published on Website</span>
                        </label>

                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingPackage.customizationEnabled !== false}
                            onChange={(e) => setEditingPackage({ ...editingPackage, customizationEnabled: e.target.checked })}
                            className="w-4 h-4 accent-[#D4AF37]"
                          />
                          <span className="text-xs font-semibold text-white">Customization Enabled</span>
                        </label>

                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editingPackage.popular)}
                            onChange={(e) => setEditingPackage({ ...editingPackage, popular: e.target.checked })}
                            className="w-4 h-4 accent-[#D4AF37]"
                          />
                          <span className="text-xs font-semibold text-white">Highlight as Popular</span>
                        </label>
                      </div>

                      {/* Package Inclusions Manager */}
                      <div className="space-y-3 pt-2 border-t border-zinc-800">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                            Package Inclusions ({editingPackage.inclusions.length})
                          </label>
                          <span className="text-[11px] text-zinc-400">Reorder with Up / Down arrows</span>
                        </div>

                        {/* List of current inclusions */}
                        <div className="space-y-2">
                          {editingPackage.inclusions.map((inc, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-[#191712] border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-zinc-500 font-mono w-4">{idx + 1}.</span>
                                <span className="text-white">{inc.text}</span>
                                {inc.isOurSide && (
                                  <span className="px-1.5 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D77F] text-[10px] font-semibold">
                                    Our Side
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleMoveInclusion(idx, 'up')}
                                  disabled={idx === 0}
                                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveInclusion(idx, 'down')}
                                  disabled={idx === editingPackage.inclusions.length - 1}
                                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveInclusion(idx)}
                                  className="p-1 rounded bg-red-950/40 text-red-300 hover:bg-red-900/60 ml-1"
                                  title="Remove Inclusion"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add new inclusion input row */}
                        <div className="p-3 rounded-lg bg-[#1E1B13] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center gap-3">
                          <input
                            type="text"
                            placeholder="New inclusion name (e.g. Smoke Entry, Celebration Cake...)"
                            value={newInclusionText}
                            onChange={(e) => setNewInclusionText(e.target.value)}
                            className="flex-1 px-3 py-2 rounded bg-[#151410] border border-zinc-700 text-xs text-white focus:outline-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddInclusion();
                              }
                            }}
                          />
                          <label className="flex items-center gap-2 text-xs text-[#F5D77F] shrink-0 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newInclusionOurSide}
                              onChange={(e) => setNewInclusionOurSide(e.target.checked)}
                              className="accent-[#D4AF37]"
                            />
                            <span>Tag as (Our Side)</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleAddInclusion}
                            className="px-4 py-2 rounded bg-[#D4AF37] hover:bg-[#F5D77F] text-black font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Package Add-ons Manager */}
                      <div className="space-y-3 pt-2 border-t border-zinc-800">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                            Package-Specific Add-Ons ({editingPackage.addons?.length || 0})
                          </label>
                          <span className="text-[11px] text-zinc-400">Optional custom extras for this package</span>
                        </div>

                        {/* List of current add-ons */}
                        {editingPackage.addons && editingPackage.addons.length > 0 && (
                          <div className="space-y-2">
                            {editingPackage.addons.map((ad, idx) => (
                              <div
                                key={ad.id || idx}
                                className="p-3 rounded-lg bg-[#191712] border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="flex-1">
                                  <p className="font-semibold text-white">{ad.name}</p>
                                  {ad.description && <p className="text-[10px] text-zinc-400">{ad.description}</p>}
                                </div>
                                <span className="font-bold text-[#F5D77F] tabular-nums">+{formatInr(ad.price)}</span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveAddon(idx, 'up')}
                                    disabled={idx === 0}
                                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveAddon(idx, 'down')}
                                    disabled={idx === (editingPackage.addons?.length || 1) - 1}
                                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveAddon(idx)}
                                    className="p-1 rounded bg-red-950/40 text-red-300 hover:bg-red-900/60 ml-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add add-on input row */}
                        <div className="p-3 rounded-lg bg-[#1E1B13] border border-[#D4AF37]/30 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                          <input
                            type="text"
                            placeholder="Add-on item name..."
                            value={newAddonName}
                            onChange={(e) => setNewAddonName(e.target.value)}
                            className="sm:col-span-5 px-3 py-2 rounded bg-[#151410] border border-zinc-700 text-xs text-white"
                          />
                          <input
                            type="number"
                            min={0}
                            placeholder="Price"
                            value={newAddonPrice}
                            onChange={(e) => setNewAddonPrice(Number(e.target.value))}
                            className="sm:col-span-2 px-3 py-2 rounded bg-[#151410] border border-zinc-700 text-xs text-white font-mono"
                          />
                          <input
                            type="text"
                            placeholder="Brief description (optional)..."
                            value={newAddonDesc}
                            onChange={(e) => setNewAddonDesc(e.target.value)}
                            className="sm:col-span-3 px-3 py-2 rounded bg-[#151410] border border-zinc-700 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={handleAddAddon}
                            className="sm:col-span-2 px-3 py-2 rounded bg-[#D4AF37] hover:bg-[#F5D77F] text-black font-bold text-xs uppercase tracking-wider cursor-pointer text-center"
                          >
                            Add Extra
                          </button>
                        </div>
                      </div>

                      {/* Terms and Notes */}
                      <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                        <label className="text-xs font-semibold text-zinc-300 block">Terms & Special Notes</label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Booking must be confirmed 24 hours prior. Exact setup slot confirmed with owner."
                          value={editingPackage.terms || ''}
                          onChange={(e) => setEditingPackage({ ...editingPackage, terms: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#191712] border border-zinc-700 text-sm text-white focus:outline-none"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                        <button
                          type="submit"
                          disabled={isSavingPackage}
                          className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-98 shadow-md cursor-pointer"
                        >
                          {isSavingPackage ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-black" />
                              <span>Saving to Server...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 fill-black" />
                              <span>Save & Publish Live</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingPackage(null)}
                          className="px-4 py-3 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                    </form>
                  ) : (
                    /* PACKAGES LIST VIEW */
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800">
                        <div>
                          <h4 className="font-cinzel text-lg font-bold text-white">
                            Current Packages ({packages.length}/25)
                          </h4>
                          <p className="text-xs text-zinc-400">
                            Add, edit, reorder, or upload photos. Live changes reflect immediately on the website.
                          </p>
                        </div>

                        <button
                          onClick={handleStartAddPackage}
                          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shadow-md cursor-pointer"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>Add New Package</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {packages.map((pkg, idx) => (
                          <div
                            key={pkg.id}
                            className={`p-4 rounded-xl bg-[#14120D] border transition-all flex flex-col justify-between gap-4 ${
                              pkg.isPublished === false ? 'opacity-60 border-zinc-800' : 'border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#D4AF37]/30 bg-black shrink-0 relative">
                                <img
                                  src={pkg.image || '/assets/movement_craft_packages.jpeg'}
                                  alt={pkg.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/assets/movement_craft_packages.jpeg';
                                  }}
                                />
                                {pkg.isPublished === false && (
                                  <span className="absolute inset-0 bg-black/70 flex items-center justify-center text-[9px] uppercase font-bold text-zinc-300">
                                    Hidden
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="font-cinzel text-base font-bold text-white">{pkg.title}</h5>
                                  {pkg.badge && (
                                    <span className="px-1.5 py-0.2 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D77F] text-[10px] font-semibold">
                                      {pkg.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-[#FFF3D1] font-mono tabular-nums">
                                    {formatInr(pkg.startingPrice)}
                                  </span>
                                  {pkg.discountedPrice && (
                                    <span className="text-xs text-zinc-500 line-through tabular-nums">
                                      {formatInr(pkg.discountedPrice)}
                                    </span>
                                  )}
                                  <span className="text-zinc-600 text-xs">·</span>
                                  <span className="text-xs text-zinc-400">Order: #{pkg.displayOrder || idx + 1}</span>
                                </div>
                                <p className="text-xs text-zinc-400 line-clamp-2">{pkg.description}</p>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                              <span className="text-[11px] text-zinc-500">
                                {pkg.inclusions?.length || 0} inclusions · {pkg.addons?.length || 0} extras
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleStartEditPackage(pkg)}
                                  className="px-3 py-1.5 rounded-lg bg-[#221D12] border border-[#D4AF37]/40 text-[#F5D77F] text-xs font-semibold hover:bg-[#2A2315] cursor-pointer"
                                >
                                  Edit Package
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(pkg.id)}
                                  className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                                  title="Delete Package"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: WEBSITE SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                  {settingsSuccess && (
                    <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Website settings updated and saved to server!</span>
                    </div>
                  )}

                  {settingsError && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{settingsError}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-cinzel text-base font-bold text-[#FFF3D1] border-b border-zinc-800 pb-2">
                      Official Contact Numbers & Handles
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#D4AF37] block mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={editConfig.phone}
                          onChange={(e) => setEditConfig({ ...editConfig, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#1D1B14] border border-zinc-700 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#D4AF37] block mb-1">WhatsApp Number</label>
                        <input
                          type="text"
                          value={editConfig.whatsapp}
                          onChange={(e) => setEditConfig({ ...editConfig, whatsapp: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#1D1B14] border border-zinc-700 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#D4AF37] block mb-1">Instagram Handle</label>
                        <input
                          type="text"
                          value={editConfig.instagram}
                          onChange={(e) => setEditConfig({ ...editConfig, instagram: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#1D1B14] border border-zinc-700 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#D4AF37] block mb-1">Founder Display Name</label>
                        <input
                          type="text"
                          value={editConfig.founder}
                          onChange={(e) => setEditConfig({ ...editConfig, founder: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#1D1B14] border border-zinc-700 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#D4AF37] block mb-1">Tagline</label>
                      <input
                        type="text"
                        value={editConfig.tagline}
                        onChange={(e) => setEditConfig({ ...editConfig, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1D1B14] border border-zinc-700 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-zinc-800">
                    <h4 className="font-cinzel text-base font-bold text-[#FFF3D1]">
                      Top Announcement Ribbon
                    </h4>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="announcementToggle"
                        checked={editConfig.announcement?.enabled || false}
                        onChange={(e) => setEditConfig({
                          ...editConfig,
                          announcement: {
                            text: editConfig.announcement?.text || '',
                            enabled: e.target.checked
                          }
                        })}
                        className="w-4 h-4 accent-[#D4AF37]"
                      />
                      <label htmlFor="announcementToggle" className="text-xs text-white cursor-pointer">
                        Show top notification banner on website
                      </label>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#D4AF37] block mb-1">Banner Announcement Text</label>
                      <input
                        type="text"
                        value={editConfig.announcement?.text || ''}
                        onChange={(e) => setEditConfig({
                          ...editConfig,
                          announcement: {
                            enabled: editConfig.announcement?.enabled || false,
                            text: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 rounded bg-[#1D1B14] border border-zinc-700 text-sm text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4 fill-black" />
                    <span>{isSavingSettings ? 'Saving...' : 'Save All Settings'}</span>
                  </button>
                </form>
              )}

              {/* TAB 2: CLIENT INQUIRIES & LEAD MANAGEMENT */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6 max-w-4xl">
                  {/* Client Inquiries Log */}
                  <div className="p-5 rounded-xl bg-[#14120D] border border-zinc-800 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-cinzel text-base font-bold text-[#FFF3D1] flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                          <span>Client Inquiries & Bookings ({inquiries.length})</span>
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Direct inquiries submitted from the Contact Section and Interactive Blueprint Customizer
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          setLoadingInquiries(true);
                          const inq = await fetchInquiriesApi();
                          setInquiries(inq);
                          setLoadingInquiries(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#252219] border border-[#D4AF37]/40 text-xs text-[#F5D77F] hover:bg-[#302B20] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        {loadingInquiries ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" /> : null}
                        <span>{loadingInquiries ? 'Refreshing...' : 'Reload Inquiries'}</span>
                      </button>
                    </div>

                    {inquiries.length === 0 ? (
                      <div className="p-8 text-center text-xs text-zinc-500 rounded-lg bg-black/30 border border-dashed border-zinc-800">
                        No customer inquiries received yet. When clients fill out the contact or customizer form, incoming inquiries appear here with live status updates.
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[60vh] overflow-y-auto">
                        {inquiries.map((inq) => (
                          <div
                            key={inq._id || Math.random()}
                            className="p-3.5 rounded-lg bg-black/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#FFF3D1]">{inq.name}</span>
                                <span className="text-zinc-400">·</span>
                                <span className="text-[#D4AF37]">{inq.phone}</span>
                                {inq.packageTitle && (
                                  <span className="px-2 py-0.5 rounded bg-[#252219] text-[#F5D77F] text-[10px]">
                                    {inq.packageTitle}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-zinc-400 flex flex-wrap gap-2">
                                {inq.date && <span>📅 {inq.date}</span>}
                                {inq.area && <span>📍 {inq.area}</span>}
                                {inq.estimatedBudget ? (
                                  <span className="text-emerald-400 font-semibold">
                                    Budget: ₹{inq.estimatedBudget.toLocaleString('en-IN')}
                                  </span>
                                ) : null}
                              </div>
                              {inq.notes && (
                                <p className="text-[11px] text-zinc-400 italic">"{inq.notes}"</p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={inq.status || 'new'}
                                onChange={async (e) => {
                                  if (inq._id) {
                                    await updateInquiryStatusApi(inq._id, e.target.value);
                                    const refreshed = await fetchInquiriesApi();
                                    setInquiries(refreshed);
                                  }
                                }}
                                className="px-2 py-1 rounded bg-[#1A1812] border border-[#D4AF37]/30 text-white text-xs cursor-pointer focus:outline-none"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="p-6 rounded-2xl bg-[#16140E] border border-red-800 max-w-sm w-full space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-cinzel text-lg font-bold text-white">Delete Package?</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Are you sure you want to delete this package? This action will remove it from the public website.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleDeletePackage(deleteConfirmId)}
                  className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold text-xs cursor-pointer"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

import { SurprisePackage, BusinessConfig, AddonItem, SurpriseService, InquiryItem, DbStatus } from '../types';
import { INITIAL_PACKAGES, INITIAL_CONFIG, INITIAL_ADDONS, INITIAL_SERVICES } from '../data/initialData';

const TOKEN_KEY = 'mc_admin_session_token';
const LOCAL_PACKAGES_KEY = 'mc_packages_cache_v2';
const LOCAL_CONFIG_KEY = 'mc_config_cache_v2';

export function getStoredAdminToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setStoredAdminToken(token: string | null): void {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

// -------------------------------------------------------------
// ADMIN AUTHENTICATION
// -------------------------------------------------------------
export async function loginAdminApi(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      setStoredAdminToken(null);
      return { success: false, error: data.error || 'Authentication failed. Invalid administrator credentials.' };
    }

    setStoredAdminToken(data.token);
    return { success: true };
  } catch (err: any) {
    console.error('Server login request failed:', err);
    return { success: false, error: 'Could not connect to authentication server. Please check your network.' };
  }
}

export async function checkAdminAuthApi(): Promise<boolean> {
  const token = getStoredAdminToken();
  if (!token) return false;

  try {
    const res = await fetch('/api/admin/check', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      setStoredAdminToken(null);
      return false;
    }
    const data = await res.json();
    if (!data.authenticated) {
      setStoredAdminToken(null);
      return false;
    }
    return true;
  } catch (e) {
    return Boolean(token);
  }
}

export async function logoutAdminApi(): Promise<void> {
  const token = getStoredAdminToken();
  if (token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {
      // ignore
    }
  }
  setStoredAdminToken(null);
}

// -------------------------------------------------------------
// PACKAGE DATA RETRIEVAL & PERSISTENCE
// -------------------------------------------------------------
export async function fetchPackagesApi(): Promise<SurprisePackage[]> {
  const token = getStoredAdminToken();
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch('/api/packages', { headers });
    if (res.ok) {
      const data: SurprisePackage[] = await res.json();
      localStorage.setItem(LOCAL_PACKAGES_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Backend /api/packages unreachable, checking local fallback cache', err);
  }

  // Fallback to local storage cache or initial data
  const cached = localStorage.getItem(LOCAL_PACKAGES_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // ignore
    }
  }
  return INITIAL_PACKAGES;
}

export async function savePackageApi(pkg: SurprisePackage, isNew: boolean): Promise<{ success: boolean; package?: SurprisePackage; error?: string }> {
  const token = getStoredAdminToken();
  if (!token) {
    return { success: false, error: 'Unauthorized: Please log in as an administrator to save packages.' };
  }

  try {
    const url = isNew ? '/api/packages' : `/api/packages/${pkg.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(pkg)
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to save package.' };
    }

    return { success: true, package: data };
  } catch (err: any) {
    console.error('Error saving package:', err);
    return { success: false, error: 'Network error: Failed to save package to server.' };
  }
}

export async function deletePackageApi(id: string): Promise<{ success: boolean; error?: string }> {
  const token = getStoredAdminToken();
  if (!token) {
    return { success: false, error: 'Unauthorized: Administrator authentication required.' };
  }

  try {
    const res = await fetch(`/api/packages/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to delete package.' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error deleting package:', err);
    return { success: false, error: 'Network error: Failed to delete package on server.' };
  }
}

// -------------------------------------------------------------
// PERSISTENT PHOTO UPLOAD
// -------------------------------------------------------------
export async function uploadPackagePhotoApi(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  const token = getStoredAdminToken();
  if (!token) {
    return { success: false, error: 'Unauthorized: Please log in as administrator to upload photos.' };
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or AVIF image.' };
  }

  // Validate size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: 'File is too large. Maximum image size is 10MB.' };
  }

  try {
    // Convert file to base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        imageBase64: base64Data,
        filename: file.name,
        mimeType: file.type
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to upload photo to server.' };
    }

    return { success: true, url: data.url };
  } catch (err: any) {
    console.error('Upload error:', err);
    return { success: false, error: 'Network error while uploading photo.' };
  }
}

// -------------------------------------------------------------
// WEBSITE CONFIG
// -------------------------------------------------------------
export async function fetchConfigApi(): Promise<BusinessConfig> {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      if (data && data.name) {
        localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {
    // ignore
  }

  const cached = localStorage.getItem(LOCAL_CONFIG_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }
  return INITIAL_CONFIG;
}

export async function saveConfigApi(config: BusinessConfig): Promise<{ success: boolean; error?: string }> {
  const token = getStoredAdminToken();
  if (!token) {
    return { success: false, error: 'Unauthorized: Admin authentication required.' };
  }

  try {
    const res = await fetch('/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(config)
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to update config.' };
    }
    localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(config));
    return { success: true };
  } catch (e: any) {
    return { success: false, error: 'Failed to update configuration on server.' };
  }
}

// -------------------------------------------------------------
// CLIENT INQUIRIES & BOOKINGS
// -------------------------------------------------------------
export async function submitInquiryApi(inquiry: Partial<InquiryItem>): Promise<{ success: boolean; error?: string; inquiryId?: string }> {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to submit booking inquiry.' };
    }
    return { success: true, inquiryId: data.inquiryId };
  } catch (e: any) {
    console.error('Error submitting inquiry to server:', e);
    // WhatsApp direct communication is the primary bridge; keep experience uninterrupted
    return { success: true };
  }
}

export async function fetchInquiriesApi(): Promise<InquiryItem[]> {
  const token = getStoredAdminToken();
  if (!token) return [];

  try {
    const res = await fetch('/api/inquiries', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to fetch inquiries:', e);
  }
  return [];
}

export async function updateInquiryStatusApi(id: string, status: string): Promise<{ success: boolean; error?: string }> {
  const token = getStoredAdminToken();
  if (!token) return { success: false, error: 'Unauthorized.' };

  try {
    const res = await fetch(`/api/inquiries/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    return { success: data.success, error: data.error };
  } catch (e: any) {
    return { success: false, error: 'Failed to update inquiry status.' };
  }
}

// -------------------------------------------------------------
// ADDONS & SERVICES
// -------------------------------------------------------------
export async function fetchAddonsApi(): Promise<AddonItem[]> {
  try {
    const res = await fetch('/api/addons');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.warn('Backend /api/addons unreachable, using fallback addons:', e);
  }
  return INITIAL_ADDONS;
}

export async function fetchServicesApi(): Promise<SurpriseService[]> {
  try {
    const res = await fetch('/api/services');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.warn('Backend /api/services unreachable, using fallback services:', e);
  }
  return INITIAL_SERVICES;
}

// -------------------------------------------------------------
// BACKEND HEALTH & DATABASE STATUS
// -------------------------------------------------------------
export async function fetchStatusApi(): Promise<{
  success: boolean;
  status: string;
  database: DbStatus;
  metrics: { packagesCount: number; inquiriesCount: number };
  serverTime: string;
} | null> {
  try {
    const res = await fetch('/api/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Backend /api/status unreachable:', e);
  }
  return null;
}

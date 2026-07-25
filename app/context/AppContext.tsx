'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Contact, ConnectionStatus, Campaign, LogEntry, AppSettings, MediaAttachment } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface AppContextType {
  status: ConnectionStatus;
  contacts: Contact[];
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  logs: LogEntry[];
  settings: AppSettings;
  activeTab: string;
  theme: 'dark' | 'light';
  isQrModalOpen: boolean;
  setIsQrModalOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  
  // Actions
  connectWhatsApp: (phoneNumber?: string, authMode?: 'qr' | 'code') => Promise<void>;
  requestPairingCode: (phoneNumber: string) => Promise<string | null>;
  disconnectWhatsApp: () => Promise<void>;
  reconnectWhatsApp: (phoneNumber?: string, authMode?: 'qr' | 'code') => Promise<void>;
  uploadContactsFile: (file: File, replaceMode?: boolean) => Promise<{ success: boolean; stats?: any; error?: string }>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  bulkDeleteContacts: (ids: string[]) => Promise<void>;
  toggleSelectContact: (id: string) => void;
  toggleSelectAllContacts: (selected: boolean) => void;
  clearContacts: () => Promise<void>;
  
  startCampaign: (config: {
    name: string;
    messageTemplate: string;
    minDelay: number;
    maxDelay: number;
    media?: MediaAttachment | null;
    targetContactIds?: string[];
  }) => Promise<void>;
  pauseCampaign: (id: string) => Promise<void>;
  resumeCampaign: (id: string) => Promise<void>;
  cancelCampaign: (id: string) => Promise<void>;
  retryFailedCampaign: (id: string) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  clearLogs: () => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
}

const defaultConnectionStatus: ConnectionStatus = {
  connected: false,
  authenticated: false,
  qrCodeUrl: null,
  targetPhoneNumber: null,
  user: null,
  battery: null,
  device: null,
  connectedSince: null,
  lastError: null
};

const defaultSettings: AppSettings = {
  defaultMinDelay: 2,
  defaultMaxDelay: 5,
  autoRetry: true,
  notificationSound: true,
  desktopNotifications: true,
  theme: 'dark'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>(defaultConnectionStatus);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const socketInstance = io(API_BASE, {
      transports: ['websocket', 'polling']
    });

    setSocket(socketInstance);

    socketInstance.on('connection_status', (data: ConnectionStatus) => {
      setStatus(data);
      if (data.connected) {
        setIsQrModalOpen(false);
      }
    });

    socketInstance.on('campaign_update', (campaign: Campaign) => {
      setActiveCampaign(campaign);
      setCampaigns(prev => {
        const idx = prev.findIndex(c => c.id === campaign.id);
        if (idx !== -1) {
          const newArr = [...prev];
          newArr[idx] = campaign;
          return newArr;
        }
        return [campaign, ...prev];
      });
    });

    fetchInitialData();

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const [resStatus, resContacts, resCampaigns, resLogs, resSettings] = await Promise.all([
        fetch(`${API_BASE}/api/status`).then(r => r.json()),
        fetch(`${API_BASE}/api/contacts`).then(r => r.json()),
        fetch(`${API_BASE}/api/campaigns`).then(r => r.json()),
        fetch(`${API_BASE}/api/logs`).then(r => r.json()),
        fetch(`${API_BASE}/api/settings`).then(r => r.json())
      ]);

      if (resStatus) setStatus(resStatus);
      if (Array.isArray(resContacts)) setContacts(resContacts);
      if (Array.isArray(resCampaigns)) setCampaigns(resCampaigns);
      if (Array.isArray(resLogs)) setLogs(resLogs);
      if (resSettings) setSettings(resSettings);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    if (typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const toggleTheme = () => {
    const target = theme === 'dark' ? 'light' : 'dark';
    setTheme(target);
  };

  // WhatsApp Auth Actions
  const connectWhatsApp = async (phoneNumber?: string, authMode: 'qr' | 'code' = 'qr') => {
    const targetNumber = typeof phoneNumber === 'string' ? phoneNumber : undefined;
    setIsQrModalOpen(true);
    await fetch(`${API_BASE}/api/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: targetNumber, authMode })
    });
  };

  const requestPairingCode = async (phoneNumber: string): Promise<string | null> => {
    setIsQrModalOpen(true);
    try {
      const res = await fetch(`${API_BASE}/api/pairing-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      const data = await res.json();
      return data.pairingCode || null;
    } catch (e) {
      console.error('Error requesting pairing code:', e);
      return null;
    }
  };

  const disconnectWhatsApp = async () => {
    await fetch(`${API_BASE}/api/disconnect`, { method: 'POST' });
    setStatus(defaultConnectionStatus);
  };

  const reconnectWhatsApp = async (phoneNumber?: string, authMode: 'qr' | 'code' = 'qr') => {
    const targetNumber = typeof phoneNumber === 'string' ? phoneNumber : undefined;
    setIsQrModalOpen(true);
    await fetch(`${API_BASE}/api/reconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: targetNumber, authMode })
    });
  };

  // Excel Contact Upload
  const uploadContactsFile = async (file: File, replaceMode = false) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/upload-contacts?mode=${replaceMode ? 'replace' : 'append'}`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setContacts(data.contacts || []);
        fetchLogs();
        return { success: true, stats: data.stats };
      } else {
        return { success: false, error: data.error || 'Failed to parse file' };
      }
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error during upload' };
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/logs`);
      const data = await res.json();
      if (Array.isArray(data)) setLogs(data);
    } catch (e) {}
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    const res = await fetch(`${API_BASE}/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const updated = await res.json();
      setContacts(prev => prev.map(c => (c.id === id ? updated : c)));
    }
  };

  const deleteContact = async (id: string) => {
    await fetch(`${API_BASE}/api/contacts/${id}`, { method: 'DELETE' });
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const bulkDeleteContacts = async (ids: string[]) => {
    await fetch(`${API_BASE}/api/contacts/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    const setIds = new Set(ids);
    setContacts(prev => prev.filter(c => !setIds.has(c.id)));
  };

  const toggleSelectContact = (id: string) => {
    setContacts(prev => prev.map(c => (c.id === id ? { ...c, selected: !c.selected } : c)));
  };

  const toggleSelectAllContacts = (selected: boolean) => {
    setContacts(prev => prev.map(c => (c.status === 'valid' ? { ...c, selected } : c)));
  };

  const clearContacts = async () => {
    await fetch(`${API_BASE}/api/contacts`, { method: 'DELETE' });
    setContacts([]);
  };

  // Campaign Actions
  const startCampaign = async (config: {
    name: string;
    messageTemplate: string;
    minDelay: number;
    maxDelay: number;
    media?: MediaAttachment | null;
    targetContactIds?: string[];
  }) => {
    const res = await fetch(`${API_BASE}/api/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (res.ok) {
      const newCampaign = await res.json();
      setActiveCampaign(newCampaign);
      setCampaigns(prev => [newCampaign, ...prev]);
    } else {
      const err = await res.json();
      throw new Error(err?.error || 'Failed to start campaign');
    }
  };

  const pauseCampaign = async (id: string) => {
    await fetch(`${API_BASE}/api/campaigns/${id}/pause`, { method: 'POST' });
  };

  const resumeCampaign = async (id: string) => {
    await fetch(`${API_BASE}/api/campaigns/${id}/resume`, { method: 'POST' });
  };

  const cancelCampaign = async (id: string) => {
    await fetch(`${API_BASE}/api/campaigns/${id}/cancel`, { method: 'POST' });
  };

  const retryFailedCampaign = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/campaigns/${id}/retry`, { method: 'POST' });
    if (res.ok) {
      const updated = await res.json();
      setActiveCampaign(updated);
    }
  };

  const deleteCampaign = async (id: string) => {
    await fetch(`${API_BASE}/api/campaigns/${id}`, { method: 'DELETE' });
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const clearLogs = async () => {
    await fetch(`${API_BASE}/api/logs`, { method: 'DELETE' });
    setLogs([]);
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const res = await fetch(`${API_BASE}/api/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    if (res.ok) {
      const updated = await res.json();
      setSettings(updated);
    }
  };

  return (
    <AppContext.Provider
      value={{
        status,
        contacts,
        campaigns,
        activeCampaign,
        logs,
        settings,
        activeTab,
        theme,
        isQrModalOpen,
        setIsQrModalOpen,
        setActiveTab,
        setTheme,
        toggleTheme,
        connectWhatsApp,
        requestPairingCode,
        disconnectWhatsApp,
        reconnectWhatsApp,
        uploadContactsFile,
        updateContact,
        deleteContact,
        bulkDeleteContacts,
        toggleSelectContact,
        toggleSelectAllContacts,
        clearContacts,
        startCampaign,
        pauseCampaign,
        resumeCampaign,
        cancelCampaign,
        retryFailedCampaign,
        deleteCampaign,
        clearLogs,
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

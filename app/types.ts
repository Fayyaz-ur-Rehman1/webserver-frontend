export interface Contact {
  id: string;
  name: string;
  phone: string;
  originalPhone: string;
  country?: string;
  status: 'valid' | 'invalid';
  validationReason?: string;
  selected?: boolean;
}

export interface MediaAttachment {
  filename: string;
  mimetype: string;
  data: string; // base64
  caption?: string;
}

export interface CampaignStatusItem {
  contactId: string;
  name: string;
  phone: string;
  status: 'pending' | 'sent' | 'failed';
  error?: string;
  sentAt?: string;
}

export interface Campaign {
  id: string;
  name: string;
  messageTemplate: string;
  createdAt: string;
  updatedAt: string;
  minDelay: number;
  maxDelay: number;
  media?: MediaAttachment | null;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'cancelled';
  totalContacts: number;
  sentCount: number;
  failedCount: number;
  pendingCount: number;
  durationSeconds: number;
  contactStatuses: CampaignStatusItem[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  category?: 'connection' | 'import' | 'campaign' | 'system';
}

export interface ConnectionStatus {
  connected: boolean;
  authenticated: boolean;
  qrCodeUrl: string | null;
  pairingCode?: string | null;
  authMode?: 'qr' | 'code' | null;
  targetPhoneNumber?: string | null;
  user: {
    id?: string;
    pushname?: string;
    phone?: string;
    avatarUrl?: string | null;
  } | null;
  battery?: {
    level?: number;
    plugged?: boolean;
  } | null;
  device?: {
    platform?: string;
  } | null;
  connectedSince?: string | null;
  lastError?: string | null;
}

export interface AppSettings {
  defaultMinDelay: number;
  defaultMaxDelay: number;
  autoRetry: boolean;
  notificationSound: boolean;
  desktopNotifications: boolean;
  theme: 'dark' | 'light';
}

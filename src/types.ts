export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: 'Instagram' | 'Google' | 'Website' | 'Walk-in' | 'Referral';
  projectType: string;
  budget: number;
  timeline: string;
  status: 'Urgent' | 'Hot' | 'Warm' | 'Cold' | 'Closed';
  assignedTo: string;
  whatsappStatus: 'Sent' | 'Replied' | 'Pending';
  createdDate: string; // ISO date string
  notes: string;
  closedBy?: string;
  closedDate?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Admin' | 'Sales' | 'Viewer';
  email: string;
  avatar: string;
  activeLeads: number;
  conversionRate: number;
}

export interface IntegrationLog {
  id: string;
  timestamp: string;
  status: 'Success' | 'Failed' | 'Warning';
  message: string;
}

export interface Integration {
  id: string;
  name: string;
  type: 'social' | 'messaging' | 'storage' | 'web' | 'webhook';
  description: string;
  status: 'Connected' | 'Not Connected' | 'Error' | 'Needs Attention';
  lastSync: string;
  icon: string;
  config: Record<string, any>;
  logs: IntegrationLog[];
}

export interface CompanySettings {
  name: string;
  description: string;
  whatsappNumber: string;
  email: string;
  brandColor: string;
  logoUrl?: string;
  currency: string;
  timezone: string;
  modules: {
    analytics: boolean;
    integrations: boolean;
    team: boolean;
  };
}

export interface User {
  email: string;
  companyId: string;
}
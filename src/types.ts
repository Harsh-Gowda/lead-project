export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';

export const LEAD_STAGES: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

export type ActivityEventType =
  | 'created'
  | 'whatsapp_sent'
  | 'whatsapp_replied'
  | 'note_added'
  | 'status_changed'
  | 'stage_changed'
  | 'assigned_changed'
  | 'call_made'
  | 'email_sent'
  | 'follow_up_set'
  | 'tag_added';

export interface ActivityEvent {
  id: string;
  lead_id: string;
  type: ActivityEventType;
  created_at: string;     // ISO date string
  description: string;
  user?: string;           // who performed the action
  meta?: string;           // extra detail: old→new value, etc.
}

export interface Note {
  id: string;
  lead_id: string;
  content: string;
  created_at: string;
  created_by: string;
}

export interface Lead {
  id: string;
  company_id?: string;
  name: string;
  phone: string;
  email: string;
  company_name?: string;
  source: 'Instagram' | 'Google' | 'Website' | 'Walk-in' | 'Referral';
  project_type: string;
  city?: string;
  budget: number;
  timeline: string;
  status: 'Urgent' | 'Hot' | 'Warm' | 'Cold' | 'Closed';
  lead_stage: LeadStage;
  assigned_to: string;
  decision_maker?: boolean;
  next_follow_up?: string; // ISO date string
  estimated_value?: number;
  probability?: number;
  expected_close_date?: string; // ISO date string
  whatsapp_status?: 'Sent' | 'Replied' | 'Pending';
  created_at?: string; // ISO date string (standard Supabase name)
  notes?: string;
  first_response_time?: number;
  last_contacted_at?: string;
  tags?: string[];
  activity_log?: ActivityEvent[];
  closed_by?: string;
  closed_at?: string;
  budget_range?: 'Under $5K' | '$5K-$25K' | '$25K-$75K' | '$75K-$150K' | 'Over $150K';
  project_size?: 'Small' | 'Medium' | 'Large' | 'Enterprise';
  urgency_text?: string;
  loss_reason?: string;
  actual_closed_value?: number;
  message_count?: number;
  last_message_direction?: 'inbound' | 'outbound';
  whatsapp_thread_id?: string;
}

export const LEAD_TAGS = [
  'VIP', 'High Budget', 'Repeat Client', 'Referral', 'Architect', 'Builder',
  'Interior Designer', 'Commercial', 'Residential', 'Priority', 'Follow Up',
] as const;

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

import './lib/supabase'; // Initialize Supabase connection
import React, { useState, useMemo, useRef } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  PieChart,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  Briefcase,
  Sparkles,
  Layers,
  RefreshCw,
  Check,
  CheckCircle,
  Database,
  BarChart3,
  Instagram as InstagramIcon,
  Globe,
  Eye,
  EyeOff,
  AlertCircle,
  TrendingUp,
  Activity,
  Zap,
  TrendingDown,
  Clock,
  FileSpreadsheet,
  Lock,
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
  X,
  Image as ImageIcon,
  ShieldCheck,
  Send,
  Target,
  FileText,
  Handshake,
  Trophy,
  Ban,
  CircleDot,
  ChevronDown,
  Calendar,
  AlertTriangle,
  Tag
} from './components/Icons';
import { Lead, LeadStage, LEAD_STAGES, LEAD_TAGS, ActivityEvent, Note, TeamMember, Integration, CompanySettings } from './types';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Analytics from './pages/Analytics';
import Integrations from './pages/Integrations';
import Team from './pages/Team';
import SettingsPage from './pages/Settings';
import { leadsService, activitiesService, notesService, authService, companiesService, usersService } from './lib/database';

// --- MOCK DATA ---
const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Sarah Jenkins', phone: '+1 555-0101', email: 'sarah.j@gmail.com', source: 'Instagram', project_type: 'Full Home Lighting', budget: 12000, timeline: 'ASAP', status: 'Urgent', lead_stage: 'Proposal Sent', assigned_to: 'Mike Ross', whatsapp_status: 'Sent', created_at: '2023-10-25T10:00:00Z', notes: 'Needs pendant lights for kitchen island.', first_response_time: 12, last_contacted_at: '2023-10-26T14:00:00Z', next_follow_up: '2026-02-19T10:00:00Z', estimated_value: 14500, probability: 60, decision_maker: true, tags: ['Residential', 'Priority'] },
  { id: '2', name: 'Dr. Emily Chen', phone: '+1 555-0102', email: 'emily.c@dental.com', source: 'Google', project_type: 'Clinic Renovation', budget: 45000, timeline: '1 Month', status: 'Hot', lead_stage: 'Negotiation', assigned_to: 'Rachel Zane', whatsapp_status: 'Replied', created_at: '2023-10-24T14:30:00Z', notes: 'Interested in waiting room furniture.', first_response_time: 5, last_contacted_at: '2023-10-28T09:00:00Z', next_follow_up: '2026-02-18T09:00:00Z', estimated_value: 52000, probability: 80, decision_maker: true, tags: ['VIP', 'High Budget', 'Commercial'] },
  { id: '3', name: 'Boutique Hotel Alpha', phone: '+1 555-0103', email: 'manager@alpha.com', source: 'Referral', project_type: 'Lobby Redesign', budget: 85000, timeline: '3 Months', status: 'Warm', lead_stage: 'Qualified', assigned_to: 'Harvey Specter', whatsapp_status: 'Pending', created_at: '2023-10-20T09:15:00Z', notes: 'Waiting for architect plans.', first_response_time: 45, last_contacted_at: '2023-10-22T11:00:00Z', next_follow_up: '2026-02-15T10:00:00Z', estimated_value: 95000, probability: 40, decision_maker: false, tags: ['VIP', 'High Budget', 'Referral', 'Architect'] },
  { id: '4', name: 'John Smith', phone: '+1 555-0104', email: 'john.s@yahoo.com', source: 'Walk-in', project_type: 'Bathroom Vanity', budget: 2500, timeline: '2 Weeks', status: 'Cold', lead_stage: 'New', assigned_to: 'Mike Ross', whatsapp_status: 'Pending', created_at: '2023-10-18T16:45:00Z', notes: 'Just browsing mainly.', estimated_value: 3000, probability: 10, decision_maker: true, tags: ['Residential'] },
  { id: '5', name: 'Luxury Spa Haven', phone: '+1 555-0105', email: 'contact@spahaven.com', source: 'Website', project_type: 'Massage Rooms', budget: 30000, timeline: 'ASAP', status: 'Urgent', lead_stage: 'Contacted', assigned_to: 'Rachel Zane', whatsapp_status: 'Sent', created_at: '2023-10-26T11:20:00Z', notes: 'Requires dimmable warm lighting.', first_response_time: 3, last_contacted_at: '2023-10-27T08:00:00Z', next_follow_up: '2026-02-20T14:00:00Z', estimated_value: 35000, probability: 30, decision_maker: false, tags: ['Commercial', 'High Budget', 'Interior Designer'] },
  { id: '6', name: 'Mark Wilson', phone: '+1 555-0106', email: 'm.wilson@outlook.com', source: 'Instagram', project_type: 'Deck Lighting', budget: 5000, timeline: '2 Months', status: 'Hot', lead_stage: 'Proposal Sent', assigned_to: 'Mike Ross', whatsapp_status: 'Sent', created_at: '2023-10-27T09:00:00Z', notes: 'Interested in smart controls.', first_response_time: 20, last_contacted_at: '2023-10-28T16:00:00Z', next_follow_up: '2026-02-17T10:00:00Z', estimated_value: 6200, probability: 55, decision_maker: true, tags: ['Residential', 'Repeat Client'] },
  { id: '7', name: 'Jane Doe', phone: '+1 555-0107', email: 'jane@example.com', source: 'Google', project_type: 'Kitchen Remodel', budget: 15000, timeline: '1 Month', status: 'Warm', lead_stage: 'Contacted', assigned_to: 'Rachel Zane', whatsapp_status: 'Pending', created_at: '2023-10-28T14:00:00Z', notes: 'Referred by contractor.', first_response_time: 60, last_contacted_at: '2023-10-29T10:00:00Z', estimated_value: 18000, probability: 25, decision_maker: false, tags: ['Referral', 'Builder'] },
  { id: '8', name: 'Tech Office HQ', phone: '+1 555-0108', email: 'admin@techhq.com', source: 'Google', project_type: 'Office Fitout', budget: 60000, timeline: 'ASAP', status: 'Hot', lead_stage: 'Won', assigned_to: 'Harvey Specter', whatsapp_status: 'Replied', created_at: '2023-10-29T11:00:00Z', notes: 'Wants modern, minimalist lighting.', first_response_time: 8, last_contacted_at: '2023-11-01T10:00:00Z', closed_by: 'Admin', closed_at: '2023-11-01T10:00:00Z', estimated_value: 65000, probability: 100, decision_maker: true, tags: ['VIP', 'High Budget', 'Commercial', 'Repeat Client'] },
];

// --- MOCK ACTIVITY LOGS ---
const MOCK_ACTIVITY_LOGS: Record<string, ActivityEvent[]> = {
  '1': [
    { id: 'a1-1', lead_id: '1', type: 'created', created_at: '2023-10-25T10:00:00Z', description: 'Lead created from Instagram inquiry', user: 'System' },
    { id: 'a1-2', lead_id: '1', type: 'assigned_changed', created_at: '2023-10-25T10:05:00Z', description: 'Assigned to Mike Ross', user: 'Admin', meta: '— → Mike Ross' },
    { id: 'a1-3', lead_id: '1', type: 'whatsapp_sent', created_at: '2023-10-25T10:12:00Z', description: 'Initial WhatsApp message sent', user: 'Mike Ross' },
    { id: 'a1-4', lead_id: '1', type: 'whatsapp_replied', created_at: '2023-10-25T14:30:00Z', description: 'Client replied with kitchen lighting photos', user: 'Sarah Jenkins' },
    { id: 'a1-5', lead_id: '1', type: 'note_added', created_at: '2023-10-25T15:00:00Z', description: 'Needs pendant lights for kitchen island', user: 'Mike Ross' },
    { id: 'a1-6', lead_id: '1', type: 'stage_changed', created_at: '2023-10-26T09:00:00Z', description: 'Stage changed', user: 'Mike Ross', meta: 'New → Contacted' },
    { id: 'a1-7', lead_id: '1', type: 'tag_added', created_at: '2023-10-26T09:05:00Z', description: 'Tag added: Priority', user: 'Mike Ross' },
    { id: 'a1-8', lead_id: '1', type: 'stage_changed', created_at: '2023-10-26T14:00:00Z', description: 'Stage changed', user: 'Mike Ross', meta: 'Contacted → Proposal Sent' },
    { id: 'a1-9', lead_id: '1', type: 'follow_up_set', created_at: '2023-10-26T14:05:00Z', description: 'Follow-up scheduled for Feb 19', user: 'Mike Ross' },
  ],
  '2': [
    { id: 'a2-1', lead_id: '2', type: 'created', created_at: '2023-10-24T14:30:00Z', description: 'Lead created from Google Ads', user: 'System' },
    { id: 'a2-2', lead_id: '2', type: 'assigned_changed', created_at: '2023-10-24T14:35:00Z', description: 'Assigned to Rachel Zane', user: 'Admin', meta: '— → Rachel Zane' },
    { id: 'a2-3', lead_id: '2', type: 'call_made', created_at: '2023-10-24T14:35:00Z', description: 'Initial call — discussed clinic renovation needs', user: 'Rachel Zane' },
    { id: 'a2-4', lead_id: '2', type: 'status_changed', created_at: '2023-10-24T15:00:00Z', description: 'Status changed', user: 'Rachel Zane', meta: 'Warm → Hot' },
    { id: 'a2-5', lead_id: '2', type: 'whatsapp_sent', created_at: '2023-10-25T09:00:00Z', description: 'Sent product catalog via WhatsApp', user: 'Rachel Zane' },
    { id: 'a2-6', lead_id: '2', type: 'whatsapp_replied', created_at: '2023-10-25T11:00:00Z', description: 'Dr. Chen selected 3 furniture sets', user: 'Dr. Emily Chen' },
    { id: 'a2-7', lead_id: '2', type: 'stage_changed', created_at: '2023-10-26T10:00:00Z', description: 'Stage changed', user: 'Rachel Zane', meta: 'Qualified → Proposal Sent' },
    { id: 'a2-8', lead_id: '2', type: 'email_sent', created_at: '2023-10-27T09:00:00Z', description: 'Formal quotation emailed', user: 'Rachel Zane' },
    { id: 'a2-9', lead_id: '2', type: 'whatsapp_replied', created_at: '2023-10-28T09:00:00Z', description: 'Client wants to negotiate pricing', user: 'Dr. Emily Chen' },
    { id: 'a2-10', lead_id: '2', type: 'stage_changed', created_at: '2023-10-28T09:30:00Z', description: 'Stage changed', user: 'Rachel Zane', meta: 'Proposal Sent → Negotiation' },
    { id: 'a2-11', lead_id: '2', type: 'tag_added', created_at: '2023-10-28T09:35:00Z', description: 'Tags added: VIP, High Budget', user: 'Rachel Zane' },
  ],
  '3': [
    { id: 'a3-1', lead_id: '3', type: 'created', created_at: '2023-10-20T09:15:00Z', description: 'Lead created from referral by Arch. Studio', user: 'System' },
    { id: 'a3-2', lead_id: '3', type: 'assigned_changed', created_at: '2023-10-20T09:20:00Z', description: 'Assigned to Harvey Specter', user: 'Admin', meta: '— → Harvey Specter' },
    { id: 'a3-3', lead_id: '3', type: 'call_made', created_at: '2023-10-20T10:00:00Z', description: 'Intro call with hotel manager', user: 'Harvey Specter' },
    { id: 'a3-4', lead_id: '3', type: 'note_added', created_at: '2023-10-20T10:30:00Z', description: 'Waiting for architect plans before proceeding', user: 'Harvey Specter' },
    { id: 'a3-5', lead_id: '3', type: 'stage_changed', created_at: '2023-10-22T11:00:00Z', description: 'Stage changed', user: 'Harvey Specter', meta: 'Contacted → Qualified' },
    { id: 'a3-6', lead_id: '3', type: 'tag_added', created_at: '2023-10-22T11:05:00Z', description: 'Tags added: VIP, High Budget, Referral, Architect', user: 'Harvey Specter' },
  ],
  '4': [
    { id: 'a4-1', lead_id: '4', type: 'created', created_at: '2023-10-18T16:45:00Z', description: 'Walk-in lead captured at showroom', user: 'System' },
    { id: 'a4-2', lead_id: '4', type: 'assigned_changed', created_at: '2023-10-18T16:50:00Z', description: 'Assigned to Mike Ross', user: 'Admin', meta: '— → Mike Ross' },
    { id: 'a4-3', lead_id: '4', type: 'note_added', created_at: '2023-10-18T17:00:00Z', description: 'Just browsing mainly, not committed yet', user: 'Mike Ross' },
  ],
  '5': [
    { id: 'a5-1', lead_id: '5', type: 'created', created_at: '2023-10-26T11:20:00Z', description: 'Lead created from website form', user: 'System' },
    { id: 'a5-2', lead_id: '5', type: 'assigned_changed', created_at: '2023-10-26T11:25:00Z', description: 'Assigned to Rachel Zane', user: 'Admin', meta: '— → Rachel Zane' },
    { id: 'a5-3', lead_id: '5', type: 'whatsapp_sent', created_at: '2023-10-26T11:23:00Z', description: 'Quick response WhatsApp sent', user: 'Rachel Zane' },
    { id: 'a5-4', lead_id: '5', type: 'call_made', created_at: '2023-10-27T08:00:00Z', description: 'Discussed dimmable warm lighting requirements', user: 'Rachel Zane' },
    { id: 'a5-5', lead_id: '5', type: 'stage_changed', created_at: '2023-10-27T08:30:00Z', description: 'Stage changed', user: 'Rachel Zane', meta: 'New → Contacted' },
  ],
  '6': [
    { id: 'a6-1', lead_id: '6', type: 'created', created_at: '2023-10-27T09:00:00Z', description: 'Lead from Instagram DM', user: 'System' },
    { id: 'a6-2', lead_id: '6', type: 'assigned_changed', created_at: '2023-10-27T09:05:00Z', description: 'Assigned to Mike Ross', user: 'Admin', meta: '— → Mike Ross' },
    { id: 'a6-3', lead_id: '6', type: 'whatsapp_sent', created_at: '2023-10-27T09:20:00Z', description: 'Sent smart lighting options catalog', user: 'Mike Ross' },
    { id: 'a6-4', lead_id: '6', type: 'whatsapp_replied', created_at: '2023-10-27T12:00:00Z', description: 'Interested in smart controls for deck', user: 'Mark Wilson' },
    { id: 'a6-5', lead_id: '6', type: 'stage_changed', created_at: '2023-10-28T10:00:00Z', description: 'Stage changed', user: 'Mike Ross', meta: 'Contacted → Proposal Sent' },
    { id: 'a6-6', lead_id: '6', type: 'email_sent', created_at: '2023-10-28T16:00:00Z', description: 'Proposal with smart deck lighting options sent', user: 'Mike Ross' },
  ],
  '7': [
    { id: 'a7-1', lead_id: '7', type: 'created', created_at: '2023-10-28T14:00:00Z', description: 'Lead created from Google search', user: 'System' },
    { id: 'a7-2', lead_id: '7', type: 'assigned_changed', created_at: '2023-10-28T14:05:00Z', description: 'Assigned to Rachel Zane', user: 'Admin', meta: '— → Rachel Zane' },
    { id: 'a7-3', lead_id: '7', type: 'whatsapp_sent', created_at: '2023-10-29T09:00:00Z', description: 'Initial contact message sent', user: 'Rachel Zane' },
    { id: 'a7-4', lead_id: '7', type: 'whatsapp_replied', created_at: '2023-10-29T10:00:00Z', description: 'Referred by contractor, wants kitchen remodel', user: 'Jane Doe' },
    { id: 'a7-5', lead_id: '7', type: 'stage_changed', created_at: '2023-10-29T10:30:00Z', description: 'Stage changed', user: 'Rachel Zane', meta: 'New → Contacted' },
  ],
  '8': [
    { id: 'a8-1', lead_id: '8', type: 'created', created_at: '2023-10-29T11:00:00Z', description: 'Lead created from Google Ads', user: 'System' },
    { id: 'a8-2', lead_id: '8', type: 'assigned_changed', created_at: '2023-10-29T11:05:00Z', description: 'Assigned to Harvey Specter', user: 'Admin', meta: '— → Harvey Specter' },
    { id: 'a8-3', lead_id: '8', type: 'call_made', created_at: '2023-10-29T11:08:00Z', description: 'Immediate call — high-priority office fitout', user: 'Harvey Specter' },
    { id: 'a8-4', lead_id: '8', type: 'status_changed', created_at: '2023-10-29T11:30:00Z', description: 'Status changed', user: 'Harvey Specter', meta: 'Warm → Hot' },
    { id: 'a8-5', lead_id: '8', type: 'whatsapp_sent', created_at: '2023-10-29T14:00:00Z', description: 'Sent minimalist lighting portfolio', user: 'Harvey Specter' },
    { id: 'a8-6', lead_id: '8', type: 'whatsapp_replied', created_at: '2023-10-29T16:00:00Z', description: 'Loved the portfolio, wants to proceed', user: 'Tech Office HQ' },
    { id: 'a8-7', lead_id: '8', type: 'stage_changed', created_at: '2023-10-30T09:00:00Z', description: 'Stage changed', user: 'Harvey Specter', meta: 'New → Qualified' },
    { id: 'a8-8', lead_id: '8', type: 'email_sent', created_at: '2023-10-30T10:00:00Z', description: 'Detailed proposal with 3D renders sent', user: 'Harvey Specter' },
    { id: 'a8-9', lead_id: '8', type: 'stage_changed', created_at: '2023-10-30T14:00:00Z', description: 'Stage changed', user: 'Harvey Specter', meta: 'Qualified → Proposal Sent' },
    { id: 'a8-10', lead_id: '8', type: 'whatsapp_replied', created_at: '2023-10-31T09:00:00Z', description: 'Client approved proposal with minor changes', user: 'Tech Office HQ' },
    { id: 'a8-11', lead_id: '8', type: 'stage_changed', created_at: '2023-10-31T10:00:00Z', description: 'Stage changed', user: 'Harvey Specter', meta: 'Proposal Sent → Negotiation' },
    { id: 'a8-12', lead_id: '8', type: 'note_added', created_at: '2023-10-31T11:00:00Z', description: 'Negotiated final price at $58K (from $65K)', user: 'Harvey Specter' },
    { id: 'a8-13', lead_id: '8', type: 'stage_changed', created_at: '2023-11-01T10:00:00Z', description: 'Stage changed — Deal Won! 🎉', user: 'Harvey Specter', meta: 'Negotiation → Won' },
    { id: 'a8-14', lead_id: '8', type: 'tag_added', created_at: '2023-11-01T10:05:00Z', description: 'Tags added: VIP, Repeat Client', user: 'Admin' },
  ],
};

// Activity event config for timeline rendering
const getActivityEventConfig = (type: ActivityEvent['type']) => {
  const configs: Record<string, { icon: typeof MessageCircle; color: string; bg: string; border: string }> = {
    created: { icon: CircleDot, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    whatsapp_sent: { icon: Send, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
    whatsapp_replied: { icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    note_added: { icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    status_changed: { icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    stage_changed: { icon: ArrowRight, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    assigned_changed: { icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
    call_made: { icon: Phone, color: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-200' },
    email_sent: { icon: Mail, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
    follow_up_set: { icon: Calendar, color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-teal-200' },
    tag_added: { icon: Tag, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' },
  };
  return configs[type] || configs.created;
};

const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Mike Ross', role: 'Sales', email: 'mike@lumina.com', avatar: 'https://picsum.photos/100/100?random=1', activeLeads: 12, conversionRate: 24 },
  { id: '2', name: 'Rachel Zane', role: 'Sales', email: 'rachel@lumina.com', avatar: 'https://picsum.photos/100/100?random=2', activeLeads: 18, conversionRate: 31 },
  { id: '3', name: 'Harvey Specter', role: 'Admin', email: 'harvey@lumina.com', avatar: 'https://picsum.photos/100/100?random=3', activeLeads: 5, conversionRate: 45 },
];

const MOCK_INTEGRATIONS: Integration[] = [
  { id: '1', name: 'Instagram Ads', type: 'social', status: 'Connected', description: 'Sync leads from Meta campaigns.', lastSync: '12m ago', icon: 'IG', config: {}, logs: [] },
  { id: '2', name: 'WhatsApp', type: 'messaging', status: 'Connected', description: 'Real-time chat automation.', lastSync: '1h ago', icon: 'WA', config: {}, logs: [] },
  { id: '3', name: 'Google Sheets', type: 'storage', status: 'Not Connected', description: 'Lead backup and exports.', lastSync: 'Never', icon: 'GS', config: {}, logs: [] },
];

// --- COMPONENTS ---
const Badge = ({ children, color, icon: Icon }: { children: React.ReactNode; color: string; icon?: React.ElementType }) => {
  const styles: Record<string, string> = {
    red: 'bg-red-50 text-red-700 border-red-100',
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-200',
    gray: 'bg-slate-100 text-slate-400 border-slate-200 opacity-60',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    teal: 'bg-teal-50 text-teal-700 border-teal-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-tight ${styles[color] || styles.slate}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  // currentView state removed in favor of Routing
  const [statusFilter, setStatusFilter] = useState<string>('All Active');
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'Lumina CRM',
    description: 'Growth-focused lead intelligence for showrooms and clinics.',
    whatsappNumber: '',
    email: 'admin@workspace.com',
    brandColor: '#4f46e5', // Indigo 600
    logoUrl: '',
    currency: 'USD',
    timezone: 'UTC-5',
    modules: { analytics: true, integrations: true, team: true }
  });

  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadActivities, setSelectedLeadActivities] = useState<ActivityEvent[]>([]);
  const [selectedLeadNotes, setSelectedLeadNotes] = useState<Note[]>([]);
  const [globalActivities, setGlobalActivities] = useState<(ActivityEvent & { lead_name?: string })[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch company ID on mount
  React.useEffect(() => {
    const fetchCompany = async () => {
      try {
        // 1. Try to get existing companies
        const companies = await companiesService.getAll();
        if (companies && companies.length > 0) {
          console.log('Found existing company:', companies[0].id);
          setCompanyId(companies[0].id);
          return;
        }

        // 2. If no company exists, create a default one
        console.log('No company found. Creating default company...');
        const newCompany = await companiesService.create({
          name: 'My Company',
          email: 'admin@example.com'
        });

        if (newCompany) {
          console.log('Default company created:', newCompany.id);
          setCompanyId(newCompany.id);
        }
      } catch (err: any) {
        console.error('Error fetching/creating company:', err);
        // Supabase often returns { message: "..." } or { error_description: "..." }
        if (err.message || err.error_description) {
          console.error('Detailed Supabase Error:', err.message || err.error_description);
        }
      }
    };
    fetchCompany();
  }, []);

  // Fetch global recent activities for notifications
  const fetchGlobalActivities = async () => {
    try {
      const data = await activitiesService.getRecent(20);
      setGlobalActivities(data as unknown as (ActivityEvent & { lead_name?: string })[]);
    } catch (error) {
      console.error('Error fetching global activities:', error);
    }
  };

  // Fetch activities for selected lead
  React.useEffect(() => {
    if (selectedLead?.id) {
      const fetchActivities = async () => {
        try {
          const data = await activitiesService.getByLeadId(selectedLead.id);
          setSelectedLeadActivities(data as unknown as ActivityEvent[]);
        } catch (error) {
          console.error('Error fetching activities:', error);
        }
      };
      fetchActivities();

      const fetchNotes = async () => {
        try {
          const data = await notesService.getByLeadId(selectedLead.id);
          setSelectedLeadNotes(data as unknown as Note[]);
        } catch (error) {
          console.error('Error fetching notes:', error);
        }
      };
      fetchNotes();
    } else {
      setSelectedLeadActivities([]);
      setSelectedLeadNotes([]);
    }
  }, [selectedLead?.id]);

  // Fetch leads from Supabase on mount
  React.useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        const data = await leadsService.getAll();
        if (data && data.length > 0) {
          // Wrap mock data with real results if any exist
          // In a real app, we'd just use 'data'
          setLeads(data as unknown as Lead[]);
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
    fetchGlobalActivities();
  }, []);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [readNotifIds, setReadNotifIds] = useState<Set<string>>(new Set());
  const notifRef = useRef<HTMLDivElement>(null);

  // Build notifications from global activities
  const notifications = useMemo(() => {
    return globalActivities.map(ev => {
      const lead = leads.find(l => l.id === ev.lead_id);
      return {
        ...ev,
        leadId: ev.lead_id,
        leadName: lead?.name || ev.lead_name || 'Unknown Lead'
      };
    });
  }, [globalActivities, leads]);

  const unreadCount = notifications.filter(n => !readNotifIds.has(n.id)).length;

  const markAllRead = () => {
    setReadNotifIds(new Set(notifications.map(n => n.id)));
  };

  // Close notif panel on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isNotifOpen]);

  const metrics = useMemo(() => {
    const activeLeads = leads.filter(l => l.status !== 'Closed');
    const closedCount = leads.filter(l => l.status === 'Closed').length;
    const conversion = leads.length > 0 ? Math.round((closedCount / leads.length) * 100) : 0;

    return {
      total: activeLeads.length,
      urgent: activeLeads.filter(l => l.status === 'Urgent').length,
      hot: activeLeads.filter(l => l.status === 'Hot').length,
      conversion: conversion,
    };
  }, [leads]);

  const sourceBreakdown = useMemo(() => {
    const sources = ['Instagram', 'Google', 'WhatsApp', 'Website', 'Walk-in', 'Referral'];
    const statuses: Lead['status'][] = ['Urgent', 'Hot', 'Warm', 'Cold', 'Closed'];

    return sources.map(source => {
      const sourceLeads = leads.filter(l => l.source === source || (source === 'Google' && l.source === 'Google' as any));
      const distribution = statuses.reduce((acc, status) => {
        acc[status] = sourceLeads.filter(l => l.status === status).length;
        return acc;
      }, {} as Record<string, number>);

      return {
        source,
        total: sourceLeads.length,
        distribution,
      };
    }).sort((a, b) => b.total - a.total);
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let list = leads;

    if (statusFilter === 'All Active') {
      list = leads.filter(l => l.status !== 'Closed');
    } else if (statusFilter === 'All') {
      list = leads;
    } else {
      list = leads.filter(l => l.status === statusFilter);
    }

    return [...list].sort((a, b) => {
      const priority = { Urgent: 0, Hot: 1, Warm: 2, Cold: 3, Closed: 4 };
      return priority[a.status as keyof typeof priority] - priority[b.status as keyof typeof priority];
    });
  }, [leads, statusFilter]);

  const handleMarkAsClosed = async (leadId: string) => {
    try {
      const updates = {
        status: 'Closed' as const,
        closed_at: new Date().toISOString(),
        closed_by: 'Admin'
      };

      await leadsService.update(leadId, updates);
      await activitiesService.log(leadId, 'status_changed', 'Lead marked as closed', 'Admin', 'Active → Closed');

      setLeads(prevLeads => prevLeads.map(l =>
        l.id === leadId ? { ...l, ...updates } : l
      ));
      setIsDrawerOpen(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Error closing lead:', error);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setSettings({ ...settings, logoUrl: '' });
  };

  const SourceIcon = ({ source, size = 14 }: { source: Lead['source'] | string, size?: number }) => {
    switch (source) {
      case 'Instagram': return <InstagramIcon size={size} className="text-pink-500" />;
      case 'Google': return <Globe size={size} className="text-blue-500" />;
      case 'WhatsApp': return <MessageCircle size={size} className="text-green-500" />;
      case 'Website': return <Layers size={size} className="text-indigo-500" />;
      case 'Referral': return <Users size={size} className="text-amber-500" />;
      default: return <Users size={size} className="text-slate-400" />;
    }
  };

  const getStatusConfig = (status: Lead['status'] | string) => {
    switch (status) {
      case 'Urgent': return { color: 'red', icon: Zap, border: 'border-l-red-500', hex: '#ef4444' };
      case 'Hot': return { color: 'orange', icon: TrendingUp, border: 'border-l-amber-500', hex: '#f59e0b' };
      case 'Warm': return { color: 'blue', icon: Activity, border: 'border-l-blue-500', hex: '#3b82f6' };
      case 'Cold': return { color: 'slate', icon: Clock, border: 'border-l-slate-300', hex: '#94a3b8' };
      case 'Closed': return { color: 'gray', icon: CheckCircle, border: 'border-l-emerald-500 opacity-60', hex: '#10b981' };
      default: return { color: 'slate', icon: Users, border: 'border-l-transparent', hex: '#64748b' };
    }
  };

  const getStageConfig = (stage: LeadStage | string) => {
    switch (stage) {
      case 'New': return { color: 'cyan', icon: CircleDot, hex: '#06b6d4' };
      case 'Contacted': return { color: 'blue', icon: Send, hex: '#3b82f6' };
      case 'Qualified': return { color: 'purple', icon: Target, hex: '#8b5cf6' };
      case 'Proposal Sent': return { color: 'indigo', icon: FileText, hex: '#6366f1' };
      case 'Negotiation': return { color: 'amber', icon: Handshake, hex: '#f59e0b' };
      case 'Won': return { color: 'green', icon: Trophy, hex: '#10b981' };
      case 'Lost': return { color: 'red', icon: Ban, hex: '#ef4444' };
      default: return { color: 'slate', icon: CircleDot, hex: '#64748b' };
    }
  };

  const handleStageChange = async (leadId: string, newStage: LeadStage) => {
    try {
      const isTerminal = newStage === 'Won' || newStage === 'Lost';
      const lead = leads.find(l => l.id === leadId);
      const oldStage = lead?.lead_stage;

      const updates: Partial<Lead> = {
        lead_stage: newStage,
        status: isTerminal ? 'Closed' as const : lead?.status,
        closed_at: isTerminal ? new Date().toISOString() : lead?.closed_at,
        closed_by: isTerminal ? 'Admin' : lead?.closed_by,
      };

      await leadsService.update(leadId, updates);
      await activitiesService.log(leadId, 'stage_changed', `Stage changed to ${newStage}`, 'Admin', `${oldStage} → ${newStage}`);

      setLeads(prevLeads => prevLeads.map(l =>
        l.id === leadId ? { ...l, ...updates } : l
      ));

      setSelectedLead(prev => {
        if (!prev || prev.id !== leadId) return prev;
        return { ...prev, ...updates };
      });

      // Update global activities to reflect the change in notifications
      fetchGlobalActivities();
    } catch (error) {
      console.error('Error changing lead stage:', error);
    }
  };

  const handleUpdateLeadProperty = async (leadId: string, updates: Partial<Lead>) => {
    try {
      await leadsService.update(leadId, updates);
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updates } : l));
      setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, ...updates } : prev);
    } catch (err) {
      console.error('Error updating lead property:', err);
    }
  };

  const handleCreateLead = async () => {
    // Retry fetching company if missing (JIT fix)
    let currentCompanyId = companyId;
    if (!currentCompanyId) {
      try {
        console.log('Company ID missing, attempting to fetch/create one last time...');
        const companies = await companiesService.getAll();
        if (companies && companies.length > 0) {
          currentCompanyId = companies[0].id;
          setCompanyId(currentCompanyId);
        } else {
          const newComp = await companiesService.create({ name: 'My Company', email: 'admin@example.com' });
          currentCompanyId = newComp.id;
          setCompanyId(currentCompanyId);
        }
      } catch (e: any) {
        console.error('Failed to recover company ID:', e);
        alert(`Configuration Error: Could not verify Company ID. Details: ${e.message || e.error_description || 'Unknown error'}. \n\nEnsure your database 'companies' table exists and RLS policies allow access.`);
        return;
      }
    }

    if (!currentCompanyId) {
      alert('Configuration Error: No Company ID found. Please contact support.');
      return;
    }

    try {
      console.log('Attempting to create manual lead...');
      const newLead: Partial<Lead> = {
        company_id: currentCompanyId,
        name: 'New Manual Lead',
        phone: '',
        email: '',
        source: 'Website',
        lead_stage: 'New',
        status: 'Warm',
        budget: 0,
        timeline: 'TBD',
        project_type: 'General',
        decision_maker: false
      };

      const created = await leadsService.create(newLead as Lead);
      console.log('Lead created successfully:', created);

      await activitiesService.log(created.id, 'created', 'Manual lead created', 'Admin');

      setLeads(prev => [created as Lead, ...prev]);
      setSelectedLead(created as Lead);
      setIsDrawerOpen(true);
      fetchGlobalActivities();
    } catch (err: any) {
      console.error('Error creating lead:', err);
      // Detailed error if RLS or constraint violation
      const msg = err.message || err.error_description || 'Unknown error';
      alert(`Failed to create lead: ${msg}`);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteContent.trim()) return;

    try {
      const note = await notesService.create({
        lead_id: selectedLead.id,
        content: newNoteContent.trim(),
        created_by: 'Admin'
      });
      await activitiesService.log(selectedLead.id, 'description_changed' as any, 'Added a new note', 'Admin');

      setSelectedLeadNotes(prev => [note as unknown as Note, ...prev]);
      setNewNoteContent('');
      fetchGlobalActivities();
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };


  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);

    try {
      if (authMode === 'signin') {
        const { user } = await authService.signIn(email, password);
        if (user) {
          // After sign in, ensure user profile exists and is linked to company
          try {
            // 1. Check if user profile exists
            let userProfile = await usersService.getByAuthId(user.id).catch(() => null);

            // 2. If not, create it
            if (!userProfile && companyId) {
              console.log('User profile missing, creating one...');
              await usersService.create({
                auth_id: user.id,
                email: user.email!,
                name: 'Admin User',
                company_id: companyId,
                role: 'Admin'
              });
            }
          } catch (profileErr) {
            console.error('Error syncing user profile:', profileErr);
            // Verify if we can proceed even if this fails (e.g. if RLS allows it solely based on auth.uid)
          }

          setIsAuthenticated(true);
        }
      } else {
        const { user } = await authService.signUp(email, password);
        if (user) {
          // Create profile immediately for new signups
          if (companyId) {
            try {
              await usersService.create({
                auth_id: user.id,
                email: user.email!,
                name: 'Admin User',
                company_id: companyId,
                role: 'Admin'
              });
            } catch (createErr) {
              console.error('Error creating user profile:', createErr);
            }
          }

          alert('Account created! Please check your email to confirm your account before logging in.');
          setAuthMode('signin');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      alert(`Authentication failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex font-sans text-slate-800 overflow-hidden">
        {/* Left Side: Brand & Visual */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 max-w-md text-center lg:text-left">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-600/20">
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
              Precision Lead <span className="text-indigo-400">Intelligence</span> for Local Business.
            </h1>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
              Unified dashboard for WhatsApp, Instagram, and Google leads. Convert conversations into closed deals with Lumina.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white mb-1">100+</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Global Showrooms</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white mb-1">2.4k</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Daily Leads Synced</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-slate-50/50">
          <div className="w-full max-w-sm space-y-10 animate-fade-in">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Sparkles size={20} className="text-white" />
              </div>
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {authMode === 'signin' ? 'Welcome back' : 'Create workspace'}
              </h2>
              <p className="text-sm text-slate-500 mt-1.5 font-medium">
                {authMode === 'signin' ? 'Enter your credentials to access the console.' : 'Start your 14-day premium lead management trial.'}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Briefcase size={12} className="text-slate-400" /> Business Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Modern Lighting Co."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                    value={settings.name}
                    onChange={e => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" /> Email Address
                </label>
                <input
                  required
                  type="email"
                  placeholder="admin@lumina.io"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Lock size={12} className="text-slate-400" /> Password
                  </label>
                  {authMode === 'signin' && <button type="button" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">Forgot?</button>}
                </div>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                disabled={isAuthLoading}
                className={`w-full py-3 bg-slate-900 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 group ${isAuthLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
              >
                {isAuthLoading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <>
                    {authMode === 'signin' ? 'Sign In' : 'Create Workspace'}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-slate-50/50 px-3 text-slate-400">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors">
                <Globe size={16} className="text-blue-500" />
                <span className="text-xs font-bold text-slate-700">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors">
                <MessageCircle size={16} className="text-green-500" fill="currentColor" />
                <span className="text-xs font-bold text-slate-700">WhatsApp</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                <span className="text-indigo-600 font-bold underline decoration-indigo-200 underline-offset-4">
                  {authMode === 'signin' ? 'Register here' : 'Login instead'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const NavItem = ({ to, icon: Icon, label, id }: { to: string, icon: React.ElementType, label: string, id: string }) => {
    // Check if module is enabled
    if (['dashboard', 'leads', 'settings'].includes(id) || settings.modules[id as keyof typeof settings.modules]) {
      return (
        <NavLink
          to={to}
          className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
        >
          <Icon size={18} />
          {label}
        </NavLink>
      );
    }
    return null;
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-white font-sans text-slate-800 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 flex flex-col h-full border-r border-slate-800 shrink-0">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: settings.logoUrl ? 'transparent' : settings.brandColor }}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">{settings.name.charAt(0)}</span>
              )}
            </div>
            <span className="font-bold text-slate-100 truncate text-sm tracking-tight">{settings.name}</span>
          </div>

          <nav className="flex-1 px-3 mt-2 space-y-0.5">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" id="dashboard" />
            <NavItem to="/leads" icon={Users} label="Lead Pipeline" id="leads" />
            <NavItem to="/analytics" icon={PieChart} label="Analytics" id="analytics" />
            <NavItem to="/integrations" icon={Layers} label="Integrations" id="integrations" />
            <NavItem to="/team" icon={Briefcase} label="Team Members" id="team" />
            <NavItem to="/settings" icon={Settings} label="Settings" id="settings" />
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleCreateLead}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
            >
              <Plus size={14} /> New Manual Lead
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 text-sm font-medium transition-colors">
              <LogOut size={18} /> Exit Console
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50/50">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
            <div className="flex items-center gap-4 flex-1 max-w-lg">
              <div className="relative w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search leads by name, email, or project..." className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white px-0.5">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[380px] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 uppercase tracking-wide transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">No notifications yet</div>
                      ) : (
                        notifications.map(notif => {
                          const config = getActivityEventConfig(notif.type);
                          const NotifIcon = config.icon;
                          const isUnread = !readNotifIds.has(notif.id);
                          const date = new Date(notif.timestamp);
                          const now = new Date();
                          const diffMs = now.getTime() - date.getTime();
                          const diffMins = Math.floor(diffMs / 60000);
                          const diffHours = Math.floor(diffMs / 3600000);
                          const diffDays = Math.floor(diffMs / 86400000);
                          let timeAgo = '';
                          if (diffMins < 60) timeAgo = `${diffMins}m ago`;
                          else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
                          else if (diffDays < 7) timeAgo = `${diffDays}d ago`;
                          else timeAgo = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                          return (
                            <button
                              key={notif.id}
                              onClick={() => {
                                const lead = leads.find(l => l.id === notif.leadId);
                                if (lead) {
                                  setSelectedLead(lead);
                                  setIsDrawerOpen(true);
                                }
                                setReadNotifIds(prev => new Set([...prev, notif.id]));
                                setIsNotifOpen(false);
                              }}
                              className={`w-full flex items-start gap-3 px-5 py-3.5 text-left hover:bg-slate-50 transition-colors ${isUnread ? 'bg-indigo-50/30' : ''}`}
                            >
                              <div className={`w-8 h-8 rounded-full ${config.bg} border ${config.border} flex items-center justify-center shrink-0 mt-0.5`}>
                                <NotifIcon size={14} className={config.color} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-slate-900 truncate">{notif.leadName}</span>
                                  {isUnread && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0" />}
                                </div>
                                <p className="text-[11px] text-slate-600 font-medium mt-0.5 line-clamp-2">{notif.description}</p>
                                {notif.meta && (
                                  <p className="text-[10px] font-bold text-indigo-500 mt-0.5">{notif.meta}</p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[9px] text-slate-400 font-medium">{timeAgo}</span>
                                  {notif.user && <span className="text-[9px] text-slate-300 font-medium">by {notif.user}</span>}
                                </div>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                    <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing latest {notifications.length} events</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                AD
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <Dashboard
                  metrics={metrics}
                  sourceBreakdown={sourceBreakdown}
                  filteredLeads={filteredLeads}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  getStatusConfig={getStatusConfig}
                  getStageConfig={getStageConfig}
                  SourceIcon={SourceIcon}
                  setSelectedLead={setSelectedLead}
                  setIsDrawerOpen={setIsDrawerOpen}
                  leads={leads}
                />
              } />
              <Route path="/leads" element={
                <Leads
                  filteredLeads={filteredLeads}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  getStatusConfig={getStatusConfig}
                  getStageConfig={getStageConfig}
                  SourceIcon={SourceIcon}
                  setSelectedLead={setSelectedLead}
                  setIsDrawerOpen={setIsDrawerOpen}
                  leads={leads}
                />
              } />
              <Route path="/analytics" element={<Analytics leads={leads} settings={settings} getStageConfig={getStageConfig} />} />
              <Route path="/integrations" element={<Integrations MOCK_INTEGRATIONS={MOCK_INTEGRATIONS} />} />
              <Route path="/team" element={<Team MOCK_TEAM={MOCK_TEAM} />} />
              <Route path="/settings" element={
                <SettingsPage
                  settings={settings}
                  setSettings={setSettings}
                  fileInputRef={fileInputRef}
                  handleLogoUpload={handleLogoUpload}
                  removeLogo={removeLogo}
                />
              } />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div >

        {/* Detail Drawer */}
        {
          isDrawerOpen && selectedLead && (
            <div className="fixed inset-0 z-50 flex justify-end">
              <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
              <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in border-l border-slate-200">
                <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedLead.name}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        color={getStatusConfig(selectedLead.status).color}
                        icon={getStatusConfig(selectedLead.status).icon}
                      >
                        {selectedLead.status}
                      </Badge>
                      <Badge
                        color={getStageConfig(selectedLead.lead_stage).color}
                        icon={getStageConfig(selectedLead.lead_stage).icon}
                      >
                        {selectedLead.lead_stage}
                      </Badge>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      <Tag size={12} className="text-slate-300" />
                      {(selectedLead.tags || []).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[9px] font-bold text-indigo-600 uppercase tracking-wide group/tag"
                        >
                          {tag}
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const newTags = (selectedLead.tags || []).filter(t => t !== tag);
                              try {
                                await leadsService.update(selectedLead.id, { tags: newTags });
                                await activitiesService.log(selectedLead.id, 'tag_removed', `Tag removed: ${tag}`, 'Admin');
                                setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, tags: newTags } : l));
                                setSelectedLead(prev => prev ? { ...prev, tags: newTags } : prev);
                              } catch (err) {
                                console.error('Error removing tag:', err);
                              }
                            }}
                            className="text-indigo-300 hover:text-red-500 transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                      <select
                        value=""
                        onChange={async (e) => {
                          const tag = e.target.value;
                          if (tag && !(selectedLead.tags || []).includes(tag)) {
                            const newTags = [...(selectedLead.tags || []), tag];
                            try {
                              await leadsService.update(selectedLead.id, { tags: newTags });
                              await activitiesService.log(selectedLead.id, 'tag_added', `Tag added: ${tag}`, 'Admin');
                              setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, tags: newTags } : l));
                              setSelectedLead(prev => prev ? { ...prev, tags: newTags } : prev);
                            } catch (err) {
                              console.error('Error adding tag:', err);
                            }
                          }
                        }}
                        className="px-1.5 py-0.5 rounded-full border border-dashed border-slate-300 text-[9px] font-bold text-slate-400 bg-transparent cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-colors appearance-none outline-none"
                      >
                        <option value="">+ Add</option>
                        {LEAD_TAGS.filter(t => !(selectedLead.tags || []).includes(t)).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-all border border-slate-200 rounded-md bg-white shadow-sm"><X size={18} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"><MessageCircle size={16} fill="white" /> Contact WhatsApp</button>
                    <button className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"><Phone size={18} /></button>
                    <button className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"><Mail size={18} /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Estimated Budget', val: '$' + selectedLead.budget.toLocaleString() },
                      { label: 'Desired Timeline', val: selectedLead.timeline },
                      { label: 'Project Area', val: selectedLead.project_type },
                      { label: 'Source Channel', val: selectedLead.source },
                      { label: 'WhatsApp Status', val: selectedLead.whatsapp_status },
                      { label: 'Messages', val: selectedLead.message_count != null ? String(selectedLead.message_count) : '0' },
                      { label: 'Last Direction', val: selectedLead.last_message_direction ? (selectedLead.last_message_direction === 'inbound' ? '↙ Inbound' : '↗ Outbound') : '—' },
                      { label: 'Email Handle', val: selectedLead.email },
                      { label: 'First Response', val: selectedLead.first_response_time ? `${selectedLead.first_response_time} min` : 'Not yet' },
                      { label: 'Last Contacted', val: selectedLead.last_contacted_at ? new Date(selectedLead.last_contacted_at).toLocaleDateString() : 'Never' },
                      { label: 'Est. Deal Value', val: selectedLead.estimated_value ? '$' + selectedLead.estimated_value.toLocaleString() : '—' },
                      { label: 'Win Probability', val: selectedLead.probability != null ? `${selectedLead.probability}%` : '—' },
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-md border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{item.label}</label>
                        <div className="text-sm font-bold text-slate-900 truncate">{item.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp Thread */}
                  {selectedLead.whatsapp_thread_id && (
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">WA Thread</span>
                      <code className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{selectedLead.whatsapp_thread_id}</code>
                    </div>
                  )}

                  {/* Follow-Up Tracking */}
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={12} /> Next Follow-Up
                      </label>
                      {selectedLead.next_follow_up && new Date(selectedLead.next_follow_up) < new Date() && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 border border-red-100 text-[9px] font-bold text-red-600 uppercase">
                          <AlertTriangle size={10} /> Overdue
                        </span>
                      )}
                    </div>
                    <input
                      type="date"
                      value={selectedLead.next_follow_up ? selectedLead.next_follow_up.split('T')[0] : ''}
                      onChange={(e) => {
                        const newDate = e.target.value ? new Date(e.target.value).toISOString() : undefined;
                        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, next_follow_up: newDate } : l));
                        setSelectedLead(prev => prev ? { ...prev, next_follow_up: newDate } : prev);
                      }}
                      className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                    {!selectedLead.next_follow_up && (
                      <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1"><AlertTriangle size={10} /> No follow-up scheduled</p>
                    )}
                  </div>

                  {/* Deal Intelligence */}
                  {selectedLead.probability != null && (
                    <div className="bg-slate-50 p-4 rounded-md border border-slate-100 space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Win Probability</label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${selectedLead.probability}%`,
                              backgroundColor: (selectedLead.probability || 0) >= 70 ? '#10b981' : (selectedLead.probability || 0) >= 40 ? '#f59e0b' : '#ef4444'
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-900 min-w-[40px] text-right">{selectedLead.probability}%</span>
                      </div>
                      {selectedLead.estimated_value && (
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>Weighted Value</span>
                          <span className="text-slate-700">${Math.round(selectedLead.estimated_value * (selectedLead.probability || 0) / 100).toLocaleString()}</span>
                        </div>
                      )}
                      {selectedLead.actual_closed_value && (
                        <div className="flex justify-between text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                          <span>Actual Closed</span>
                          <span>${selectedLead.actual_closed_value.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Loss Reason */}
                  {selectedLead.lead_stage === 'Lost' && (
                    <div className="bg-red-50 p-4 rounded-md border border-red-100 space-y-2">
                      <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">Loss Reason</label>
                      <input
                        type="text"
                        value={selectedLead.loss_reason || ''}
                        onChange={(e) => {
                          const reason = e.target.value;
                          setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, loss_reason: reason } : l));
                          setSelectedLead(prev => prev ? { ...prev, loss_reason: reason } : prev);
                        }}
                        placeholder="e.g. Budget constraints, went with competitor..."
                        className="w-full py-2.5 px-3 bg-white border border-red-200 rounded-md text-xs font-bold text-slate-800 placeholder:text-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                      />
                    </div>
                  )}

                  {/* Lead Quality Inputs (Internal Scoring) */}
                  <div className="border-2 border-dashed border-slate-200 rounded-md p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">Internal</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Quality Inputs</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Budget Range</label>
                        <select
                          value={selectedLead.budget_range || ''}
                          onChange={(e) => handleUpdateLeadProperty(selectedLead.id, { budget_range: e.target.value as any })}
                          className="w-full py-2 px-2.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-800 appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        >
                          <option value="">Not set</option>
                          <option value="Under $5K">Under $5K</option>
                          <option value="$5K-$25K">$5K–$25K</option>
                          <option value="$25K-$75K">$25K–$75K</option>
                          <option value="$75K-$150K">$75K–$150K</option>
                          <option value="Over $150K">Over $150K</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Project Size</label>
                        <select
                          value={selectedLead.project_size || ''}
                          onChange={(e) => handleUpdateLeadProperty(selectedLead.id, { project_size: e.target.value as any })}
                          className="w-full py-2 px-2.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-800 appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        >
                          <option value="">Not set</option>
                          <option value="Small">Small</option>
                          <option value="Medium">Medium</option>
                          <option value="Large">Large</option>
                          <option value="Enterprise">Enterprise</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Decision Maker?</label>
                      <button
                        onClick={async () => {
                          const val = !selectedLead.decision_maker;
                          try {
                            await leadsService.update(selectedLead.id, { decision_maker: val });
                            await activitiesService.log(selectedLead.id, 'meta_updated', `Decision maker set to ${val ? 'Yes' : 'No'}`, 'Admin');
                            setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, decision_maker: val } : l));
                            setSelectedLead(prev => prev ? { ...prev, decision_maker: val } : prev);
                          } catch (err) {
                            console.error('Error updating decision maker:', err);
                          }
                        }}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${selectedLead.decision_maker ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${selectedLead.decision_maker ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                      <span className={`text-[11px] font-bold ${selectedLead.decision_maker ? 'text-emerald-600' : 'text-slate-400'}`}>{selectedLead.decision_maker ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Urgency (Raw Answer)</label>
                      <input
                        type="text"
                        value={selectedLead.urgency_text || ''}
                        onBlur={(e) => handleUpdateLeadProperty(selectedLead.id, { urgency_text: e.target.value })}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedLead(prev => prev ? { ...prev, urgency_text: val } : prev);
                        }}
                        placeholder="e.g. Need it done by next month..."
                        className="w-full py-2 px-2.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700 italic placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Intelligence Notes</h3>

                    <form onSubmit={handleAddNote} className="relative">
                      <textarea
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Type a new note..."
                        className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                      />
                      <button
                        type="submit"
                        disabled={!newNoteContent.trim()}
                        className="absolute bottom-2 right-2 p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Plus size={14} />
                      </button>
                    </form>

                    <div className="space-y-3">
                      {selectedLeadNotes.length === 0 ? (
                        <div className="bg-amber-50/50 p-6 rounded-md border border-amber-100 text-sm text-slate-700 italic leading-relaxed font-medium">
                          "{selectedLead.notes || 'No intelligence notes available for this lead.'}"
                        </div>
                      ) : (
                        selectedLeadNotes.map(note => (
                          <div key={note.id} className="bg-white p-4 rounded-md border border-slate-100 shadow-sm space-y-2">
                            <div className="text-xs text-slate-700 leading-relaxed font-medium">{note.content}</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                              <span>{note.created_by}</span>
                              <span>{new Date(note.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Activity Timeline */}
                  {(() => {
                    const activities = selectedLeadActivities;
                    if (activities.length === 0) return null;
                    const sorted = [...activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Clock size={12} /> Activity Timeline
                          </h3>
                          <span className="text-[9px] font-bold text-slate-300 bg-slate-100 px-2 py-0.5 rounded-full">{activities.length} events</span>
                        </div>
                        <div className="relative">
                          {/* Connecting line */}
                          <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent" />
                          <div className="space-y-0">
                            {sorted.map((event, idx) => {
                              const config = getActivityEventConfig(event.type);
                              const EventIcon = config.icon;
                              const date = new Date(event.timestamp);
                              const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                              const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                              return (
                                <div key={event.id} className={`flex gap-3 py-2.5 ${idx === 0 ? 'opacity-100' : 'opacity-80 hover:opacity-100'} transition-opacity`}>
                                  <div className={`relative z-10 w-[30px] h-[30px] rounded-full ${config.bg} border ${config.border} flex items-center justify-center shrink-0 shadow-sm`}>
                                    <EventIcon size={13} className={config.color} />
                                  </div>
                                  <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="text-[11px] font-bold text-slate-800 leading-tight">{event.description}</div>
                                    {event.meta && (
                                      <div className="text-[10px] font-bold text-indigo-500 mt-0.5">{event.meta}</div>
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[9px] font-medium text-slate-400">{dateStr} · {timeStr}</span>
                                      {event.user && (
                                        <span className="text-[9px] font-bold text-slate-300">by {event.user}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {selectedLead.status === 'Closed' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-md">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-[10px] uppercase tracking-widest mb-2">
                        <CheckCircle size={14} /> Conversion Analysis
                      </div>
                      <div className="text-xs text-emerald-800 space-y-1 font-medium">
                        <p>Processed By: <span className="font-bold">{selectedLead.closed_by}</span></p>
                        <p>Closed On: <span className="font-bold">{selectedLead.closed_at ? new Date(selectedLead.closed_at).toLocaleDateString() : 'N/A'}</span></p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50/50 space-y-3">
                  {/* Stage Selector */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Move to Stage</label>
                    <div className="relative">
                      <select
                        value={selectedLead.lead_stage}
                        onChange={(e) => handleStageChange(selectedLead.id, e.target.value as LeadStage)}
                        className="w-full py-3 px-4 pr-10 bg-white border border-slate-200 rounded-md font-bold text-xs text-slate-800 uppercase tracking-widest appearance-none cursor-pointer hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        style={{ borderLeftColor: getStageConfig(selectedLead.lead_stage).hex, borderLeftWidth: '4px' }}
                      >
                        {LEAD_STAGES.map(stage => (
                          <option key={stage} value={stage}>{stage}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {(selectedLead.lead_stage === 'Won' || selectedLead.lead_stage === 'Lost') && (
                    <div className={`p-3 rounded-md text-[10px] font-bold uppercase tracking-widest text-center ${selectedLead.lead_stage === 'Won' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                      {selectedLead.lead_stage === 'Won' ? '🏆 Deal Won — Lead Closed' : '❌ Deal Lost — Lead Closed'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }

        <style>{`
        @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      </div >
    </BrowserRouter>
  );
}

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
  ShieldCheck
} from './components/Icons';
import { Lead, TeamMember, Integration, CompanySettings } from './types';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Analytics from './pages/Analytics';
import Integrations from './pages/Integrations';
import Team from './pages/Team';
import SettingsPage from './pages/Settings';

// --- MOCK DATA ---
const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Sarah Jenkins', phone: '+1 555-0101', email: 'sarah.j@gmail.com', source: 'Instagram', projectType: 'Full Home Lighting', budget: 12000, timeline: 'ASAP', status: 'Urgent', assignedTo: 'Mike Ross', whatsappStatus: 'Sent', createdDate: '2023-10-25T10:00:00Z', notes: 'Needs pendant lights for kitchen island.' },
  { id: '2', name: 'Dr. Emily Chen', phone: '+1 555-0102', email: 'emily.c@dental.com', source: 'Google', projectType: 'Clinic Renovation', budget: 45000, timeline: '1 Month', status: 'Hot', assignedTo: 'Rachel Zane', whatsappStatus: 'Replied', createdDate: '2023-10-24T14:30:00Z', notes: 'Interested in waiting room furniture.' },
  { id: '3', name: 'Boutique Hotel Alpha', phone: '+1 555-0103', email: 'manager@alpha.com', source: 'Referral', projectType: 'Lobby Redesign', budget: 85000, timeline: '3 Months', status: 'Warm', assignedTo: 'Harvey Specter', whatsappStatus: 'Pending', createdDate: '2023-10-20T09:15:00Z', notes: 'Waiting for architect plans.' },
  { id: '4', name: 'John Smith', phone: '+1 555-0104', email: 'john.s@yahoo.com', source: 'Walk-in', projectType: 'Bathroom Vanity', budget: 2500, timeline: '2 Weeks', status: 'Cold', assignedTo: 'Mike Ross', whatsappStatus: 'Pending', createdDate: '2023-10-18T16:45:00Z', notes: 'Just browsing mainly.' },
  { id: '5', name: 'Luxury Spa Haven', phone: '+1 555-0105', email: 'contact@spahaven.com', source: 'Website', projectType: 'Massage Rooms', budget: 30000, timeline: 'ASAP', status: 'Urgent', assignedTo: 'Rachel Zane', whatsappStatus: 'Sent', createdDate: '2023-10-26T11:20:00Z', notes: 'Requires dimmable warm lighting.' },
  { id: '6', name: 'Mark Wilson', phone: '+1 555-0106', email: 'm.wilson@outlook.com', source: 'Instagram', projectType: 'Deck Lighting', budget: 5000, timeline: '2 Months', status: 'Hot', assignedTo: 'Mike Ross', whatsappStatus: 'Sent', createdDate: '2023-10-27T09:00:00Z', notes: 'Interested in smart controls.' },
  { id: '7', name: 'Jane Doe', phone: '+1 555-0107', email: 'jane@example.com', source: 'Google', projectType: 'Kitchen Remodel', budget: 15000, timeline: '1 Month', status: 'Warm', assignedTo: 'Rachel Zane', whatsappStatus: 'Pending', createdDate: '2023-10-28T14:00:00Z', notes: 'Referred by contractor.' },
  { id: '8', name: 'Tech Office HQ', phone: '+1 555-0108', email: 'admin@techhq.com', source: 'Google', projectType: 'Office Fitout', budget: 60000, timeline: 'ASAP', status: 'Hot', assignedTo: 'Harvey Specter', whatsappStatus: 'Replied', createdDate: '2023-10-29T11:00:00Z', notes: 'Wants modern, minimalist lighting.' },
];

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleMarkAsClosed = (leadId: string) => {
    setLeads(prevLeads => prevLeads.map(l =>
      l.id === leadId
        ? {
          ...l,
          status: 'Closed',
          closedDate: new Date().toISOString(),
          closedBy: 'Admin'
        }
        : l
    ));
    setIsDrawerOpen(false);
    setSelectedLead(null);
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


  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsAuthLoading(false);
    }, 1200);
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
              <button className="relative text-slate-400 hover:text-slate-900 transition-colors">
                <Bell size={18} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
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
                  SourceIcon={SourceIcon}
                  setSelectedLead={setSelectedLead}
                  setIsDrawerOpen={setIsDrawerOpen}
                  leads={leads}
                />
              } />
              <Route path="/analytics" element={<Analytics leads={leads} settings={settings} />} />
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
                    <div className="flex items-center gap-2">
                      <Badge
                        color={getStatusConfig(selectedLead.status).color}
                        icon={getStatusConfig(selectedLead.status).icon}
                      >
                        {selectedLead.status}
                      </Badge>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opportunity Profile</span>
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
                      { label: 'Project Area', val: selectedLead.projectType },
                      { label: 'Source Channel', val: selectedLead.source },
                      { label: 'WhatsApp Status', val: selectedLead.whatsappStatus },
                      { label: 'Email Handle', val: selectedLead.email }
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-md border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{item.label}</label>
                        <div className="text-sm font-bold text-slate-900 truncate">{item.val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Intelligence Notes</h3>
                    <div className="bg-amber-50/50 p-6 rounded-md border border-amber-100 text-sm text-slate-700 italic leading-relaxed font-medium">
                      "{selectedLead.notes}"
                    </div>
                  </div>

                  {selectedLead.status === 'Closed' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-md">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-[10px] uppercase tracking-widest mb-2">
                        <CheckCircle size={14} /> Conversion Analysis
                      </div>
                      <div className="text-xs text-emerald-800 space-y-1 font-medium">
                        <p>Processed By: <span className="font-bold">{selectedLead.closedBy}</span></p>
                        <p>Closed On: <span className="font-bold">{selectedLead.closedDate ? new Date(selectedLead.closedDate).toLocaleDateString() : 'N/A'}</span></p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                  {selectedLead.status !== 'Closed' ? (
                    <button
                      onClick={() => handleMarkAsClosed(selectedLead.id)}
                      className="w-full py-3 bg-slate-900 text-white rounded-md font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                    >
                      Mark as Closed
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 bg-slate-200 text-slate-400 rounded-md font-bold text-xs uppercase tracking-widest cursor-not-allowed"
                    >
                      Project Archived
                    </button>
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
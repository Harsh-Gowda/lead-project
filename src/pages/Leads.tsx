
import React from 'react';
import {
    Users,
    Activity,
    Check,
    Filter,
    Mail,
    MessageCircle,
    RefreshCw,
    ChevronRight,
    Database,
    Plus,
    Zap,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertTriangle,
    Calendar
} from '../components/Icons';
import { Lead } from '../types';

interface LeadsProps {
    filteredLeads: Lead[];
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    getStatusConfig: (status: string) => any;
    SourceIcon: React.ElementType;
    setSelectedLead: (lead: Lead) => void;
    setIsDrawerOpen: (isOpen: boolean) => void;
    leads: Lead[];
    getStageConfig: (stage: string) => any;
}

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

const Leads: React.FC<LeadsProps> = ({
    filteredLeads,
    statusFilter,
    setStatusFilter,
    getStatusConfig,
    SourceIcon,
    setSelectedLead,
    setIsDrawerOpen,
    leads,
    getStageConfig
}) => {
    const PipelineTabs = () => {
        const tabs = [
            { label: 'All Active', count: leads.filter(l => l.status !== 'Closed').length, status: 'All Active' },
            { label: 'Urgent', count: leads.filter(l => l.status === 'Urgent').length, status: 'Urgent' },
            { label: 'Hot', count: leads.filter(l => l.status === 'Hot').length, status: 'Hot' },
            { label: 'Warm', count: leads.filter(l => l.status === 'Warm').length, status: 'Warm' },
            { label: 'Cold', count: leads.filter(l => l.status === 'Cold').length, status: 'Cold' },
            { label: 'Closed', count: leads.filter(l => l.status === 'Closed').length, status: 'Closed' }
        ];

        return (
            <div className="flex items-center gap-1 border-b border-slate-100 px-6 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                    const isActive = statusFilter === tab.status;
                    const config = getStatusConfig(tab.status);
                    return (
                        <button
                            key={tab.label}
                            onClick={() => setStatusFilter(tab.status)}
                            className={`flex items-center gap-2 py-4 px-3 border-b-2 transition-all shrink-0 ${isActive
                                ? 'border-indigo-600 text-indigo-600 font-bold'
                                : 'border-transparent text-slate-400 font-semibold hover:text-slate-600'
                                }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'scale-125' : 'opacity-40'}`} style={{ backgroundColor: tab.status === 'All Active' ? '#4f46e5' : config.hex }}></span>
                            <span className="text-xs uppercase tracking-wider">{tab.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        );
    };

    const DashboardView = () => (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
                <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Lead Intelligence Pipeline</h2>
                <div className="flex items-center gap-3">
                    <button className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5">
                        <Filter size={14} /> Advanced Filter
                    </button>
                </div>
            </div>

            <PipelineTabs />

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-separate border-spacing-0">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="py-3 px-6 font-bold text-[10px] text-slate-400 uppercase tracking-widest w-[25%] border-b border-slate-100">Client Detail</th>
                            <th className="py-3 px-6 font-bold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">Priority / Status</th>
                            <th className="py-3 px-6 font-bold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">Project & Budget</th>
                            <th className="py-3 px-6 font-bold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">Source Channel</th>
                            <th className="py-3 px-6 font-bold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">Stage</th>
                            <th className="py-3 px-6 font-bold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">Engagement</th>
                            <th className="py-3 px-6 border-b border-slate-100"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredLeads.map(lead => {
                            const statusConfig = getStatusConfig(lead.status);
                            return (
                                <tr
                                    key={lead.id}
                                    onClick={() => { setSelectedLead(lead); setIsDrawerOpen(true); }}
                                    className={`hover:bg-slate-50/50 cursor-pointer transition-colors group relative border-l-4 ${statusConfig.border}`}
                                >
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-slate-900 flex items-center gap-2">
                                            {lead.name}
                                            {lead.status === 'Urgent' && <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
                                            {lead.next_follow_up && new Date(lead.next_follow_up) < new Date() && lead.status !== 'Closed' && (
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-50 border border-red-100 text-[8px] font-bold text-red-500 uppercase" title={`Follow-up overdue since ${new Date(lead.next_follow_up).toLocaleDateString()}`}>
                                                    <AlertTriangle size={8} /> Overdue
                                                </span>
                                            )}
                                            {!lead.next_follow_up && lead.status !== 'Closed' && lead.lead_stage !== 'Won' && lead.lead_stage !== 'Lost' && (
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-100 text-[8px] font-bold text-amber-500 uppercase" title="No follow-up scheduled">
                                                    <Calendar size={8} /> No F/U
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                                            <Mail size={12} className="text-slate-300" /> {lead.email}
                                        </div>
                                        {lead.tags && lead.tags.length > 0 && (
                                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                                                {lead.tags.slice(0, 3).map(tag => (
                                                    <span
                                                        key={tag}
                                                        className={`px-1.5 py-0 rounded text-[8px] font-bold uppercase tracking-wide ${tag === 'VIP' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-indigo-50 text-indigo-500 border border-indigo-100'}`}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {lead.tags.length > 3 && (
                                                    <span className="text-[8px] font-bold text-slate-400">+{lead.tags.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <Badge color={statusConfig.color} icon={statusConfig.icon}>
                                            {lead.status}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-slate-700 font-bold text-xs">{lead.project_type}</div>
                                        <div className="text-[11px] text-emerald-600 font-bold mt-0.5">${lead.budget.toLocaleString()}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center">
                                                {/* @ts-ignore - Component passed as prop */}
                                                <SourceIcon source={lead.source} />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{lead.source}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <Badge color={getStageConfig(lead.lead_stage).color} icon={getStageConfig(lead.lead_stage).icon}>
                                            {lead.lead_stage}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            {lead.whatsapp_status === 'Replied' ? (
                                                <div className="flex items-center gap-1.5 text-green-600 font-bold text-[10px]">
                                                    <MessageCircle size={14} fill="currentColor" className="opacity-20" /> Replied
                                                </div>
                                            ) : lead.whatsapp_status === 'Sent' ? (
                                                <div className="flex items-center gap-1.5 text-blue-500 font-bold text-[10px]">
                                                    <MessageCircle size={14} /> Sent
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px]">
                                                    <RefreshCw size={12} /> Pending
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 inline-block transition-all group-hover:translate-x-1" />
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredLeads.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-20 text-center text-slate-400 font-medium italic text-sm border-l-4 border-l-transparent">
                                    <div className="flex flex-col items-center gap-2 opacity-50">
                                        <Database size={32} />
                                        <span>No leads matching the "{statusFilter}" filter.</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );

    return (
        <div className="animate-fade-in">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Pipeline</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Filter, search, and manage your omni-channel leads.</p>
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shadow-sm transition-all active:scale-95">
                    <Plus size={14} /> New Opportunity
                </button>
            </div>
            <DashboardView />
        </div>
    );
};

export default Leads;

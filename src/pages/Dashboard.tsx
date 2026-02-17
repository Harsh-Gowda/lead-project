
import React from 'react';
import {
    Users,
    Activity,
    BarChart3,
    Check,
    PieChart,
    Filter,
    Mail,
    MessageCircle,
    RefreshCw,
    ChevronRight,
    Database,
    Plus
} from '../components/Icons';
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Lead } from '../types';

interface DashboardProps {
    metrics: {
        total: number;
        urgent: number;
        hot: number;
        conversion: number;
    };
    sourceBreakdown: {
        source: string;
        total: number;
        distribution: Record<string, number>;
    }[];
    filteredLeads: Lead[];
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    getStatusConfig: (status: string) => any;
    SourceIcon: React.ElementType;
    setSelectedLead: (lead: Lead) => void;
    setIsDrawerOpen: (isOpen: boolean) => void;
    leads: Lead[];
}

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

const Dashboard: React.FC<DashboardProps> = ({
    metrics,
    sourceBreakdown,
    filteredLeads,
    statusFilter,
    setStatusFilter,
    getStatusConfig,
    SourceIcon,
    setSelectedLead,
    setIsDrawerOpen,
    leads
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
                                        </div>
                                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                                            <Mail size={12} className="text-slate-300" /> {lead.email}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <Badge color={statusConfig.color} icon={statusConfig.icon}>
                                            {lead.status}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-slate-700 font-bold text-xs">{lead.projectType}</div>
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
                                        <div className="flex items-center gap-2">
                                            {lead.whatsappStatus === 'Replied' ? (
                                                <div className="flex items-center gap-1.5 text-green-600 font-bold text-[10px]">
                                                    <MessageCircle size={14} fill="currentColor" className="opacity-20" /> Replied
                                                </div>
                                            ) : lead.whatsappStatus === 'Sent' ? (
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
                                <td colSpan={6} className="py-20 text-center text-slate-400 font-medium italic text-sm border-l-4 border-l-transparent">
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
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Holistic view of all inbound activity and sales health.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shadow-sm transition-all active:scale-95">
                        <Plus size={14} /> New Manual Lead
                    </button>
                </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Active Pipeline', val: metrics.total, trend: 'In-progress', icon: Users, color: 'text-indigo-600' },
                    { label: 'Urgent Reply', val: metrics.urgent, trend: 'Requires attention', icon: Activity, color: 'text-red-600' },
                    { label: 'High Potential', val: metrics.hot, trend: 'Hot leads', icon: BarChart3, color: 'text-orange-600' },
                    { label: 'Sales Velocity', val: metrics.conversion + '%', trend: 'Closed / Total', icon: Check, color: 'text-emerald-600' }
                ].map((m, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</span>
                            <m.icon size={16} className={m.color} />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">{m.val}</div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{m.trend}</p>
                    </div>
                ))}
            </div>

            {/* Lead Source Breakdown Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                        <PieChart size={16} className="text-slate-400" />
                        Omni-Channel Lead Source Breakdown
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Visual Chart Card */}
                    <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inbound Volume by Source</div>
                        </div>
                        <div className="flex-1 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sourceBreakdown} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="source"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                                        {sourceBreakdown.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    entry.source === 'Instagram' ? '#ec4899' :
                                                        entry.source === 'Google' ? '#3b82f6' :
                                                            entry.source === 'WhatsApp' ? '#22c55e' :
                                                                '#6366f1'
                                                }
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Summary List Card */}
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-4">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Detailed Distribution</div>
                        {sourceBreakdown.filter(s => ['WhatsApp', 'Instagram', 'Google'].includes(s.source) || s.total > 0).map((sourceData, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {/* @ts-ignore - Component passed as prop */}
                                        <SourceIcon source={sourceData.source} />
                                        <span className="text-xs font-bold text-slate-700">{sourceData.source === 'Google' ? 'Google Forms' : sourceData.source}</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900">{sourceData.total} Leads</span>
                                </div>
                                {/* Status Pills */}
                                <div className="flex flex-wrap gap-1">
                                    {Object.entries(sourceData.distribution).map(([status, count]) => (
                                        count > 0 && (
                                            <div key={status} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStatusConfig(status as Lead['status']).hex }}></span>
                                                {status}: {count}
                                            </div>
                                        )
                                    ))}
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                                    {Object.entries(sourceData.distribution).map(([status, count]) => {
                                        const percentage = (count / sourceData.total) * 100;
                                        if (count === 0) return null;
                                        return (
                                            <div
                                                key={status}
                                                style={{ width: `${percentage}%`, backgroundColor: getStatusConfig(status as Lead['status']).hex }}
                                                title={`${status}: ${count}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <DashboardView />
        </div>
    );
};

export default Dashboard;

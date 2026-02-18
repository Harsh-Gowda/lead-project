
import React from 'react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import { Lead, LEAD_STAGES, CompanySettings } from '../types';
import { TrendingUp, Trophy, Target } from '../components/Icons';

interface AnalyticsProps {
    leads: Lead[];
    settings: CompanySettings;
    getStageConfig: (stage: string) => any;
}

const Analytics: React.FC<AnalyticsProps> = ({ leads, settings, getStageConfig }) => {
    const stageData = LEAD_STAGES.map(stage => ({
        stage,
        count: leads.filter(l => l.lead_stage === stage).length,
        fill: getStageConfig(stage).hex,
    }));

    const pipelineValueData = LEAD_STAGES.map(stage => {
        const stageLeads = leads.filter(l => l.lead_stage === stage);
        const totalValue = stageLeads.reduce((sum, l) => sum + (l.estimated_value || 0), 0);
        const weightedValue = stageLeads.reduce((sum, l) => sum + ((l.estimated_value || 0) * (l.probability || 0) / 100), 0);
        return { stage, value: totalValue, weighted: Math.round(weightedValue), fill: getStageConfig(stage).hex };
    });

    const totalPipeline = leads.reduce((sum, l) => sum + (l.estimated_value || 0), 0);
    const weightedForecast = leads.reduce((sum, l) => sum + ((l.estimated_value || 0) * (l.probability || 0) / 100), 0);
    const wonRevenue = leads.filter(l => l.lead_stage === 'Won').reduce((sum, l) => sum + (l.estimated_value || 0), 0);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Performance Analytics</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Pipeline', value: `$${totalPipeline.toLocaleString()}`, icon: Target, color: '#3b82f6', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
                    { label: 'Weighted Forecast', value: `$${Math.round(weightedForecast).toLocaleString()}`, icon: TrendingUp, color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
                    { label: 'Won Revenue', value: `$${wonRevenue.toLocaleString()}`, icon: Trophy, color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
                ].map((kpi) => (
                    <div key={kpi.label} className={`${kpi.bg} border ${kpi.border} rounded-lg p-6 shadow-sm`}>
                        <div className="flex items-center gap-2 mb-2">
                            <kpi.icon size={16} className={kpi.text} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{kpi.label}</span>
                        </div>
                        <div className={`text-2xl font-bold ${kpi.text}`}>{kpi.value}</div>
                    </div>
                ))}
            </div>

            {/* Stage Funnel Chart */}
            <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Lead Stage Funnel</h2>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">Distribution of leads across pipeline stages</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        {LEAD_STAGES.map(stage => {
                            const config = getStageConfig(stage);
                            const count = leads.filter(l => l.lead_stage === stage).length;
                            return (
                                <div key={stage} className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.hex }}></span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{stage}: {count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} allowDecimals={false} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 700 }} />
                            <Bar dataKey="count" name="Leads" radius={[6, 6, 0, 0]}>
                                {stageData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pipeline Value by Stage */}
            <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
                <div className="mb-6">
                    <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Pipeline Value by Stage</h2>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">Estimated deal value and weighted forecast per stage</p>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pipelineValueData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 700 }} formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                            <Bar dataKey="value" name="Deal Value" radius={[6, 6, 0, 0]}>
                                {pipelineValueData.map((entry, index) => (
                                    <Cell key={`val-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                            <Bar dataKey="weighted" name="Weighted" radius={[6, 6, 0, 0]} opacity={0.5}>
                                {pipelineValueData.map((entry, index) => (
                                    <Cell key={`wt-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Budget Variance Chart */}
            <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
                <div className="mb-6">
                    <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Budget Variance</h2>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">Budget distribution across current lead dataset</p>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={leads.map((l, i) => ({ name: `L-${i + 1}`, budget: l.budget }))}>
                            <defs>
                                <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={settings.brandColor} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={settings.brandColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" hide />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="budget" stroke={settings.brandColor} fillOpacity={1} fill="url(#colorBudget)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

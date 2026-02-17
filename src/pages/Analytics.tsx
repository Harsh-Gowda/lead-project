
import React from 'react';
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import { Lead, CompanySettings } from '../types';

interface AnalyticsProps {
    leads: Lead[];
    settings: CompanySettings;
}

const Analytics: React.FC<AnalyticsProps> = ({ leads, settings }) => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Performance Analytics</h1>
            <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
                <div className="h-96 w-full">
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
                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500 max-w-lg mx-auto font-medium leading-relaxed italic">Budget variance across current lead dataset. Predictive conversion tracking enabled.</p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

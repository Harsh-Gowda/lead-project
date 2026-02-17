
import React from 'react';
import { Integration } from '../types';

interface IntegrationsProps {
    MOCK_INTEGRATIONS: Integration[];
}

const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => {
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
            {children}
        </span>
    );
};

const Integrations: React.FC<IntegrationsProps> = ({ MOCK_INTEGRATIONS }) => {
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Nodes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_INTEGRATIONS.map(int => (
                    <div key={int.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-start gap-5 hover:border-slate-300 transition-colors group">
                        <div className="w-12 h-12 bg-slate-50 rounded flex items-center justify-center font-bold text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0">
                            {/* Note: Icon rendering assumes MOCK_INTEGRATIONS passes string/component correctly, 
                  but in App.tsx it was checking int.icon as string logic. 
                  Here we render the icon if it's available or a placeholder */}
                            {int.icon}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-slate-900 text-sm tracking-tight">{int.name}</h3>
                                <Badge color={int.status === 'Connected' ? 'green' : 'slate'}>{int.status}</Badge>
                            </div>
                            <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">{int.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-300 uppercase">Synced {int.lastSync}</span>
                                <button className="text-[11px] font-bold text-indigo-600 hover:underline">Manage Node</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Integrations;

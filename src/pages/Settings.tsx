
import React from 'react';
import {
    ShieldCheck,
    PieChart,
    Layers,
    Briefcase,
    Database,
    Image as ImageIcon
} from '../components/Icons';
import { CompanySettings } from '../types';

interface SettingsProps {
    settings: CompanySettings;
    setSettings: (settings: CompanySettings) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeLogo: () => void;
}

const Settings: React.FC<SettingsProps> = ({
    settings,
    setSettings,
    fileInputRef,
    handleLogoUpload,
    removeLogo
}) => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Configuration</h1>
                <p className="text-sm text-slate-500 mt-0.5">Control module visibility and workspace settings.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Feature Control Card */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <ShieldCheck size={16} className="text-slate-400" />
                            Module Management
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <p className="text-xs text-slate-500 mb-2">Enable or disable core dashboard features.</p>
                        {[
                            { id: 'analytics', label: 'Performance Analytics', desc: 'Predictive modeling and sales velocity tracking.', icon: PieChart },
                            { id: 'integrations', label: 'External Ecosystem', desc: 'Real-time synchronization with social lead ads.', icon: Layers },
                            { id: 'team', label: 'Access Control', desc: 'Personnel hierarchy and performance metrics.', icon: Briefcase }
                        ].map(mod => (
                            <div key={mod.id} className="flex items-center justify-between p-4 rounded-md border border-slate-100 hover:border-slate-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-50 rounded text-slate-400"><mod.icon size={18} /></div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">{mod.label}</h3>
                                        <p className="text-xs text-slate-500 font-medium">{mod.desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, modules: { ...settings.modules, [mod.id]: !settings.modules[mod.id as keyof typeof settings.modules] } })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shadow-inner ${settings.modules[mod.id as keyof typeof settings.modules] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${settings.modules[mod.id as keyof typeof settings.modules] ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Database size={16} className="text-slate-400" />
                            Workspace Profile
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block">Company Branding</label>
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-lg border-2 border-slate-100 flex items-center justify-center overflow-hidden bg-slate-50" style={{ backgroundColor: settings.logoUrl ? 'transparent' : settings.brandColor }}>
                                    {settings.logoUrl ? (
                                        <img src={settings.logoUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white font-bold text-3xl">{settings.name.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 border border-slate-200 rounded-md text-xs font-bold hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <ImageIcon size={14} /> {settings.logoUrl ? 'Change Logo' : 'Upload Logo'}
                                        </button>
                                        {settings.logoUrl && (
                                            <button
                                                onClick={removeLogo}
                                                className="px-4 py-2 border border-red-100 text-red-600 rounded-md text-xs font-bold hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium italic">Recommended: Square image, 512x512px</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Business Label</label>
                            <input type="text" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Admin Email</label>
                            <input type="email" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none" />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block">System Accent</label>
                            <div className="flex gap-4">
                                {['#4f46e5', '#2563EB', '#10b981', '#f59e0b', '#ef4444', '#1e293b'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSettings({ ...settings, brandColor: color })}
                                        className={`w-8 h-8 rounded-full transition-all border-2 ${settings.brandColor === color ? 'ring-2 ring-slate-900 ring-offset-2' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                        <button className="px-6 py-2 bg-slate-900 text-white rounded-md text-xs font-bold hover:bg-slate-800 transition-all shadow-sm">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

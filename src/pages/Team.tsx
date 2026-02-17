
import React from 'react';
import { Plus } from '../components/Icons';
import { TeamMember } from '../types';

interface TeamProps {
    MOCK_TEAM: TeamMember[];
}

const Team: React.FC<TeamProps> = ({ MOCK_TEAM }) => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Access Management</h1>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold hover:bg-slate-800 shadow-sm transition-all active:scale-95">
                    <Plus size={14} /> Invite Personnel
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {MOCK_TEAM.map(member => (
                    <div key={member.id} className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm text-center">
                        <img src={member.avatar} className="w-16 h-16 rounded-full mx-auto mb-4 border border-slate-100 shadow-inner" alt={member.name} />
                        <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1 mb-8">{member.role}</p>
                        <div className="flex gap-2">
                            <button className="flex-1 py-1.5 border border-slate-200 rounded-md text-[10px] font-bold uppercase text-slate-500 hover:bg-slate-50">Profile</button>
                            <button className="flex-1 py-1.5 border border-slate-200 rounded-md text-[10px] font-bold uppercase text-slate-500 hover:bg-slate-50">Permissions</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Team;

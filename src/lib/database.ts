import { supabase } from './supabase';
import type { Lead, ActivityEvent } from '../types';

// =============================================
// DATABASE SERVICE — Supabase CRUD Operations
// Maps to tables: companies, leads, lead_activities, lead_notes, users
// =============================================

// ---------- LEADS ----------

export const leadsService = {
    /** Fetch all leads (optionally filter by company) */
    async getAll(companyId?: string) {
        let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (companyId) query = query.eq('company_id', companyId);
        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    /** Fetch a single lead by ID */
    async getById(id: string) {
        const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    /** Create a new lead */
    async create(lead: Partial<Lead>) {
        const { data, error } = await supabase.from('leads').insert(lead).select().single();
        if (error) throw error;
        return data;
    },

    /** Update an existing lead */
    async update(id: string, updates: Partial<Lead>) {
        const { data, error } = await supabase
            .from('leads')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    /** Delete a lead */
    async delete(id: string) {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) throw error;
    },
};

// ---------- LEAD ACTIVITIES (Timeline Events) ----------

export const activitiesService = {
    /** Fetch all activities for a lead, newest first */
    async getByLeadId(leadId: string) {
        const { data, error } = await supabase
            .from('lead_activities')
            .select('*')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    /** Fetch recent activities across all leads (for notifications) */
    async getRecent(limit = 20) {
        const { data, error } = await supabase
            .from('lead_activities')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data;
    },

    /** Log a new activity event */
    async create(activity: {
        lead_id: string;
        type: string;
        description: string;
        user?: string;
        meta?: string;
    }) {
        const { data, error } = await supabase
            .from('lead_activities')
            .insert({ ...activity, created_at: new Date().toISOString() })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    /** Log an activity (alias for create) */
    async log(lead_id: string, type: string, description: string, user?: string, meta?: string) {
        return this.create({ lead_id, type, description, user, meta });
    },
};

// ---------- LEAD NOTES ----------

export const notesService = {
    /** Fetch all notes for a lead */
    async getByLeadId(leadId: string) {
        const { data, error } = await supabase
            .from('lead_notes')
            .select('*')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    /** Create a new note */
    async create(note: { lead_id: string; content: string; created_by?: string }) {
        const { data, error } = await supabase
            .from('lead_notes')
            .insert({ ...note, created_at: new Date().toISOString() })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    /** Delete a note */
    async delete(id: string) {
        const { error } = await supabase.from('lead_notes').delete().eq('id', id);
        if (error) throw error;
    },
};

// ---------- COMPANIES ----------

export const companiesService = {
    /** Fetch all companies */
    async getAll() {
        const { data, error } = await supabase.from('companies').select('*').limit(1);
        if (error) throw error;
        return data;
    },

    /** Create a new company */
    async create(company: { name: string; email: string }) {
        const { data, error } = await supabase.from('companies').insert(company).select().single();
        if (error) throw error;
        return data;
    },

    /** Fetch company by ID */
    async getById(id: string) {
        const { data, error } = await supabase.from('companies').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    /** Update company settings */
    async update(id: string, updates: Record<string, any>) {
        const { data, error } = await supabase
            .from('companies')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
};

// ---------- USERS ----------

export const usersService = {
    /** Fetch user by auth ID */
    async getByAuthId(authId: string) {
        const { data, error } = await supabase.from('users').select('*').eq('auth_id', authId).single();
        if (error) throw error;
        return data;
    },

    /** Fetch all users for a company (team members) */
    async getByCompanyId(companyId: string) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    /** Create a new user */
    async create(user: { auth_id: string; email: string; name: string; company_id: string; role?: string }) {
        const { data, error } = await supabase.from('users').insert(user).select().single();
        if (error) throw error;
        return data;
    },

    /** Update user profile */
    async update(id: string, updates: Record<string, any>) {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
};

// ---------- AUTH HELPERS ----------

export const authService = {
    /** Sign up with email/password */
    async signUp(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data;
    },

    /** Sign in with email/password */
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    /** Sign out */
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /** Get current session */
    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    /** Listen for auth state changes */
    onAuthStateChange(callback: (event: string, session: any) => void) {
        return supabase.auth.onAuthStateChange(callback);
    },
};

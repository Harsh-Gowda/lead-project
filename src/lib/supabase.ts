import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Supabase credentials missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
    );
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

// Quick connection test — only if credentials are configured
if (supabaseUrl && supabaseAnonKey) {
    supabase.from('leads').select('id', { count: 'exact', head: true }).then(({ count, error }) => {
        if (error) {
            console.warn('⚠️ Supabase connection issue (table may not exist yet):', error.message);
        } else {
            console.log(`✅ Supabase connected! Found ${count ?? 0} leads in your database.`);
        }
    });
}

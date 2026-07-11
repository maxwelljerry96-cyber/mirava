export const supabaseConfigured=()=>Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
export const adminConfigured=()=>Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY);
export const appUrl=()=>process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000';

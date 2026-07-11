import {createClient} from '@supabase/supabase-js';
export function createAdminClient(){const u=process.env.NEXT_PUBLIC_SUPABASE_URL,k=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!u||!k)throw new Error('Supabase admin access is not configured.');return createClient(u,k,{auth:{autoRefreshToken:false,persistSession:false}})}

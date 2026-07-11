import {redirect} from 'next/navigation';import {supabaseConfigured} from '@/lib/env';import {createClient} from '@/lib/supabase/server';
export async function getCurrentUser(){if(!supabaseConfigured())return null;try{const s=await createClient();return (await s.auth.getUser()).data.user}catch{return null}}
export async function requireUser(){const user=await getCurrentUser();if(!user)redirect('/auth/login?next=/account');return user}
export async function requireAdmin(){const user=await requireUser();const s=await createClient();const {data:profile}=await s.from('profiles').select('role,full_name').eq('id',user.id).maybeSingle();if(profile?.role!=='admin')redirect('/account');return{user,profile}}

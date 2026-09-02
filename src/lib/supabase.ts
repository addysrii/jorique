import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  'https://placeholder-project.supabase.co';

const supabaseAnonKey =
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'placeholder-anon-key';

if (
  (!import.meta.env.SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL) ||
  (!import.meta.env.SUPABASE_ANON_KEY && !import.meta.env.VITE_SUPABASE_ANON_KEY)
) {
  console.warn('[JORIQUE] SUPABASE_URL or SUPABASE_ANON_KEY is not defined. Using fallback client.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


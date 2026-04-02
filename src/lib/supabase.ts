import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_APP_DB_URL
const supabaseAnonKey = import.meta.env.VITE_APP_DB_REF

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
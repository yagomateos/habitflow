import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sknsmnwxscgbjojpljie.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbnNtbnd4c2NnYmpvanBsamllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4OTA2ODcsImV4cCI6MjA3NDQ2NjY4N30.Ojh1s8CYO9JNeO6mJakBAR8H_Exkn5i6rHfASOflqx4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
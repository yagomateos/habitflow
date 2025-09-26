import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vziqmfnvppkdocpqvjmv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aXFtZm52cHBrZG9jcHF2am12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MzQ4ODAsImV4cCI6MjAyNTQxMDg4MH0.0iEOtJz_2E0QkbXL-qJdkGWR0G2VlJJOTk8k5z5n5Ew'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})
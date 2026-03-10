import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ddlggyiwnymqxuyszhuv.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbGdneWl3bnltcXh1eXN6aHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQ2ODQsImV4cCI6MjA4ODY2MDY4NH0.sEbm7WkrswyZabIYWFrklsHmuoVxgT3lUlwyuFyb-SU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

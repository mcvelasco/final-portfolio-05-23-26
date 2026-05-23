import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jntzltqjmxaxjnrhhubo.supabase.co'
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudHpsdHFqbXhheGpucmhodWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNjA2NTMsImV4cCI6MjA5NDkzNjY1M30.Fo2iTo3t9IM3rNjfv3tgaQvdvu1kjyoWpCgzWomQH8I";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
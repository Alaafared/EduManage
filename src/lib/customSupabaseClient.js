import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifrvwmpqtkklcfzhwnly.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcnZ3bXBxdGtrbGNmemh3bmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MDA1NjIsImV4cCI6MjA2NjM3NjU2Mn0.jaEPrJvz6hsEYX5mwna3t_HO6n6yNeJqGnVXFEkHk_A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
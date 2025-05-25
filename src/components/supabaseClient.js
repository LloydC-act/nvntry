import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dkavjnokcamyqaxcdtoy.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYXZqbm9rY2FteXFheGNkdG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjA0OTIsImV4cCI6MjA2MTMzNjQ5Mn0.u5Oox7YEHUOJ3tjLeHGG79iMZ5rh7emxKst2GKVmm6I'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
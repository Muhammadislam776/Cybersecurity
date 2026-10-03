import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sobpigutulzbfnkblwtl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvYnBpZ3V0dWx6YmZua2Jsd3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3ODI5NzcsImV4cCI6MjEwNjM1ODk3N30.xSUchI_czqeSMBN0esYUJmEih2U2Z9zq7gv4hwqbRhs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Helper health-check function to verify table availability
export async function checkSupabaseConnection(): Promise<{ connected: boolean; tablesFound: boolean; message: string }> {
  try {
    const { data, error } = await supabase.from('incidents').select('id').limit(1);
    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('schema cache')) {
        return {
          connected: true,
          tablesFound: false,
          message: 'Connected to Supabase, but database tables are not yet created. Run the setup SQL script in Supabase SQL Editor.'
        };
      }
      return {
        connected: false,
        tablesFound: false,
        message: `Supabase Error: ${error.message}`
      };
    }
    return {
      connected: true,
      tablesFound: true,
      message: 'Connected to Supabase successfully. Database tables verified.'
    };
  } catch (err: any) {
    return {
      connected: false,
      tablesFound: false,
      message: err.message || 'Failed to connect to Supabase endpoint'
    };
  }
}

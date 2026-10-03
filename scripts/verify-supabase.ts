import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://sobpigutulzbfnkblwtl.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvYnBpZ3V0dWx6YmZua2Jsd3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3ODI5NzcsImV4cCI6MjEwNjM1ODk3N30.xSUchI_czqeSMBN0esYUJmEih2U2Z9zq7gv4hwqbRhs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TABLES = [
  'users',
  'incidents',
  'alerts',
  'evidence',
  'tasks',
  'approvals',
  'diagnostics',
  'timeline',
  'audit_logs',
  'integrations',
  'simulations',
  'runbooks',
  'live_events'
];

async function verify() {
  console.log(`Checking Supabase connection to: ${supabaseUrl}\n`);
  let tablesReady = 0;

  for (const table of TABLES) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ Table '${table}': ${error.message}`);
      } else {
        console.log(`✅ Table '${table}': Ready (Records: ${count ?? 0})`);
        tablesReady++;
      }
    } catch (err: any) {
      console.log(`❌ Table '${table}': Error ${err.message}`);
    }
  }

  console.log(`\nResult: ${tablesReady} of ${TABLES.length} tables verified in Supabase.`);
  if (tablesReady === 0) {
    console.log(`\nAction Required: Copy the contents of 'supabase_complete_setup.sql' and run it in the Supabase SQL Editor.`);
  }
}

verify();

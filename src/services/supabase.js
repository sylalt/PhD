import { createClient } from '@supabase/supabase-js';

export const OWNER_USER_ID = '6e9fd2bb-70b5-4e82-b056-a4ae02e340bc';
export const supabase = createClient(
  'https://dnzakxazxnwqlyympaws.supabase.co',
  'sb_publishable_CXf1cVcvezYZ_Y05VCiPMw_Zd2CpQ5v',
  {
    auth: {
      storage: window.sessionStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  }
);

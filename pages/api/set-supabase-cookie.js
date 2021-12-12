import { supabase } from 'utils/supabase';

async function handler(req, res) {
  await supabase.auth.api.setAuthCookie(req, res);
}

export default handler;

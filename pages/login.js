import { useEffect } from 'react';
import { supabase } from 'utils/supabase';

function LoginPage() {
  useEffect(() => {
    supabase.auth.signIn({
      provider: 'github',
    });
  }, []);

  return <div>Loggin ....</div>;
}

export default LoginPage;

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { supabase } from 'utils/supabase';

function Logout() {
  const router = useRouter();
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      router.push('/');
    };
    logout();
  }, []);
  return <div>Logout</div>;
}

export default Logout;

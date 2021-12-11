import { useUser } from 'context/user';
import { useEffect } from 'react';

function Logout() {
  const { logout } = useUser();
  useEffect(() => {
    logout();
  }, []);
  return <div>Logout...</div>;
}

export default Logout;

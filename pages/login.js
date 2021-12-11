import { useUser } from 'context/user';
import { useEffect } from 'react';

function LoginPage() {
  const { login } = useUser();

  useEffect(() => {
    login();
  }, []);

  return <div>Loggin ....</div>;
}

export default LoginPage;

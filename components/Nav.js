import { useUser } from 'context/user';
import Link from 'next/link';

function Nav() {
  const { user } = useUser();

  return (
    <div className="shadow-gray-300 shadow-md">
      <ul className="text-lg flex py-8 px-10">
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        {!!user && (
          <Link href="/dashboard">
            <a className="ml-2">Dashboard</a>
          </Link>
        )}
        <li className="ml-2">
          <Link href="/pricing">
            <a>Pricing</a>
          </Link>
        </li>
        {/* {user && (
          <li className="ml-7 text-gray-500">
            Welcome {user?.user_metadata.full_name}!
          </li>
        )} */}
        <li className="ml-auto">
          <Link href={`/${user ? 'logout' : 'login'}`}>
            <a suppressHydrationWarning>{user ? 'Logout' : 'Login'}</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav;

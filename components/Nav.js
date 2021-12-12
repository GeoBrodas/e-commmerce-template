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
        <li className="ml-5">
          <Link href="/pricing">
            <a>Pricing</a>
          </Link>
        </li>
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

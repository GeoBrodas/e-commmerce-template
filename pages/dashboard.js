import axios from 'axios';
import { useUser } from 'context/user';
import { supabase } from 'utils/supabase';
import { useRouter } from 'next/router';
import Head from 'next/head';

function DashboardPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const loadPortal = async () => {
    const { data } = await axios.get('/api/portal');
    router.push(data.url);
  };

  return (
    <div className="w-full mx-auto py-16 px-8">
      <Head>
        <title>Dashboard</title>
      </Head>

      <p className="text-3xl font-semibold underline decoration-orange-300">
        Dashboard
      </p>

      <div className="my-4">
        {!!user && (
          <p className="text-gray-600 text-lg">
            Welcome {user?.user_metadata.full_name}
          </p>
        )}
        <div className="my-2 font-semibold">
          {!isLoading && (
            <>
              <p>
                {user?.is_subscribed
                  ? ` Subscribed : ${user.interval}`
                  : 'Not subscribed'}
              </p>
              <button onClick={loadPortal}>Manage Subscription</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  //   if no user redirect to login page
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}

export default DashboardPage;

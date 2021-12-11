import Head from 'next/head';
import Link from 'next/link';

import { supabase } from 'utils/supabase';

export default function Home({ lessons }) {
  console.log(supabase.auth.user());

  return (
    <div className="grid place-content-center my-10 w-screen">
      <Head>
        <title>FlexIt</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <div className="grid grid-cols-2 place-content-center items-center whitespace-nowrap space-x-7 w-auto">
        {lessons.map((item) => (
          <Link key={item.id} href={`/${item.id}`}>
            <a>
              <h4 className="text-center font-semibold my-2 border-2 p-4 w-auto bg-gradient-to-r from-gray-200 to-gray-100 rounded-md">
                {item.title}
              </h4>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const { data: lessons } = await supabase.from('lesson').select('*');
  return {
    props: {
      lessons,
    },
  };
}

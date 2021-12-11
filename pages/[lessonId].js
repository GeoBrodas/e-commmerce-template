import { supabase } from 'utils/supabase';

import Head from 'next/head';

function SingleLesson({ lessons }) {
  return (
    <div className="my-10 mx-5 w-auto">
      <Head>
        <title>{lessons.title}</title>
        <meta name="description" content={lessons.description} />
      </Head>

      <h1 className="text-4xl font-bold">{lessons.title}</h1>
      <p className="my-5">{lessons.description}</p>
    </div>
  );
}

export async function getStaticPaths() {
  // returns only the ids of the lessons
  const { data: lessons } = await supabase.from('lesson').select('id');

  const paths = lessons.map(({ id }) => ({
    params: { lessonId: id.toString() },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const lessonId = context.params.lessonId;

  // returns result that matches the id
  const { data: lessons } = await supabase
    .from('lesson') // table
    .select('*') // select all columns
    .eq('id', lessonId) // where id is equal to the id in the url
    .single(); // return only one result

  return {
    props: { lessons },
  };
}

export default SingleLesson;

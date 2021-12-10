import { supabase } from 'utils/supabase';

function SingleLesson({ lessons }) {
  console.log(lessons);
  return (
    <div>
      <h1>{lessons.title}</h1>
      <p>{lessons.description}</p>
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

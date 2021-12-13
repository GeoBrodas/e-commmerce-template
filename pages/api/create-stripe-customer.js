import initStripe from 'stripe';
import { getServiceSupabase } from '../../utils/supabase';

// req.body.record maps to the funtion hook which is triggered on the supabase server !! keep this format !!

async function handler(req, res) {
  // attach secret key to query parameter in fecth req
  if (req.query.API_ROUTE_KEY !== process.env.API_ROUTE_KEY) {
    return res.status(401).send('Unauthorized - No API_ROUTE_KEY found!');
  }

  // check if records are present in request body in record
  if (!req.body.record)
    return res
      .status(400)
      .send('No record found! Looks like a unauthorized breach!');

  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  const customer = await stripe.customers.create({
    email: req.body.record.email,
  });

  // bypass RLS
  const supabase = getServiceSupabase();

  await supabase
    .from('profile')
    .update({
      stripe_customer: customer.id,
    })
    .eq('id', req.body.record.id);

  res.send({ message: `Customer created: ${customer.id}` });
}

export default handler;

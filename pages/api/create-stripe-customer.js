import initStripe from 'stripe';
import { supabase } from '../../utils/supabase';

async function handler(req, res) {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  const customer = await stripe.customers.create({
    email: req.body.record.email,
  });

  await supabase
    .from('profile')
    .update({
      stripe_customer: customer.id,
    })
    .eq('id', req.body.record.id);

  res.send({ message: `Customer created: ${customer.id}` });
}

export default handler;

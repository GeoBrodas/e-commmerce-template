import initStripe from 'stripe';
import { buffer } from 'micro';
import { getServiceSupabase } from 'utils/supabase';

export const config = { api: { bodyParser: false } };

async function handler(req, res) {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers['stripe-signature'];
  const signingSecret = process.env.STRIPE_SIGNING_SECRET;
  const reqBuffer = await buffer(req);

  let event;

  // the req.body stripe expects here is not the intended one -> hence install micro

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
  } catch (error) {
    console.log(error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // use a switch case to accordingly update the stripe_customer on supabase
  const supabase = getServiceSupabase();

  switch (event.type) {
    case 'customer.subscription.updated':
      await supabase
        .from('profile')
        .update({
          is_subscribed: true,
          interval: event.data.object.items.data[0].plan.interval,
        })
        .eq('stripe_customer', event.data.object.customer);
      break;

    case 'customer.subscription.deleted':
      await supabase
        .from('profile')
        .update({ is_subscribed: false, interval: null })
        .eq('stripe_customer', event.data.object.customer);
      break;
  }

  console.log({ event });
  res.send({ recieved: true });
}

export default handler;

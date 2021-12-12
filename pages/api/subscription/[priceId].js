import { supabase } from 'utils/supabase';
import cookie from 'cookie';
import initStripe from 'stripe';

async function handler(req, res) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) return res.status(401).send('Unauthorized');

  const token = cookie.parse(req.headers.cookie)['sb:token'];

  // returns an object setting a new token
  supabase.auth.session = () => ({
    access_token: token,
  });

  const {
    data: { stripe_customer },
  } = await supabase
    .from('profile')
    .select('stripe_customer')
    .eq('id', user.id)
    .single();

  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const { priceId } = req.query;

  // set the checkout list
  const lineItems = [
    {
      price: priceId,
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    customer: stripe_customer,
    mode: 'subscription',
    success_url: 'http://localhost:3000/payment/success',
    cancel_url: 'http://localhost:3000/payment/cancelled',
  });

  res.send({ id: session.id });
}

export default handler;

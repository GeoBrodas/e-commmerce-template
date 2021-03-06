import initStripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

import { useUser } from 'context/user';

import Head from 'next/head';
import Link from 'next/link';

function PricingPage({ plans }) {
  const { user, login, isLoading } = useUser();

  const showSubscribeButton = !!user && !user.is_subscribed;
  const showCreateAccountButton = !user;
  const showManageSubscriptionsButton = !!user && user.is_subscribed;

  const processSubscription = (planId) => async () => {
    const { data } = await axios.get(`/api/subscription/${planId}`);

    // load stripe js script to process checkout
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className="m-10">
      <Head>
        <title>Pricing</title>
        <meta name="description" content="Pricing page for premium content" />
      </Head>

      <h2 className="text-center text-3xl font-bold underline decoration-orange-300 mb-10">
        Subscription plans
      </h2>
      <div className="flex flex-col md:flex-row items-center md:space-x-10 space-y-5 md:space-y-0 justify-center">
        {plans.map((plan) => (
          <div
            className="rounded-md border-slate-200 border-2 shadow-md w-1/6 md:w-2/6 pl-2 py-5 px-2"
            key={plan.id}
          >
            <h2 className="font-semibold text-xl">{plan.name}</h2>
            <p className="text-gray-500 mb-2">
              {plan.currency.toUpperCase()} {plan.price / 100} / {plan.interval}
            </p>

            {/* conditional rendering */}
            {!isLoading && (
              <div>
                {showSubscribeButton && (
                  <button
                    onClick={processSubscription(plan.id)}
                    className="bg-orange-300 rounded-md p-2 mt-2"
                  >
                    Subscribe!
                  </button>
                )}
                {showCreateAccountButton && (
                  <button
                    onClick={login}
                    className="bg-orange-300 rounded-md p-2 mt-2"
                  >
                    Create Account
                  </button>
                )}
                {showManageSubscriptionsButton && (
                  <Link href="/dashboard">
                    <a className="bg-orange-300 text-sm md:text-base whitespace-nowrap rounded-md p-2">
                      Manage Subscription!
                    </a>
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product);
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        currency: price.currency,
        interval: price.recurring.interval,
      };
    })
  );

  const sortedPlans = plans.sort((a, b) => a.price - b.price);

  return {
    props: {
      plans: sortedPlans,
    },
  };
}

export default PricingPage;

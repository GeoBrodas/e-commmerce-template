import initStripe from 'stripe';
import { useUser } from 'context/user';

import Head from 'next/head';

function PricingPage({ plans }) {
  const { user, login, isLoading } = useUser();

  const showSubscribeButton = !!user && !user.is_subscribed;
  const showCreateAccountButton = !user;
  const showManageSubscriptionsButton = !!user && user.is_subscribed;

  return (
    <div className="m-10">
      <Head>
        <title>Pricing</title>
        <meta name="description" content="Pricing page for premium content" />
      </Head>

      <h2 className="text-center text-3xl font-bold underline decoration-orange-300 mb-10">
        Subscription plans
      </h2>
      <div className="flex flex-col md:flex-row items-center md:space-x-5 space-y-5 md:space-y-0 justify-center">
        {plans.map((plan) => (
          <div
            className="rounded-md border-slate-200 border-2 shadow-md w-2/6 md:w-1/6 pl-2 py-5 px-2"
            key={plan.id}
          >
            <h2 className="font-semibold text-xl">{plan.name}</h2>
            <p className="text-gray-500">
              {plan.currency.toUpperCase()} {plan.price / 100} / {plan.interval}
            </p>

            {/* conditional rendering */}
            {!isLoading && (
              <div>
                {showSubscribeButton && (
                  <button className="bg-orange-300 rounded-md p-2 mt-2">
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
                  <button className="bg-orange-300 rounded-md p-2 mt-2">
                    Manage Subscription!
                  </button>
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

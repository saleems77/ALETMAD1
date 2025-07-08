'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentMethodSelector from './PaymentMethodSelector';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentMethodSelector onPaymentMethodSelected={(pm) => console.log(pm)} />
    </Elements>
  );
}
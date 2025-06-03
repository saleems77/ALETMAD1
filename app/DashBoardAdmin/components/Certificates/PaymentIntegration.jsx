'use client';
import { loadStripe } from '@stripe/stripe-js';

const PaymentIntegration = ({ amount, onSuccess }) => {
  const handlePayment = async () => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    
    const { sessionId } = await response.json();
    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <Button type="primary" size="large" onClick={handlePayment}>
      اتمام الشرح ({amount} ر.س)
    </Button>
  );
};
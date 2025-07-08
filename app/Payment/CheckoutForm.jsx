import React from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ checkout }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe.js has not loaded yet');
      return;
    }

    const result = await checkout.confirm();

    if (result.error) {
      console.error(result.error);
    } else {
      console.log('Payment successful!');
      // يمكنك هنا توجيه المستخدم إلى صفحة النجاح
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
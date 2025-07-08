import React, { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import PaymentMethodSelector from './PaymentMethodSelector';

const PaymentForm = ({ amount, currency, userId }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const stripe = useStripe();

  const handlePaymentMethodSelected = (selectedPaymentMethod) => {
    setPaymentMethod(selectedPaymentMethod);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !paymentMethod) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, userId }),
      });

      const { clientSecret } = await response.json();

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Payment successful, save to database
        await savePaymentToDatabase(paymentIntent);
        alert('الدفع تم بنجاح!');
      }
    } catch (error) {
            console.error('Error in handleSubmit:', error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const savePaymentToDatabase = async (paymentIntent) => {
    try {
      const response = await fetch('/api/save-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          paymentMethod: paymentIntent.payment_method_types[0],
          status: paymentIntent.status,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save payment to database');
      }
    } catch (error) {
      console.error('Error saving payment to database:', error);
    }
  };

  return (
    <div>
      <h2>إتمام الدفع</h2>
      <PaymentMethodSelector onPaymentMethodSelected={handlePaymentMethodSelected} />
      {paymentMethod && (
        <form onSubmit={handleSubmit}>
          <button type="submit" disabled={loading}>
            {loading ? 'جاري الدفع...' : 'إتمام الدفع'}
          </button>
        </form>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default PaymentForm;
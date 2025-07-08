import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentMethodSelector = ({ onPaymentMethodSelected }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // تحقق من وجود stripe و elements
    if (!stripe || !elements) {
      console.error('Stripe.js has not loaded yet.');
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        console.error('Card Element not found');
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error('Error creating payment method:', error);
        // يمكنك هنا عرض رسالة خطأ للمستخدم
      } else {
        console.log('Payment method created successfully:', paymentMethod);
        onPaymentMethodSelected(paymentMethod);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      // يمكنك هنا عرض رسالة خطأ عامة للمستخدم
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          بطاقة الائتمان
        </label>
      </div>
      {paymentMethod === 'card' && <CardElement />}
      <button type="submit">تأكيد طريقة الدفع</button>
    </form>
  );
};

export default PaymentMethodSelector;
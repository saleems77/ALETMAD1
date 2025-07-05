import { stripePromise } from '../lib/stripe';

export default function PaymentButton({ items, userId }) {
  const handlePayment = async () => {
    const stripe = await stripePromise;
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, userId })
    });
    
    const { sessionId } = await response.json();
    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <button 
      onClick={handlePayment}
      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
    >
      ادفع الآن
    </button>
  );
}

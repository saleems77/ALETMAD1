//app/payment/webhook.jsx
export default async function handler(req, res) {
  await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/payments/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  
  res.status(200).json({ received: true });
}

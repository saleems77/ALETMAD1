import PaymentComponent from './page';

export default function CheckoutPage() {
  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    // يمكنك هنا تحديث حالة الطلب في قاعدة البيانات الخاصة بك
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    // يمكنك هنا معالجة الخطأ، مثل عرض رسالة للمستخدم
  };

  return (
    <div>
      <h1>Checkout</h1>
      <PaymentComponent 
        amount={100} // مبلغ الدفع بالدولار
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}
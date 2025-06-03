'use client';
import { CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export default function PaymentMethodSelector() {
  const [selectedMethod, setSelectedMethod] = useState('credit');

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => setSelectedMethod('credit')}
        className={`p-4 border rounded-lg flex items-center gap-2 ${
          selectedMethod === 'credit' ? 'border-blue-500 bg-blue-50' : ''
        }`}
      >
        <CreditCardIcon className="w-6 h-6" />
        بطاقة ائتمانية
      </button>
      
      <button
        onClick={() => setSelectedMethod('transfer')}
        className={`p-4 border rounded-lg flex items-center gap-2 ${
          selectedMethod === 'transfer' ? 'border-blue-500 bg-blue-50' : ''
        }`}
      >
        <BanknotesIcon className="w-6 h-6" />
        تحويل بنكي
      </button>
    </div>
  );
}
'use client';
import { useState } from 'react';
import { Calculator, Coins } from 'lucide-react';
import Swal from 'sweetalert2';

// بيانات وهمية مع هيكل واضح
const mockSalesData = [
  { id: 1, amount: 5000, date: '2024-03-01' },
  { id: 2, amount: 7500, date: '2024-03-05' },
  { id: 3, amount: 3000, date: '2024-03-10' }
];

const useMockSalesData = () => {
  const [sales, setSales] = useState(mockSalesData);
  
  const updateSales = (newSales) => {
    setSales(newSales);
    // هنا يمكن إضافة أي منطق لـ "حفظ" البيانات
  };
  
  return { sales, updateSales };
};

const PayoutsCalculator = () => {
  const { sales, updateSales } = useMockSalesData();
  const [commissionRate, setCommissionRate] = useState(20);

  const calculateCommissions = () => {
    return sales.map(sale => ({
      ...sale,
      commission: sale.amount * (commissionRate / 100),
      status: 'pending'
    }));
  };

  const handleApprove = () => {
    const payouts = calculateCommissions();
    Swal.fire({
      title: 'تمت الموافقة!',
      text: `تم اعتماد ${payouts.length} صرفية`,
      icon: 'success'
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-bold">حساب المستحقات</h2>
      </div>

      <div className="mb-6">
        <label className="block mb-2">نسبة العمولة (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={commissionRate}
          onChange={(e) => setCommissionRate(Math.min(100, Math.max(0, e.target.value)))}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">المبلغ</th>
              <th className="p-3 text-right">العمولة</th>
              <th className="p-3 text-right">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {calculateCommissions().map((sale) => (
              <tr key={sale.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{sale.amount.toLocaleString()} ر.س</td>
                <td className="p-3 text-green-600">
                  {sale.commission.toFixed(2)} ر.س
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleApprove}
        className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center justify-center gap-2"
      >
        <Coins className="w-5 h-5" />
        اعتماد الصرفيات
      </button>
    </div>
  );
};

export default PayoutsCalculator;
export default function TransactionItem({ date, amount, type, description }) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
        <div>
          <p className="font-medium">{description}</p>
          <p className="text-sm text-gray-500">{new Date(date).toLocaleDateString('ar-SA')}</p>
        </div>
        <span className={`${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
          {type === 'income' ? '+' : '-'} {amount} ر.س
        </span>
      </div>
    );
  }
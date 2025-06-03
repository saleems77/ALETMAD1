const SummaryCard = ({ title, value, trend, color }) => {
  const trendIcons = {
    up: '▲',
    down: '▼',
    neutral: '➔'
  };

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    orange: 'bg-orange-100 text-orange-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className={`${colorClasses[color]} p-4 rounded-lg shadow`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <span className={`text-xl ${
          trend === 'up' ? 'text-green-600' :
          trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {trendIcons[trend]}
        </span>
      </div>
    </div>
  );
};

export default SummaryCard;
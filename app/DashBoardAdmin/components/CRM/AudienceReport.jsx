import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AudienceReport = ({ 
    countries = [], // قيمة افتراضية للمصفوفات
    devices = { desktop: 0, mobile: 0, tablet: 0 } // قيمة افتراضية للكائن
  }) => {  const deviceData = [
    { name: 'Desktop', value: devices.desktop },
    { name: 'Mobile', value: devices.mobile },
    { name: 'Tablet', value: devices.tablet },
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="audience-report bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">توزيع الجمهور</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-3">التوزيع الجغرافي</h3>
          <ul className="space-y-2">
            {countries.map((country, index) => (
              <li key={index} className="flex justify-between">
                <span>{country.country}</span>
                <span>{country.visits.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-3">أجهزة المستخدمين</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceReport;
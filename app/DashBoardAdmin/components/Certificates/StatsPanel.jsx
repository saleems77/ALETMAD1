function StatsPanel() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي الشهادات" value="2,345" trend="+12.5%" />
        <StatCard title="الشهادات المدفوعة" value="1,230" trend="+8.2%" />
        <StatCard title="إيرادات الشهادات" value="45,800 ر.س" trend="+23.1%" />
        <StatCard title="الشهادات المنتهية" value="89" trend="-3.4%" />
      </div>
    );
  }
  export default StatsPanel;
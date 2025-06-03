// app/dashboard/automation/page.tsx
import CanvasArea from './CanvasArea';
import NodeLibrary from './NodeLibrary';
import StatsOverview from './StatsOverview';
import TemplateGallery from './TemplateGallery';
export default function AutomationDashboard() {
  return (
    <div className="grid grid-cols-4 h-screen">
      {/* Sidebar */}
      <div className="col-span-1 bg-white border-r">
        <NodeLibrary />
        <TemplateGallery />
      </div>

      {/* Main Canvas */}
      <div className="col-span-3">
        <CanvasArea />
        <StatsOverview />
      </div>
    </div>
  );
}
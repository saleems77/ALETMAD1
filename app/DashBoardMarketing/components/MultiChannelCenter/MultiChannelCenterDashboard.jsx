// app/admin/dashboard/page.jsx
"use client"
export const dynamic = 'force-dynamic';
import MultiChannelCenter from "./MultiChannelCenter";
import CustomerFunnel from "./CustomerFunnel";
import SmartTags from "./SmartTags";
import LeadTracking from "./LeadTracking";
import  CustomerFunnelView from "./CustomerFunnelView";

const MultiChannelCenterDashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <MultiChannelCenter />
      </div>
      <div className="col-span-8">
        <CustomerFunnel />
      </div>
      <div className="col-span-4">
        <SmartTags />
      </div>
      <div className="col-span-12">
        <LeadTracking />
      </div>
      <div className="col-span-12">
        <CustomerFunnelView />
      </div>
    </div>
  );
};
export default MultiChannelCenterDashboard;
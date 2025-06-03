// app/components/CustomerFunnelView.jsx
"use client";
import ReactFlow, { Controls } from "reactflow";
import { funnelNodes, funnelEdges } from "./funnel-data";

const CustomerFunnelView = () => {
  return (
    <div className="w-full h-[600px] border rounded-lg">
      <ReactFlow nodes={funnelNodes} edges={funnelEdges}>
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default CustomerFunnelView;
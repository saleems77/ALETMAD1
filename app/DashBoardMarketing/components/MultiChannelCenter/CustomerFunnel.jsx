// app/components/CustomerFunnel.jsx
"use client";
import ReactFlow, { useNodesState, useEdgesState } from "reactflow";
import {funnelData} from "./funnel-data";
import { useMemo } from "react";

const CustomerFunnel = () => {
  const nodes = useMemo(() => funnelData.nodes, []);
  const edges = useMemo(() => funnelData.edges, []);
  return (
    <div className="react-flow-container">
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
};
export default CustomerFunnel;
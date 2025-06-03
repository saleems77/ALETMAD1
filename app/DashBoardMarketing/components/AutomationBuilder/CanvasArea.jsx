"use client";
import { DndContext, useDraggable } from "@dnd-kit/core";
import ReactFlow from "reactflow"; 
import useAutomationStore from "./AutomationContext";

// دالة بسيطة لمعالجة انتهاء السحب (يمكنك تعديلها بناءً على منطق التطبيق)
function handleDragEnd(event) {
  // يمكن إضافة المنطق المناسب هنا حسب احتياجات التطبيق
  console.log("Drag ended", event);
}

// تعريف أنواع العقد في حال كنت تستخدمها
const nodeTypes = {
  // يمكنك تعريف أنواع العقد الخاصة بك هنا إذا كانت مخصصة
};

export default function CanvasArea() {
  const { nodes, edges, onNodesChange, onEdgesChange } = useAutomationStore();
  const { setNodeRef } = useDraggable({ id: "canvas" });

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div ref={setNodeRef} className="canvas-area bg-gray-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          // تأكد من تعريف connectionLineComponent إذا كنت تستخدمه
          // connectionLineComponent={CustomConnectionLine}
        />
      </div>
    </DndContext>
  );
}

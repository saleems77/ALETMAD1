"use client"
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast, Toaster } from 'react-hot-toast';
import {
  PlayIcon,
  PlusIcon,
  TrashIcon,
  Cog6ToothIcon,
  ArrowsRightLeftIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CommandLineIcon,
  ChartBarIcon,
  UserCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// نظام الألوان الدقيق مع النسب المحددة
const COLOR_SCHEME = {
  primary: '#008DCB',   // 10%
  secondary: '#0D1012', // 5%
  neutral: '#999999',   // 20%
  accent: '#E2101E',    // 7%
  background: '#FFFFFF',// 50%
  highlight: '#F9D011'  // 8%
};

// بيانات وهمية متكاملة
const initialWorkflows = [{
  id: 'wf1',
  name: 'ترحيب العملاء',
  trigger: 'user-signup',
  status: 'active',
  stats: { runs: 142, successRate: 98.5 },
  actions: [
    { id: 'a1', type: 'email', config: { template: 'welcome' }},
    { id: 'a2', type: 'sms', config: { message: 'مرحبًا! تسعدنا انضمامك' }}
  ]
}];

const triggers = [
  { id: 'user-signup', name: 'تسجيل مستخدم جديد', icon: '👤' },
  { id: 'purchase', name: 'إتمام عملية شراء', icon: '🛒' }
];

const actions = [
  { id: 'email', name: 'إرسال بريد إلكتروني', icon: <EnvelopeIcon className="w-6 h-6" /> },
  { id: 'sms', name: 'إرسال رسالة نصية', icon: <DevicePhoneMobileIcon className="w-6 h-6" /> },
  { id: 'api', name: 'استدعاء API', icon: <CommandLineIcon className="w-6 h-6" /> }
];

const AutomationDashboard = () => {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [newWorkflowName, setNewWorkflowName] = useState('');

  // إضافة سير عمل جديد
  const addWorkflow = () => {
    if (!newWorkflowName) {
      toast.error('الرجاء إدخال اسم للسير العمل');
      return;
    }
    const newWorkflow = {
      id: `wf${Date.now()}`,
      name: newWorkflowName,
      trigger: null,
      status: 'draft',
      stats: { runs: 0, successRate: 0 },
      actions: []
    };
    setWorkflows([...workflows, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    setNewWorkflowName('');
    toast.success('تم إنشاء سير عمل جديد!');
  };

  // إدارة السحب والإفلات
  const handleDrop = (item, monitor) => {
    if (!selectedWorkflow) return;

    if (item.type === 'trigger') {
      setSelectedWorkflow({ ...selectedWorkflow, trigger: item.data.id });
    } else {
      const newAction = {
        id: `a${Date.now()}`,
        type: item.data.id,
        config: getDefaultConfig(item.data.id)
      };
      setSelectedWorkflow({
        ...selectedWorkflow,
        actions: [...selectedWorkflow.actions, newAction]
      });
    }
  };

  // محاكاة تنفيذ السير
  const simulateWorkflow = async () => {
    try {
      await toast.promise(
        new Promise((resolve) => setTimeout(resolve, 2000)),
        {
          loading: <b>جاري تنفيذ "{selectedWorkflow.name}"...</b>,
          success: <b>تم تنفيذ {selectedWorkflow.actions.length} إجراءات بنجاح 🎉</b>,
          error: <b>فشل في التنفيذ ⚠️</b>
        }
      );
      setSelectedWorkflow({
        ...selectedWorkflow,
        stats: {
          ...selectedWorkflow.stats,
          runs: selectedWorkflow.stats.runs + 1
        }
      });
    } catch (error) {
      console.error('Simulation error:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col" style={{ backgroundColor: COLOR_SCHEME.background }}>
        <Toaster position="top-center" toastOptions={{
          style: {
            background: COLOR_SCHEME.background,
            color: COLOR_SCHEME.secondary,
            border: `2px solid ${COLOR_SCHEME.neutral}`,
            borderRadius: '12px'
          }
        }} />

        {/* الهيدر - 10% من المساحة */}
        <header className="p-4 flex items-center justify-between shadow-lg" 
                style={{ backgroundColor: COLOR_SCHEME.primary }}>
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-8 h-8" style={{ color: COLOR_SCHEME.background }} />
            <h1 className="text-2xl font-bold" style={{ color: COLOR_SCHEME.background }}>
              نظام الأتمتة الذكي
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="اسم السير الجديد..."
              className="px-4 py-2 rounded-xl border-2"
              style={{ 
                borderColor: COLOR_SCHEME.highlight,
                backgroundColor: COLOR_SCHEME.background
              }}
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
            />
            <button
              onClick={addWorkflow}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
              style={{ 
                backgroundColor: COLOR_SCHEME.highlight,
                color: COLOR_SCHEME.secondary
              }}
            >
              <PlusIcon className="w-5 h-5" />
              إنشاء جديد
            </button>
          </div>
        </header>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          
          {/* القائمة الجانبية - 20% رمادي */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto">
            <h2 className="text-xl font-semibold p-2" style={{ color: COLOR_SCHEME.secondary }}>
              سير العمل الحالية
            </h2>
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                onClick={() => setSelectedWorkflow(workflow)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedWorkflow?.id === workflow.id ? 'border-[#008DCB]' : 'border-[#999999]'
                }`}
                style={{ backgroundColor: COLOR_SCHEME.background }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium" style={{ color: COLOR_SCHEME.secondary }}>
                    {workflow.name}
                  </h3>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {workflow.status === 'active' ? 'نشط' : 'مسودة'}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${COLOR_SCHEME.highlight}20`,
                          color: COLOR_SCHEME.highlight
                        }}>
                    {workflow.actions.length} إجراءات
                  </span>
                  <span className="text-sm px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${COLOR_SCHEME.primary}20`,
                          color: COLOR_SCHEME.primary
                        }}>
                    {workflow.stats.runs} تنفيذ
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* منطقة العمل الرئيسية - 50% أبيض */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-xl relative"
               style={{ backgroundColor: COLOR_SCHEME.background }}>
            
            <DropZone onDrop={handleDrop}>
              {selectedWorkflow ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold" style={{ color: COLOR_SCHEME.primary }}>
                      {selectedWorkflow.name}
                    </h2>
                    <button
                      onClick={simulateWorkflow}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl hover:shadow-md transition-all"
                      style={{ 
                        backgroundColor: COLOR_SCHEME.highlight,
                        color: COLOR_SCHEME.secondary
                      }}
                    >
                      <PlayIcon className="w-5 h-5" />
                      تشغيل المحاكاة
                    </button>
                  </div>

                  {/* منطقة المحفزات - 8% أصفر */}
                  <div className="mb-8 p-4 rounded-xl border-2 border-dashed flex items-center gap-3"
                       style={{ borderColor: COLOR_SCHEME.highlight }}>
                    <ArrowsRightLeftIcon className="w-6 h-6" style={{ color: COLOR_SCHEME.highlight }} />
                    <p style={{ color: COLOR_SCHEME.secondary }}>
                      {selectedWorkflow.trigger 
                        ? triggers.find(t => t.id === selectedWorkflow.trigger)?.name
                        : 'اسحب محفز هنا'}
                    </p>
                  </div>

                  {/* قائمة الإجراءات */}
                  <div className="space-y-4">
                    {selectedWorkflow.actions.map((action, index) => (
                      <DraggableAction
                        key={action.id}
                        action={action}
                        index={index}
                        onDelete={() => {
                          const newActions = [...selectedWorkflow.actions];
                          newActions.splice(index, 1);
                          setSelectedWorkflow({ ...selectedWorkflow, actions: newActions });
                        }}
                      />
                    ))}
                  </div>

                  {/* العناصر المتاحة للسحب */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    {actions.map((action) => (
                      <DraggableItem key={action.id} type="action" data={action}>
                        <div className="p-4 rounded-xl border-2 border-dashed hover:border-solid transition-all cursor-move flex flex-col items-center gap-2"
                             style={{ borderColor: COLOR_SCHEME.primary }}>
                          {action.icon}
                          <span style={{ color: COLOR_SCHEME.secondary }}>{action.name}</span>
                        </div>
                      </DraggableItem>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-8"
                     style={{ color: COLOR_SCHEME.neutral }}>
                  <p>اختر سير عمل من القائمة أو أنشئ جديدًا لتبدأ</p>
                </div>
              )}
            </DropZone>
          </div>

          {/* لوحة التفاصيل الجانبية - 5% أسود للنصوص */}
          <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-xl"
               style={{ backgroundColor: COLOR_SCHEME.background }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ color: COLOR_SCHEME.secondary }}>
              <Cog6ToothIcon className="w-5 h-5" style={{ color: COLOR_SCHEME.primary }} />
              الإحصائيات والإعدادات
            </h3>

            {selectedWorkflow ? (
              <div className="space-y-6">
                <StatCard 
                  title="عدد التنفيذات"
                  value={selectedWorkflow.stats.runs}
                  color={COLOR_SCHEME.primary}
                  icon="🚀"
                />
                <StatCard 
                  title="معدل النجاح"
                  value={`${selectedWorkflow.stats.successRate}%`}
                  color={COLOR_SCHEME.highlight}
                  icon="🎯"
                />
                <div className="p-4 rounded-xl"
                     style={{ backgroundColor: `${COLOR_SCHEME.neutral}10` }}>
                  <label className="block text-sm mb-2" style={{ color: COLOR_SCHEME.secondary }}>
                    حالة السير:
                  </label>
                  <select
                    className="w-full p-2 rounded-xl border-2"
                    style={{ 
                      borderColor: COLOR_SCHEME.primary,
                      backgroundColor: COLOR_SCHEME.background
                    }}
                    value={selectedWorkflow.status}
                    onChange={(e) => setSelectedWorkflow({
                      ...selectedWorkflow,
                      status: e.target.value
                    })}
                  >
                    <option value="draft">مسودة</option>
                    <option value="active">نشط</option>
                    <option value="archived">مؤرشف</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="text-center p-4" style={{ color: COLOR_SCHEME.neutral }}>
                اختر سير عمل لعرض الإحصائيات
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

// ==========================================
// المكونات المساعدة
// ==========================================

const DropZone = ({ onDrop, children }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ['trigger', 'action'],
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  return (
    <div 
      ref={drop}
      className="h-full"
      style={{
        backgroundColor: canDrop ? `${COLOR_SCHEME.primary}05` : 'transparent',
        border: isOver ? `2px dashed ${COLOR_SCHEME.primary}` : 'none'
      }}
    >
      {children}
    </div>
  );
};

const DraggableAction = ({ action, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'action',
    item: { id: action.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const actionMeta = actions.find(a => a.id === action.type);

  return (
    <div
      ref={drag}
      className="group relative p-4 rounded-xl border-2 hover:shadow-md transition-all"
      style={{
        opacity: isDragging ? 0.5 : 1,
        borderColor: COLOR_SCHEME.primary,
        backgroundColor: COLOR_SCHEME.background
      }}
    >
      <div className="flex items-center gap-3">
        <div style={{ color: COLOR_SCHEME.primary }}>
          {actionMeta?.icon}
        </div>
        <div>
          <h4 className="font-medium" style={{ color: COLOR_SCHEME.secondary }}>
            {actionMeta?.name}
          </h4>
          <p className="text-sm mt-1" style={{ color: COLOR_SCHEME.neutral }}>
            {action.config.template || action.config.message}
          </p>
        </div>
      </div>
      <button
        onClick={onDelete}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: COLOR_SCHEME.accent }}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

const DraggableItem = ({ children, type, data }) => {
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { type, data },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
    >
      {children}
    </div>
  );
};

const StatCard = ({ title, value, color, icon }) => (
  <div className="p-4 rounded-xl flex items-center justify-between"
       style={{ backgroundColor: `${color}20` }}>
    <div>
      <p className="text-sm" style={{ color }}>{title}</p>
      <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
    </div>
    <span className="text-2xl">{icon}</span>
  </div>
);

// الدوال المساعدة
const getDefaultConfig = (type) => {
  const configs = {
    email: { template: 'default' },
    sms: { message: 'مرحبًا!' },
    api: { endpoint: '/api/action' }
  };
  return configs[type] || {};
};

export default AutomationDashboard;
'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

// المكونات الداخلية
import MemberDetailsModal from './MemberDetailsModal';
import TeamMemberCard from './TeamMemberCard';
import RoleSelector from './RoleSelector';
import PermissionsEditor from './PermissionsEditor';
import LoadingSpinner from './LoadingSpinner';
import { getInternalUsers, addInternalUser,   updateInternalUser as updateInternalUser, // ✅ استخدام الاسم الموحد
deleteInternalUser as deleteInternalUser, // ✅ التصدير الصحيح
 } from '@/store/internalUsersSlice';
const theme = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

export default function TeamManagementPanel() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { users, loading, error } = useSelector((state) => state.internalUsers);
  const { isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth);

  // حالة المستخدم الجديد
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    permissions: []
  });

  const [filters, setFilters] = useState({ role: '', search: '' });
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // تحويل القيم إلى معرفات الأدوار
  const roleMap = {
    'assistant': 4,
    'Employee': 5,
    'Marketer': 6
  };

  // جلب المستخدمين عند التحميل
  useEffect(() => {
    dispatch(getInternalUsers());
  }, [dispatch]);

  // تعيين الأدوار المسموح بها
  const allowedRoles = ['assistant', 'Employee', 'Marketer'];

  // معالجة سحب وإفلات إعادة ترتيب المستخدمين
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(users);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    dispatch(updateUser({
      id: reorderedItem.id,
      updates: { order: result.destination.index }
    }));
  };
const handleAddMember = async () => {
  const { name, email, password, role, permissions } = newMember;
  
  if (!name.trim() || !email.trim() || !password.trim() || !role) {
    alert('يرجى ملء جميع الحقول بما في ذلك الاسم والبريد وكلمة المرور والدور');
    return;
  }

  setIsAdding(true);
  
   try {
    await dispatch(addInternalUser({
      name,
      email,
      password,
      role: roleMap[newMember.role],
      permissions:permissions , // ✅ تحويل الكائن إلى مصفوفة
      lastLogin: new Date().toISOString()
    }));
    
    // إعادة تعيين النموذج بعد الإضافة
    setNewMember({
      name: '',
      email: '',
      password: '',
      role: '',
      permissions:[]
    });
  } catch (err) {
    console.error('فشل في إضافة المستخدم:', err);
    alert('فشل في إضافة المستخدم. يرجى المحاولة مجددًا.');
  } finally {
    setIsAdding(false);
  }
};

  // تصفية الأعضاء بناءً على البحث والدور
  const filteredMembers = users?.filter(member => {
  const memberName = member.username?.toString() || ''; // استخدام username
  const searchTerm = filters.search?.toString() || '';
  const matchesRole = !filters.role || member.role?.name === filters.role; // استخدام role.name
  const matchesSearch = memberName.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesRole && matchesSearch;
}) || [];

  // إذا كان لا يزال جارٍ التحقق من الهوية ولكن ليس في حالة تحميل، أعد توجيهه إلى صفحة تسجيل الدخول
  if (authLoading) {
    return <LoadingSpinner message="جاري التحقق من هوية المستخدم..." />;
  }

  // إذا لم يكن المستخدم مصادق عليه، لا تعرض أي شيء لأننا قمنا بإعادة توجيهه بالفعل
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold" style={{ color: theme.black }}>
          إدارة الفريق
        </h1>
        <div className="flex gap-3">
          {/* حقل البحث */}
          <div className="relative">
            <input
              type="text"
              placeholder="بحث..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
            />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* نموذج إضافة عضو جديد */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-sm">
        <h3 className="font-medium mb-4">إضافة عضو جديد</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* اسم المستخدم */}
          <input
            type="text"
            placeholder="الاسم"
            value={newMember.name}
            onChange={(e) => setNewMember({...newMember, name: e.target.value})}
            className="w-full pl-4 pr-12 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
          />
          
          {/* البريد الإلكتروني */}
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={newMember.email}
            onChange={(e) => setNewMember({...newMember, email: e.target.value})}
            className="w-full pl-4 pr-12 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
          />
          
          {/* كلمة المرور */}
          <input
            type="password"
            placeholder="كلمة المرور"
            value={newMember.password}
            onChange={(e) => setNewMember({...newMember, password: e.target.value})}
            className="w-full pl-4 pr-12 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
          />
          
          {/* تحديد الدور */}
          <RoleSelector
            value={newMember.role}
            onChange={(roleValue) => {
              setNewMember(prev => ({ ...prev, role: roleValue }));
            }}
          />
          
          {/* تحرير الصلاحيات */}
          <PermissionsEditor
            initialPermissions={newMember.permissions}
            onChange={(perms) => setNewMember({...newMember, permissions: perms})}
          />
        </div>
        
        {/* زر الإضافة */}
        <button
          onClick={handleAddMember}
          disabled={isAdding}
          className="mt-4 px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 justify-center transition-colors bg-blue-500 text-white disabled:bg-gray-400"
        >
          {isAdding ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <PlusIcon className="w-5 h-5" />
          )}
          {isAdding ? 'جاري الإضافة...' : 'إضافة عضو'}
        </button>
      </div>

      {/* قائمة الأعضاء */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="teamMembers">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {filteredMembers.map((member, index) => (
                <Draggable key={member.id} draggableId={`member-${member.id}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                    >
                      <TeamMemberCard
    key={member.id}
    member={member}
    index={index}
    onUpdate={(id, updates) => dispatch(updateInternalUser({ id, updates }))}
    onDelete={() => dispatch(deleteInternalUser(member.id))}
    onViewDetails={() => setSelectedMember(member)}
  />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {/* مؤشر عدم وجود أعضاء */}
              {!filteredMembers.length && !loading && (
                <div className="text-center py-12 rounded-xl bg-white">
                  <div className="mx-auto h-24 w-24 mb-4 text-gray-400">
                    <UserGroupIcon className="w-full h-full" />
                  </div>
                  <h3 className="text-lg font-medium text-black">لا يوجد أعضاء</h3>
                </div>
              )}
              
              {/* مؤشر التحميل */}
              {loading && (
                <div className="text-center py-12 rounded-xl bg-white">
                  <div className="mx-auto h-16 w-16 mb-4 text-gray-400">
                    <LoadingSpinner className="w-full h-full" />
                  </div>
                  <h3 className="text-lg font-medium text-black">جاري التحميل...</h3>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* نافذة تفاصيل العضو */}
      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          activityLogs={selectedMember.activityLogs || []}
        />
      )}

      {/* تلميح لإعادة الترتيب */}
      <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
        <ArrowsUpDownIcon className="w-4 h-4" />
        <span>اسحب العناصر لإعادة الترتيب</span>
      </div>
    </div>
  );
}
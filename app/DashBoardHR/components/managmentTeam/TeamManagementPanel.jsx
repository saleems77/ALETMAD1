'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// المكونات الداخلية
import MemberDetailsModal from './MemberDetailsModal';
import TeamMemberCard from './TeamMemberCard';
import RoleSelector from './RoleSelector';
import PermissionsEditor from './PermissionsEditor';
import LoadingSpinner from './LoadingSpinner';
import { getInternalUsers, addInternalUser, updateInternalUser, deleteInternalUser } from '@/store/internalUsersSlice';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPermissionsEditor, setShowPermissionsEditor] = useState(false);

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
    
    dispatch(updateInternalUser({
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
        permissions,
        lastLogin: new Date().toISOString()
      }));
      
      // إعادة تعيين النموذج بعد الإضافة
      setNewMember({
        name: '',
        email: '',
        password: '',
        role: '',
        permissions: []
      });
      
      // إغلاق نموذج الإضافة بعد النجاح
      setShowAddForm(false);
    } catch (err) {
      console.error('فشل في إضافة المستخدم:', err);
      alert('فشل في إضافة المستخدم. يرجى المحاولة مجددًا.');
    } finally {
      setIsAdding(false);
    }
  };

  // تصفية الأعضاء بناءً على البحث والدور
  const filteredMembers = users?.filter(member => {
    const memberName = member.username?.toString() || '';
    const searchTerm = filters.search?.toString() || '';
    const matchesRole = !filters.role || member.role?.name === filters.role;
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
    <div className="p-6 max-w-6xl mx-auto" style={{ backgroundColor: theme.white }}>
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: theme.black }}>
            إدارة الفريق
          </h1>
          <p className="text-sm mt-1" style={{ color: theme.gray }}>
            إدارة أعضاء الفريق الداخلي وتحديد الصلاحيات والأدوار
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* حقل البحث */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="بحث باسم المستخدم..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none"
              style={{ 
                borderColor: theme.gray, 
                backgroundColor: theme.white,
                color: theme.black
              }}
            />
            <MagnifyingGlassIcon 
              className="w-5 h-5 absolute left-3 top-2.5" 
              style={{ color: theme.gray }} 
            />
          </div>
          
          {/* زر إضافة عضو جديد */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 justify-center transition-colors"
            style={{ 
              backgroundColor: showAddForm ? theme.gray : theme.blue,
              color: theme.white
            }}
          >
            <PlusIcon className="w-5 h-5" />
            {showAddForm ? 'إغلاق النموذج' : 'عضو جديد'}
          </button>
        </div>
      </div>

      {/* نموذج إضافة عضو جديد */}
      {showAddForm && (
        <div 
          className="mb-8 p-6 rounded-xl shadow-lg transition-all duration-300"
          style={{ 
            backgroundColor: theme.white,
            border: `1px solid ${theme.blue}20`,
            boxShadow: `0 4px 15px ${theme.blue}10`
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg" style={{ color: theme.black }}>إضافة عضو جديد</h3>
            <button 
              onClick={() => setShowAddForm(false)}
              className="p-1 rounded-full hover:bg-gray-100"
              style={{ color: theme.gray }}
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* اسم المستخدم */}
            <div>
              <label className="block text-sm mb-1" style={{ color: theme.black }}>الاسم الكامل</label>
              <input
                type="text"
                placeholder="أدخل الاسم الكامل"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                style={{ 
                  borderColor: theme.gray, 
                  backgroundColor: theme.white,
                  color: theme.black
                }}
              />
            </div>
            
            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm mb-1" style={{ color: theme.black }}>البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                style={{ 
                  borderColor: theme.gray, 
                  backgroundColor: theme.white,
                  color: theme.black
                }}
              />
            </div>
            
            {/* كلمة المرور */}
            <div>
              <label className="block text-sm mb-1" style={{ color: theme.black }}>كلمة المرور</label>
              <input
                type="password"
                placeholder="أنشئ كلمة مرور قوية"
                value={newMember.password}
                onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                style={{ 
                  borderColor: theme.gray, 
                  backgroundColor: theme.white,
                  color: theme.black
                }}
              />
            </div>
            
            {/* تحديد الدور */}
            <div>
              <label className="block text-sm mb-1" style={{ color: theme.black }}>الدور</label>
              <RoleSelector
                value={newMember.role}
                onChange={(roleValue) => {
                  setNewMember(prev => ({ ...prev, role: roleValue }));
                }}
              />
            </div>
          </div>
          
          {/* تحرير الصلاحيات */}
          <div className="mt-6">
            <div 
              className="flex items-center justify-between cursor-pointer p-3 rounded-lg"
              style={{ backgroundColor: theme.blue + '10' }}
              onClick={() => setShowPermissionsEditor(!showPermissionsEditor)}
            >
              <h4 className="font-medium" style={{ color: theme.blue }}>صلاحيات العضو</h4>
              {showPermissionsEditor ? 
                <ChevronUpIcon className="w-5 h-5" style={{ color: theme.blue }} /> : 
                <ChevronDownIcon className="w-5 h-5" style={{ color: theme.blue }} />
              }
            </div>
            
            {showPermissionsEditor && (
              <div className="mt-3 p-4 rounded-lg" style={{ backgroundColor: theme.white, border: `1px solid ${theme.gray}30` }}>
                <PermissionsEditor
                  initialPermissions={newMember.permissions}
                  onChange={(perms) => setNewMember({...newMember, permissions: perms})}
                />
              </div>
            )}
          </div>
          
          {/* زر الإضافة */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAddMember}
              disabled={isAdding}
              className="px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
              style={{ 
                backgroundColor: theme.blue,
                color: theme.white,
                opacity: isAdding ? 0.7 : 1
              }}
            >
              {isAdding ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <PlusIcon className="w-5 h-5" />
              )}
              {isAdding ? 'جاري الإضافة...' : 'إضافة عضو'}
            </button>
          </div>
        </div>
      )}

      {/* فلاتر الأدوار */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setFilters({...filters, role: ''})}
          className={`px-4 py-2 rounded-lg text-sm ${!filters.role ? 'font-medium' : ''}`}
          style={{ 
            backgroundColor: !filters.role ? theme.blue : theme.white,
            color: !filters.role ? theme.white : theme.gray,
            border: `1px solid ${!filters.role ? theme.blue : theme.gray}`
          }}
        >
          جميع الأعضاء
        </button>
        
        {allowedRoles.map(role => (
          <button
            key={role}
            onClick={() => setFilters({...filters, role})}
            className={`px-4 py-2 rounded-lg text-sm ${filters.role === role ? 'font-medium' : ''}`}
            style={{ 
              backgroundColor: filters.role === role ? theme.blue : theme.white,
              color: filters.role === role ? theme.white : theme.gray,
              border: `1px solid ${filters.role === role ? theme.blue : theme.gray}`
            }}
          >
            {role === 'assistant' && 'مساعدون'}
            {role === 'Employee' && 'موظفون'}
            {role === 'Marketer' && 'مسوقون'}
          </button>
        ))}
      </div>

      {/* قائمة الأعضاء */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="teamMembers">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member, index) => (
                  <Draggable key={member.id} draggableId={`member-${member.id}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="mb-4"
                      >
                        <TeamMemberCard
                          member={member}
                          index={index}
                          dragHandleProps={provided.dragHandleProps}
                          onUpdate={(id, updates) => dispatch(updateInternalUser({ id, updates }))}
                          onDelete={() => dispatch(deleteInternalUser(member.id))}
                          onViewDetails={() => setSelectedMember(member)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                // حالة عدم وجود أعضاء
                <div 
                  className="text-center py-12 rounded-xl flex flex-col items-center"
                  style={{ backgroundColor: theme.white }}
                >
                  <div className="mx-auto h-24 w-24 mb-4 flex items-center justify-center rounded-full" style={{ backgroundColor: theme.blue + '10' }}>
                    <UserGroupIcon className="w-12 h-12" style={{ color: theme.blue }} />
                  </div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: theme.black }}>لا يوجد أعضاء</h3>
                  <p className="text-sm max-w-md" style={{ color: theme.gray }}>
                    لم يتم إضافة أي أعضاء إلى الفريق بعد. ابدأ بإضافة عضو جديد باستخدام الزر بالأعلى.
                  </p>
                </div>
              )}
              
              {provided.placeholder}
              
              {/* مؤشر التحميل */}
              {loading && (
                <div className="text-center py-12 rounded-xl" style={{ backgroundColor: theme.white }}>
                  <div className="mx-auto mb-4">
                    <LoadingSpinner 
                      className="w-16 h-16" 
                      primaryColor={theme.blue}
                      secondaryColor={theme.blue + '20'}
                    />
                  </div>
                  <h3 className="text-lg font-medium" style={{ color: theme.black }}>جاري تحميل بيانات الأعضاء...</h3>
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
      <div className="mt-6 flex items-center justify-center gap-2 text-sm p-3 rounded-lg" style={{ backgroundColor: theme.blue + '10' }}>
        <ArrowsUpDownIcon className="w-5 h-5" style={{ color: theme.blue }} />
        <span style={{ color: theme.blue }}>اسحب العناصر لإعادة ترتيب أعضاء الفريق</span>
      </div>
    </div>
  );
}
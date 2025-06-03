'use client';
import { 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Button,
  Checkbox,
  Tooltip
} from '@nextui-org/react';
import { 
  FiTrash2, 
  FiPauseCircle, 
  FiDownload,
  FiAlertTriangle,
  FiCheckSquare,
  FiXSquare
} from 'react-icons/fi';
import { useLicenseStore } from './LicenseContext';
import { useConfirm } from './ConfirmContext';
import { useState } from 'react';

export default function BulkActions() {
  const { selectedItems = [], institutions = [], deleteInstitutions, updateInstitutions } = useLicenseStore();
  const { confirm } = useConfirm();
  const [selectAll, setSelectAll] = useState(false);

  // إضافة قيمة افتراضية لمنع undefined
  const safeSelectedItems = selectedItems || [];
  const safeInstitutions = institutions || [];

  const handleBulkAction = async (action) => {
    const confirmed = await confirm({
      title: 'تأكيد الإجراء الجماعي',
      message: `هل أنت متأكد من رغبتك في تطبيق هذا الإجراء على ${safeSelectedItems.length} عنصر؟`,
      confirmText: 'نعم، قم بالإجراء',
      cancelText: 'إلغاء'
    });

    if (confirmed) {
      switch(action) {
        case 'delete':
          await deleteInstitutions(safeSelectedItems);
          break;
        case 'suspend':
          await updateInstitutions(safeSelectedItems, { status: 'suspended' });
          break;
        case 'export':
          exportToExcel(safeInstitutions.filter(i => safeSelectedItems.includes(i.id)));
          break;
      }
    }
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    const allIds = safeInstitutions.map(i => i.id);
    useLicenseStore.setState({ selectedItems: selectAll ? [] : allIds });
  };

  return (
    <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Checkbox
          isSelected={selectAll}
          onChange={toggleSelectAll}
          aria-label="تحديد الكل"
        />
        <span className="text-sm text-gray-600">
          {safeSelectedItems.length} عنصر محدود
        </span>
      </div>

      <div className="flex gap-2">
        <Dropdown>
          <DropdownTrigger>
            <Button 
              variant="bordered" 
              startContent={<FiAlertTriangle />}
              isDisabled={safeSelectedItems.length === 0}
            >
              إجراءات جماعية
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="الإجراءات الجماعية"
            onAction={(key) => handleBulkAction(key)}
          >
            <DropdownItem 
              key="delete" 
              startContent={<FiTrash2 className="text-red-500" />}
              className="text-red-500"
            >
              حذف المحدد
            </DropdownItem>
            <DropdownItem 
              key="suspend" 
              startContent={<FiPauseCircle className="text-yellow-500" />}
            >
              تعليق الحسابات
            </DropdownItem>
            <DropdownItem 
              key="activate" 
              startContent={<FiCheckSquare className="text-green-500" />}
            >
              تنشيط الحسابات
            </DropdownItem>
            <DropdownItem 
              key="export" 
              startContent={<FiDownload className="text-blue-500" />}
            >
              تصدير البيانات
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Tooltip content="إلغاء التحديد">
          <Button
            isIconOnly
            variant="flat"
            onClick={() => useLicenseStore.setState({ selectedItems: [] })}
            isDisabled={safeSelectedItems.length === 0}
          >
            <FiXSquare />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

const exportToExcel = (data) => {
  // تنفيذ منطق التصدير إلى Excel هنا
  console.log('Exporting data:', data);
};
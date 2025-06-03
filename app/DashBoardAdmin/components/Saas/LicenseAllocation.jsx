import { Checkbox, Table, TableBody, TableRow, Button, TableCell, TableHeader, TableColumn } from "@nextui-org/react";
import { useState } from "react";

export default function LicenseAllocation() {
  const [selectedModules, setSelectedModules] = useState([]);
  const modules = ['التسويق', 'الدورات', 'التقارير'];
  const handleSave = () => {
    console.log("Modules allocated:", selectedModules);
  };
  return (
    <div>
      <Table>
        {/* إضافة رأس الجدول مع تعريف الأعمدة */}
        <TableHeader>
          <TableColumn key="select">تحديد</TableColumn>
          <TableColumn key="moduleName">اسم الوحدة</TableColumn>
        </TableHeader>
        <TableBody>
          {modules.map(module => (
            <TableRow key={module}>
              <TableCell>
                <Checkbox 
                  checked={selectedModules.includes(module)}
                  onChange={(e) => setSelectedModules(prev => 
                    e.target.checked ? [...prev, module] : prev.filter(m => m !== module)
                  )}
                />
              </TableCell>
              <TableCell>{module}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleSave}>حفظ التخصيصات</Button>
    </div>
  );
}
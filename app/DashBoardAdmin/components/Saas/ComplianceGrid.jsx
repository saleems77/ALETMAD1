import { Table } from "@nextui-org/react";
import { useLicenseStore } from "./LicenseContext";

export default function ComplianceGrid() {
  const { institutions } = useLicenseStore();

  return (
    <Table aria-label="حالة الامتثال">
      <TableHeader>
        <TableColumn>اسم المركز</TableColumn>
        <TableColumn>الانتهاكات</TableColumn>
        <TableColumn>الحالة</TableColumn>
      </TableHeader>
      <TableBody>
        {institutions.map(inst => (
          <TableRow key={inst.id}>
            <TableCell>{inst.name}</TableCell>
            <TableCell>{inst.violationsCount || 0}</TableCell>
            <TableCell>
              {inst.status === 'active' ? (
                <span className="text-success">ممتثل</span>
              ) : (
                <span className="text-danger">غير ممتثل</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
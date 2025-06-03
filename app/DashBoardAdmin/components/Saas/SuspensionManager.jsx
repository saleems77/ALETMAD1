import { Table, Button } from "@nextui-org/react";
import { useLicenseStore } from "./LicenseContext";

export default function SuspensionManager() {
  const { institutions, updateInstitution } = useLicenseStore();
  const suspendedInstitutions = institutions.filter(inst => inst.status === 'suspended');

  const handleReactivate = (id) => {
    updateInstitution(id, {
      status: 'active',
      suspensionReason: null,
      suspendedAt: null
    });
  };

  return (
    <Table aria-label="المراكز المعلقة">
      <TableHeader>
        <TableColumn>اسم المركز</TableColumn>
        <TableColumn>سبب الإيقاف</TableColumn>
        <TableColumn>تاريخ الإيقاف</TableColumn>
        <TableColumn>الإجراءات</TableColumn>
      </TableHeader>
      <TableBody>
        {suspendedInstitutions.map(inst => (
          <TableRow key={inst.id}>
            <TableCell>{inst.name}</TableCell>
            <TableCell>{inst.suspensionReason}</TableCell>
            <TableCell>{inst.suspendedAt?.toLocaleDateString()}</TableCell>
            <TableCell>
              <Button onClick={() => handleReactivate(inst.id)}>
                إعادة التنشيط
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
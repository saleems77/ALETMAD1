import { 
  Table, 
  Button,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Tooltip
} from "@nextui-org/react";
import { useLicenseStore } from "./LicenseContext";
import { MdEdit, MdWorkspacePremium, MdCheckCircle, MdCancel, MdHourglassTop } from "react-icons/md";

export default function InstitutionTable({ onEdit }) {
  const { institutions, isLoading } = useLicenseStore();

  const statusIconMap = {
    active: <MdCheckCircle className="text-xl text-success" />,
    expired: <MdCancel className="text-xl text-danger" />,
    pending: <MdHourglassTop className="text-xl text-warning" />
  };

  const tierColorMap = {
    basic: "default",
    pro: "secondary",
    premium: "primary"
  };

  return (
    <Table
      aria-label="قائمة المراكز التعليمية"
      dir="rtl"
      classNames={{
        base: "max-h-[600px] overflow-auto",
        table: "min-h-[400px]",
        th: "text-right bg-primary-100 text-primary-800 font-bold text-md",
        td: "border-b border-divider py-3"
      }}
      isHeaderSticky
      layout="fixed"
      isLoading={isLoading}
      loadingContent={<Spinner label="جاري التحميل..." />}
      emptyContent={!isLoading && "لا توجد مراكز مسجلة"}
    >
      <TableHeader>
        <TableColumn width="25%">الاسم</TableColumn>
        <TableColumn width="15%">الحالة</TableColumn>
        <TableColumn width="20%">الباقة</TableColumn>
        <TableColumn width="20%">تاريخ الانتهاء</TableColumn>
        <TableColumn width="20%">الإجراءات</TableColumn>
      </TableHeader>

      <TableBody>
        {institutions.map((inst) => (
          <TableRow key={inst.id} className="hover:bg-default-50 transition-colors">
            <TableCell>
              <div className="flex items-center gap-3">
                <MdWorkspacePremium className={`text-xl text-${tierColorMap[inst.subscriptionTier]}`} />
                <span className="font-medium">{inst.name}</span>
              </div>
            </TableCell>

            <TableCell>
              <Chip 
                variant="dot"
                color={
                  inst.status === 'active' ? 'success' : 
                  inst.status === 'expired' ? 'danger' : 'warning'
                }
                classNames={{ base: "px-2 py-4" }}
              >
                <div className="flex items-center gap-2">
                  {statusIconMap[inst.status]}
                  <span className="capitalize">{inst.status}</span>
                </div>
              </Chip>
            </TableCell>

            <TableCell>
              <Chip 
                color={tierColorMap[inst.subscriptionTier]}
                variant="flat"
                classNames={{ base: "px-3 py-4" }}
              >
                <span className="font-semibold">{inst.subscriptionTier}</span>
              </Chip>
            </TableCell>

            <TableCell>
              <span className="text-default-500">{inst.expiryDate || 'غير محدد'}</span>
            </TableCell>

            <TableCell>
              <Tooltip content="تعديل البيانات" color="primary">
                <Button
                  isIconOnly
                  variant="light"
                  color="primary"
                  className="text-lg hover:bg-primary-100"
                  onClick={() => onEdit(inst)}
                >
                  <MdEdit />
                </Button>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
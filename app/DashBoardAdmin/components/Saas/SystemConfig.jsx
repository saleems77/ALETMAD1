import { 
  Input, 
  Button, 
  Card, 
  Spinner,
  Tooltip,
  Chip,
  Divider
} from "@nextui-org/react";
import { useLicenseStore } from "./LicenseContext";
import { 
  MdSave, 
  MdAttachMoney, 
  MdSecurity,
  MdInfoOutline,
  MdLockClock,
  MdPriceChange
} from "react-icons/md";
import { toast } from "react-hot-toast";

export default function SystemConfig() {
  const { systemSettings, updateSystemSettings } = useLicenseStore();
  const [isSaving, setIsSaving] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (value < 0) {
      newErrors[name] = "القيمة يجب أن تكون موجبة";
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // محاكاة اتصال مع الخادم
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <MdSecurity className="text-2xl text-primary" />
        <h3 className="text-2xl font-bold">إعدادات النظام العام</h3>
      </div>

      {/* قسم التعليق التلقائي */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2 text-lg">
          <MdLockClock className="text-xl text-warning" />
          <h4 className="font-semibold">إعدادات التعليق التلقائي</h4>
        </div>

        <Grid.Container gap={4}>
          <Grid xs={12} sm={6}>
            <Input
              fullWidth
              label={
                <div className="flex items-center gap-1">
                  <span>فترة السماح للدفع</span>
                  <Tooltip content="عدد الأيام المسموح بها بعد انتهاء الباقة">
                    <MdInfoOutline className="text-default-400" />
                  </Tooltip>
                </div>
              }
              type="number"
              min="0"
              placeholder="أيام"
              value={systemSettings.autoSuspension.paymentDelay}
              isInvalid={!!errors.paymentDelay}
              errorMessage={errors.paymentDelay}
              startContent={
                <Chip variant="flat" color="primary" className="px-2">يوم</Chip>
              }
              onBlur={(e) => validateField('paymentDelay', e.target.value)}
              onChange={(e) => updateSystemSettings({
                autoSuspension: { 
                  ...systemSettings.autoSuspension,
                  paymentDelay: parseInt(e.target.value)
                }
              })}
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <Input
              fullWidth
              label="الحد الأقصى للاختراقات"
              type="number"
              min="0"
              placeholder="عدد المرات"
              value={systemSettings.autoSuspension.maxViolations}
              isInvalid={!!errors.maxViolations}
              errorMessage={errors.maxViolations}
              startContent={
                <Chip variant="flat" color="secondary" className="px-2">مرة</Chip>
              }
              onBlur={(e) => validateField('maxViolations', e.target.value)}
              onChange={(e) => updateSystemSettings({
                autoSuspension: { 
                  ...systemSettings.autoSuspension,
                  maxViolations: parseInt(e.target.value)
                }
              })}
            />
          </Grid>
        </Grid.Container>
      </div>

      <Divider className="my-6" />

      {/* قسم باقات التسعير */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg">
          <MdPriceChange className="text-xl text-success" />
          <h4 className="font-semibold">إدارة الباقات السعرية</h4>
        </div>

        <Grid.Container gap={4}>
          {Object.entries(systemSettings.pricingTiers).map(([tier, price]) => (
            <Grid xs={12} sm={4} key={tier}>
              <Input
                fullWidth
                label={
                  <Chip 
                    color={
                      tier === 'basic' ? 'primary' :
                      tier === 'pro' ? 'secondary' : 'warning'
                    }
                    variant="flat"
                    className="capitalize"
                  >
                    {tier}
                  </Chip>
                }
                type="number"
                min="0"
                placeholder="السعر"
                value={price}
                startContent={<MdAttachMoney className="text-default-400" />}
                onChange={(e) => updateSystemSettings({
                  pricingTiers: { 
                    ...systemSettings.pricingTiers,
                    [tier]: parseFloat(e.target.value)
                  }
                })}
              />
            </Grid>
          ))}
        </Grid.Container>
      </div>

      <Divider className="my-6" />

      <div className="flex justify-end gap-3">
        <Button 
          color="primary" 
          onClick={handleSave}
          startContent={!isSaving && <MdSave />}
          disabled={isSaving || Object.keys(errors).length > 0}
          className="font-semibold"
        >
          {isSaving ? (
            <>
              <Spinner color="white" size="sm" />
              <span className="mr-2">جاري الحفظ...</span>
            </>
          ) : "حفظ التغييرات"}
        </Button>
      </div>
    </Card>
  );
}
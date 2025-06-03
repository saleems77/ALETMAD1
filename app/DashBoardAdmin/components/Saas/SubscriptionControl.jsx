'use client';
import { 
  DatePicker,
  Select, 
  SelectItem, 
  Button,
  Card,
  Divider,
  Tooltip
} from "@nextui-org/react";
import { useState } from "react";
import { parseDate } from "@internationalized/date";
import { FiInfo, FiCalendar, FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const plans = [
  {
    id: "basic",
    name: "الباقة الأساسية",
    price: 99,
    features: ["5 مستخدمين", "10GB مساحة", "دعم فني أساسي"],
    color: "bg-blue-100",
  },
  {
    id: "pro",
    name: "الباقة المتقدمة",
    price: 299,
    features: ["20 مستخدم", "50GB مساحة", "دعم فني مميز", "نسخ احتياطي يومي"],
    color: "bg-purple-100",
  },
];

export default function SubscriptionControl() {
  const [renewalDate, setRenewalDate] = useState(
    parseDate(new Date().toISOString().split("T")[0])
  );
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);

  const handleRenewal = async () => {
    setIsLoading(true);
    try {
      // محاكاة طلب API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const jsDate = new Date(
        renewalDate.year,
        renewalDate.month - 1,
        renewalDate.day
      );
      
      toast.success(`تم تجديد اشتراك ${plans.find(p => p.id === selectedPlan).name} حتى ${jsDate.toLocaleDateString('ar-EG')}`);
    } catch (error) {
      toast.error("فشل في عملية التجديد");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlanDetails = plans.find(p => p.id === selectedPlan);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <Card className="p-6 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FiRefreshCw className="text-blue-500" />
          إدارة الاشتراك
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {plans.map(plan => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.02 }}
                className={`${plan.color} p-4 rounded-lg cursor-pointer border-2 ${
                  selectedPlan === plan.id ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-gray-600 mt-1">
                      {plan.price} دولار/شهريًا
                    </p>
                  </div>
                  {selectedPlan === plan.id && (
                    <span className="text-blue-500">✓</span>
                  )}
                </div>
                <Divider className="my-3" />
                <ul className="list-disc pl-5 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            <DatePicker
              label={
                <span className="flex items-center gap-2">
                  <FiCalendar />
                  تاريخ التجديد
                </span>
              }
              value={renewalDate}
              onChange={setRenewalDate}
              minValue={parseDate(new Date().toISOString().split("T")[0])}
              className="[&_label]:rtl:right-auto [&_label]:rtl:left-2"
              description="اختر تاريخًا لا يسبق اليوم الحالي"
            />

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 flex items-center gap-2">
                <FiInfo className="flex-shrink-0" />
                سيتم تجديد اشتراك {selectedPlanDetails.name} بقيمة{" "}
                {selectedPlanDetails.price} دولار
              </p>
            </div>

            <Button
              color="primary"
              size="lg"
              onClick={handleRenewal}
              isLoading={isLoading}
              className="font-semibold"
              fullWidth
            >
              {isLoading ? "جاري المعالجة..." : "تأكيد التجديد"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
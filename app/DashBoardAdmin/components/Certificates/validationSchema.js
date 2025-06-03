import * as Yup from "yup";

export default Yup.object().shape({
  recipientName: Yup.string()
    .required("اسم المتلقي مطلوب")
    .min(5, "الاسم يجب أن يكون على الأقل 5 أحرف"),
  courseName: Yup.string().required("يرجى اختيار الدورة"),
  issueDate: Yup.date()
    .required("تاريخ الإصدار مطلوب")
    .max(new Date(), "لا يمكن أن يكون التاريخ في المستقبل"),
});

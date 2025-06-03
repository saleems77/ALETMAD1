import * as Yup from "yup";

export default Yup.object().shape({
  name: Yup.string()
    .required("اسم المجموعة مطلوب")
    .min(5, "يجب أن يكون الاسم على الأقل 5 أحرف")
    .max(50, "لا يمكن أن يتجاوز الاسم 50 حرفًا"),
  description: Yup.string()
    .required("الوصف مطلوب")
    .min(20, "الوصف يجب أن يكون على الأقل 20 حرفًا")
    .max(500, "الوصف لا يمكن أن يتجاوز 500 حرف"),
  isPrivate: Yup.boolean(),
  tags: Yup.array()
    .of(Yup.string().min(2, "كل وسم يجب أن يكون على الأقل حرفين"))
    .max(5, "لا يمكن إضافة أكثر من 5 وسوم"),
});

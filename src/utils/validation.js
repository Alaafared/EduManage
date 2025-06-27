export const validateStudentData = (data) => {
  const errors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = 'الاسم الكامل مطلوب';
  }
  if (!data.previousSchool?.trim()) {
    errors.previousSchool = 'اسم المدرسة الإعدادية مطلوب';
  }
  if (!data.nationalId || !/^\d{14}$/.test(data.nationalId)) {
    errors.nationalId = 'الرقم القومي يجب أن يتكون من 14 رقمًا';
  }
  if (!data.phoneNumber || !/^01[0125]\d{8}$/.test(data.phoneNumber)) {
    errors.phoneNumber = 'رقم الهاتف غير صالح (مثال: 01012345678)';
  }
  if (!data.gender) {
    errors.gender = 'النوع مطلوب';
  }
  if (!data.address?.trim()) {
    errors.address = 'العنوان مطلوب';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { validateStudentData } from '@/utils/validation';
import { REQUIRED_DOCUMENTS, checkDocumentCompleteness, initializeDocuments } from '@/utils/documents';
import { User, School, Phone, MapPin, FileCheck, AlertTriangle, CheckCircle } from 'lucide-react';

const StudentForm = ({ onSubmit, editingStudent, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    previousSchool: '',
    nationalId: '',
    phoneNumber: '',
    gender: '',
    address: '',
    documents: initializeDocuments()
  });
  const [errors, setErrors] = useState({});
  const [documentCheck, setDocumentCheck] = useState(null);

  const resetForm = () => {
    setFormData({
      fullName: '',
      previousSchool: '',
      nationalId: '',
      phoneNumber: '',
      gender: '',
      address: '',
      documents: initializeDocuments()
    });
    setErrors({});
  };

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        fullName: editingStudent.fullName || '',
        previousSchool: editingStudent.previousSchool || '',
        nationalId: editingStudent.nationalId || '',
        phoneNumber: editingStudent.phoneNumber || '',
        gender: editingStudent.gender || '',
        address: editingStudent.address || '',
        documents: editingStudent.documents || initializeDocuments()
      });
    } else {
      resetForm();
    }
  }, [editingStudent]);

  useEffect(() => {
    const check = checkDocumentCompleteness(formData.documents);
    setDocumentCheck(check);
  }, [formData.documents]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDocumentChange = (docId, received) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docId]: {
          ...prev.documents[docId],
          received
        }
      }
    }));
  };

  const handleDocumentCheck = () => {
    const check = checkDocumentCompleteness(formData.documents);
    
    if (check.missing.length > 0) {
      toast({
        title: "⚠️ مستندات ناقصة",
        description: `المستندات المطلوبة الناقصة: ${check.missing.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "✅ المستندات مكتملة",
      description: "جميع المستندات المطلوبة متوفرة"
    });
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateStudentData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast({
        title: "خطأ في البيانات",
        description: "يرجى تصحيح الأخطاء المذكورة",
        variant: "destructive"
      });
      return;
    }

    if (!documentCheck?.isComplete) {
      toast({
        title: "مستندات ناقصة",
        description: "يرجى استكمال جميع المستندات المطلوبة قبل التسجيل",
        variant: "destructive"
      });
      return;
    }

    const studentData = {
      ...formData,
    };
    if (editingStudent) {
      studentData.id = editingStudent.id;
    }

    onSubmit(studentData);
    
    if (!editingStudent) {
      resetForm();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center gradient-text text-2xl">
            {editingStudent ? 'تعديل بيانات الطالب' : 'تسجيل طالب جديد'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  الاسم الكامل للطالب *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={errors.fullName ? 'border-red-500' : ''}
                  placeholder="أدخل الاسم الكامل"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="previousSchool" className="flex items-center gap-2">
                  <School className="w-4 h-4" />
                  مدرسة الحصول على الشهادة الإعدادية *
                </Label>
                <Input
                  id="previousSchool"
                  value={formData.previousSchool}
                  onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                  className={errors.previousSchool ? 'border-red-500' : ''}
                  placeholder="أدخل اسم المدرسة"
                />
                {errors.previousSchool && (
                  <p className="text-red-500 text-sm">{errors.previousSchool}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationalId">الرقم القومي للطالب *</Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId}
                  onChange={(e) => handleInputChange('nationalId', e.target.value)}
                  className={errors.nationalId ? 'border-red-500' : ''}
                  placeholder="14 رقم"
                  maxLength={14}
                />
                {errors.nationalId && (
                  <p className="text-red-500 text-sm">{errors.nationalId}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  رقم التليفون للطالب *
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                  placeholder="01xxxxxxxxx"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">النوع *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">{errors.gender}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  العنوان بالتفصيل *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={errors.address ? 'border-red-500' : ''}
                  placeholder="أدخل العنوان بالتفصيل"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  المستندات المطلوبة
                </h3>
                {documentCheck && (
                  <div className="flex items-center gap-2">
                    {documentCheck.isComplete ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className="text-sm">
                      {documentCheck.completedRequired}/{documentCheck.totalRequired} مكتمل
                    </span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REQUIRED_DOCUMENTS.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-2 space-x-reverse p-3 rounded-lg glass-effect">
                    <Checkbox
                      id={doc.id}
                      checked={formData.documents[doc.id]?.received || false}
                      onCheckedChange={(checked) => handleDocumentChange(doc.id, checked)}
                    />
                    <Label
                      htmlFor={doc.id}
                      className={`text-sm ${doc.required ? 'font-medium' : 'text-muted-foreground'}`}
                    >
                      {doc.name} {doc.required && '*'}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                onClick={handleDocumentCheck}
                variant="outline"
                className="flex-1"
              >
                <FileCheck className="w-4 h-4 ml-2" />
                فحص المستندات
              </Button>
              <Button
                type="submit"
                className="flex-1 btn-gradient"
                disabled={!documentCheck?.isComplete}
              >
                {editingStudent ? 'تحديث البيانات' : 'إضافة الطالب'}
              </Button>

              {editingStudent && (
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentForm;
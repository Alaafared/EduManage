import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Loader2, Filter, Search, X, FileText, Download, Upload, RefreshCw, Calendar } from 'lucide-react';
import StudentListItem from '@/components/StudentListItem';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StudentList = ({ 
  students = [], 
  loading = false, 
  onEdit, 
  onDelete,
  onImport,
  onRefresh,
  schoolName = "مدرسة الشهيد المقدم محمد عبداللاه صالح الصناعية العسكرية المشتركة" // إضافة prop للعنوان
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [activeFilters, setActiveFilters] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false); // حالة جديدة لزر التحديث

  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (genderFilter !== 'all') count++;
    setActiveFilters(count);
  }, [searchTerm, genderFilter]);

  // حساب عدد الطلبة المسجلين اليوم
  const studentsToday = useMemo(() => {
    if (!Array.isArray(students)) return 0;
    const today = new Date().toISOString().split('T')[0];
    return students.filter(student => {
      return student.registrationDate?.split('T')[0] === today;
    }).length;
  }, [students]);

  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students)) return [];
    return students.filter(student => {
      const searchMatch = !searchTerm || (
        student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.previousSchool?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phoneNumber?.includes(searchTerm) ||
        student.nationalId?.includes(searchTerm)
      );
      const genderMatch = genderFilter === 'all' || student.gender === genderFilter;
      return searchMatch && genderMatch;
    });
  }, [students, searchTerm, genderFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setGenderFilter('all');
    toast({
      title: "تم مسح الفلاتر",
      description: "تم إعادة تعيين جميع الفلاتر",
    });
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await onRefresh(); // انتظار اكتمال التحديث
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredStudents, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `students_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "تم التصدير بنجاح",
      description: `تم تصدير ${filteredStudents.length} سجلات`,
    });
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) {
          onImport(data);
          toast({
            title: "تم الاستيراد بنجاح",
            description: `تم استيراد ${data.length} سجلات`,
          });
        } else {
          throw new Error('تنسيق الملف غير صحيح');
        }
      } catch (error) {
        toast({
          title: "خطأ في الاستيراد",
          description: error.message,
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handlePrint = () => {
    const printContent = `
      <div dir="rtl" style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin-bottom: 5px;">${schoolName}</h2>
          <h2 style="color: #555; margin-top: 0;">تقرير الطلبة</h2>
          <p style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
            تاريخ التقرير: ${new Date().toLocaleDateString()}
          </p>
        </div>
        

        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;text-align: center;">
          <thead>
            <tr style="background-color: #f3f4f6; text-align: center;">
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">الاسم</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">المدرسة السابقة</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">النوع</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">رقم الهاتف</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">العنوان </th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">تاريخ التسجيل</th>
            </tr>
          </thead>
          <tbody>
            ${filteredStudents.map(student => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${student.fullName || '-'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${student.previousSchool || '-'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${student.gender === 'male' ? 'ذكر' : student.gender === 'female' ? 'أنثى' : '-'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${student.phoneNumber || '-'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${student.address || '-'}</td>

                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${student.registrationDate ? new Date(student.registrationDate).toLocaleDateString() : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; text-align: left; font-size: 12px; color: #777;">
          <p>تم الطباعة في ${new Date().toLocaleString()}</p>
           <p>عدد الصفحات: <span class="pageNumber"></span></p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>تقرير الطلبة - ${schoolName}</title>
          <style>
            @media print {
              @page {
                size: A4 ;
                margin: 10mm;
              }
              body {
                font-family: Arial, sans-serif;
                direction: rtl;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
              }
              th {
                background-color: #f3f4f6 !important;
              }
              .pageNumber:after {
                content: counter(page);
              }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* شريط الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-black-600">إجمالي الطلبة</p>
              <p className="text-2xl font-bold text-black-800">
                {loading ? '...' : students.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-black-600">مسجلين اليوم</p>
              <p className="text-2xl font-bold text-black-800">
                {loading ? '...' : studentsToday}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-400" />
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-black-600">عرض النتائج</p>
              <p className="text-2xl font-bold text-black-800">
                {loading ? '...' : filteredStudents.length}
              </p>
            </div>
            <Filter className="w-8 h-8 text-purple-400" />
          </CardContent>
        </Card>
      </div>

      {/* شريط البحث والفلترات والأدوات */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="ابحث بالاسم، المدرسة، العنوان، الرقم القومي أو التليفون..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 border-gray-300 focus-visible:ring-primary w-full"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {isRefreshing ? 'جاري التحديث...' : 'تحديث'}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex-1 sm:w-auto">
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className={`w-full sm:w-[180px] ${genderFilter !== 'all' ? 'bg-primary/10 border-primary' : ''}`}>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="فلتر حسب النوع" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExport}
                className="gap-2"
                disabled={filteredStudents.length === 0}
              >
                <Download className="w-4 h-4" />
                تصدير
              </Button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="import-file"
                />
                <Button
                  variant="outline"
                  asChild
                  className="gap-2"
                >
                  <label htmlFor="import-file">
                    <Upload className="w-4 h-4" />
                    استيراد
                  </label>
                </Button>
              </div>
            </div>

            {activeFilters > 0 && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-1"
              >
                <X className="w-4 h-4" />
                مسح الفلاتر
                <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {activeFilters}
                </span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* شريط الحالة */}
      <div className="flex items-center justify-between bg-gray-50/50 p-3 rounded-lg border border-gray-200">
  <div className="text-sm text-black flex items-center gap-2 font-medium">
    <Users className="w-4 h-4 text-gray-800" />
    <span className="text-gray-900">
      {loading ? 'جاري التحميل...' : `عرض ${filteredStudents.length} من ${students.length} طالب`}
    </span>
  </div>
  
  {!loading && filteredStudents.length > 0 && (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={handlePrint}
      className="text-gray-800 hover:text-white flex items-center gap-1 font-medium"
    >
      <FileText className="w-4 h-4" />
      <span>طباعة التقرير</span>
    </Button>
  )}
</div>

      {/* قائمة الطلبة */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="text-center py-12 flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 mx-auto text-muted-foreground animate-spin" />
              <p className="text-lg text-muted-foreground">جاري تحميل بيانات الطلبة...</p>
            </CardContent>
          </Card>
        ) : filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 flex flex-col items-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                {students.length === 0 ? 'لا توجد طلبة مسجلين بعد' : 'لا توجد نتائج مطابقة للبحث'}
              </p>
              {activeFilters > 0 ? (
                <Button variant="outline" onClick={clearFilters} className="gap-1">
                  <X className="w-4 h-4" />
                  مسح الفلاتر
                </Button>
              ) : (
                onRefresh && (
                  <Button variant="default" onClick={handleRefresh} className="gap-1">
                    <RefreshCw className="w-4 h-4" />
                    إعادة تحميل البيانات
                  </Button>
                )
              )}
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence mode="wait">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <StudentListItem
                  student={student}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(StudentList);
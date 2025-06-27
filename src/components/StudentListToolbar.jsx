import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Users, Filter, FileText, Download, Upload, CalendarCheck2 } from 'lucide-react';
import { exportToJSON, importFromJSON } from '@/utils/export';

const StudentListToolbar = ({ 
  students = [], 
  filteredStudents = [], 
  filters = {}, 
  showFilters, 
  onToggleFilters, 
  onImport 
}) => {
  const { toast } = useToast();

  const studentsRegisteredToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return students.filter(s => s.registrationDate?.slice(0, 10) === today).length;
  }, [students]);

  const handleExport = () => {
    try {
      exportToJSON(students, 'students_backup');
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير نسخة احتياطية من بيانات الطلبة",
      });
    } catch (error) {
      toast({
        title: "خطأ في التصدير",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromJSON(file);
      onImport(data);
      toast({
        title: "تم الاستيراد بنجاح",
        description: `تم استيراد ${data.length} طالب بنجاح`,
      });
    } catch (error) {
      toast({
        title: "خطأ في الاستيراد",
        description: error.message,
        variant: "destructive"
      });
    }
    
    event.target.value = '';
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formattedDate = (dateString) => {
      if (!dateString) return 'غير متوفر';
      try {
        return new Date(dateString).toLocaleString('ar-EG', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace('،', ' ');
      } catch {
        return 'تاريخ غير صالح';
      }
    };

    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => {
        switch (key) {
          case 'gender': 
            return `النوع: ${value === 'male' ? 'ذكر' : 'أنثى'}`;
          default:
            return `${key}: ${value}`;
        }
      });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>تقرير الطلبة المسجلين</title>
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .school-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .report-title { font-size: 18px; color: #666; }
          .info { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .total { margin-top: 20px; font-weight: bold; }
          .filters { background: #f9f9f9; padding: 10px; margin-bottom: 20px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">مدرسة الشهيد المقدم محمد عبداللاه صالح الصناعية</div>
          <div class="report-title">تقرير الطلبة المسجلين - المرحلة الثانوية الصناعية</div>
        </div>
        <div class="info">
          <strong>تاريخ التقرير:</strong> ${new Date().toLocaleString('ar-EG')}<br>
          <strong>إجمالي الطلبة:</strong> ${filteredStudents.length}
        </div>
        ${activeFilters.length > 0 ? `
          <div class="filters">
            <strong>المرشحات المطبقة:</strong><br>
            ${activeFilters.join('<br>')}
          </div>
        ` : ''}
        <table>
          <thead>
            <tr>
              <th>م</th>
              <th>الاسم الكامل</th>
              <th>المدرسة الإعدادية</th>
              <th>الرقم القومي</th>
              <th>التليفون</th>
              <th>النوع</th>
              <th>العنوان</th>
              <th>تاريخ التسجيل</th>
            </tr>
          </thead>
          <tbody>
            ${filteredStudents.map((student, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${student.fullName || 'غير متوفر'}</td>
                <td>${student.previousSchool || 'غير متوفر'}</td>
                <td>${student.nationalId || 'غير متوفر'}</td>
                <td>${student.phoneNumber || 'غير متوفر'}</td>
                <td>${student.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
                <td>${student.address || 'غير متوفر'}</td>
                <td>${formattedDate(student.registrationDate)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            <span>إدارة الطلبة المسجلين</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="px-4 py-1 bg-blue-100 dark:bg-blue-100/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center gap-1">
              <Users className="w-4 h-4" />
              اجمالي عدد الطلبة المسجلين: {students.length}
            </span>
            <span className="px-4 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center gap-1">
              <CalendarCheck2 className="w-4 h-4" />
              عدد الطلبة المسجلين اليوم: {studentsRegisteredToday}
            </span>
            {/* <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center gap-1">
              <Filter className="w-4 h-4" />
              المعروض: {filteredStudents.length}
            </span> */}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={onToggleFilters}
            variant={showFilters ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'إخفاء الفلتر' : 'عرض الفلتر'}
          </Button>
          
          <Button 
            onClick={handlePrint} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            طباعة التقرير
          </Button>
          
          <Button 
            onClick={handleExport} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            تصدير JSON
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="import-json"
            />
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              asChild
            >
              <label htmlFor="import-json">
                <Upload className="w-4 h-4" />
                استيراد JSON
              </label>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(StudentListToolbar);
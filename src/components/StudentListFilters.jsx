import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const recorded = [
  { id: 1, name: 'الاستاذ ايمن رسلان' },
  { id: 2, name: 'الاستاذ احمد الديب' },
  { id: 3, name: 'الاستاذ هاني ماهر' },
  { id: 4, name: 'الاستاذ ابراهيم عبدالرحيم' },
  { id: 5, name: 'الاستاذ علاء حسن' },
  { id: 6, name: 'الاستاذ محمد صبري' },
  { id: 7, name: 'الاستاذ محمد عبدالقادر' },
  { id: 8, name: 'الاستاذ فريد شوقي' },
  { id: 9, name: 'الاستاذ سيد فرج' },
  { id: 10, name: 'الاستاذ محمد فؤاد' }
];

const StudentListFilters = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* حقل الاسم */}
            <div className="space-y-2">
              <Label htmlFor="fullNameFilter">الاسم الكامل</Label>
              <Input
                id="fullNameFilter"
                placeholder="ابحث بالاسم"
                value={filters.fullName}
                onChange={(e) => onFilterChange('fullName', e.target.value)}
              />
            </div>

            {/* حقل المدرسة */}
            <div className="space-y-2">
              <Label htmlFor="previousSchoolFilter">المدرسة السابقة</Label>
              <Input
                id="previousSchoolFilter"
                placeholder="ابحث بالمدرسة"
                value={filters.previousSchool}
                onChange={(e) => onFilterChange('previousSchool', e.target.value)}
              />
            </div>

            {/* حقل النوع */}
            <div className="space-y-2">
              <Label htmlFor="genderFilter">النوع</Label>
              <Select 
                value={filters.gender} 
                onValueChange={(value) => onFilterChange('gender', value)}
              >
                <SelectTrigger id="genderFilter">
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* حقل مسجل البيانات */}
            <div className="space-y-2">
              <Label htmlFor="recordedFilter">مسجل البيانات</Label>
              <Select
                value={filters.recorded}
                onValueChange={(value) => onFilterChange('recorded', value)}
              >
                <SelectTrigger id="recordedFilter">
                  <SelectValue placeholder="اختر المسجل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  {recorded.map((recorded) => (
                    <SelectItem key={recorded.id} value={recorded.name}>
                      {recorded.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* حقل التليفون */}
            <div className="space-y-2">
              <Label htmlFor="phoneFilter">رقم التليفون</Label>
              <Input
                id="phoneFilter"
                placeholder="ابحث برقم التليفون"
                value={filters.phoneNumber}
                onChange={(e) => onFilterChange('phoneNumber', e.target.value)}
              />
            </div>
          </div>

          {/* زر مسح الفلاتر */}
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={onClearFilters} 
              variant="outline"
              className="flex items-center gap-2"
            >
              مسح جميع الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentListFilters;

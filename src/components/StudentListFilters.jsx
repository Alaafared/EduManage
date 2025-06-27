import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

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

            {/* حقل العنوان */}
            <div className="space-y-2">
              <Label htmlFor="addressFilter">العنوان</Label>
              <Input
                id="addressFilter"
                placeholder="ابحث بالعنوان"
                value={filters.address}
                onChange={(e) => onFilterChange('address', e.target.value)}
              />
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
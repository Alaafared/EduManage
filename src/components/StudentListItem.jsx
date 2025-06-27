import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { checkDocumentCompleteness } from '@/utils/documents';
import { useToast } from '@/components/ui/use-toast';
import { Download, Filter, Plus } from 'lucide-react';

const StudentListItem = ({ student, index, onEdit, onDelete }) => {
  const { toast } = useToast();
  const docCheck = checkDocumentCompleteness(student.documents || {});

  const handleDelete = () => {
    onDelete(student.id);
  };

  return (
    <motion.div
      key={student.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold text-lg">{student.fullName}</p>
                <p className="text-sm text-muted-foreground">{student.previousSchool}</p>
              </div>
              <div>
                <p className="text-sm"><span className="font-medium">الرقم القومي:</span> {student.nationalId}</p>
                <p className="text-sm"><span className="font-medium">التليفون:</span> {student.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm"><span className="font-medium">النوع:</span> {student.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                <p className="text-sm"><span className="font-medium">العنوان:</span> {student.address}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                docCheck.isComplete ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {docCheck.isComplete ? 'مستندات مكتملة' : 'مستندات ناقصة'}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => onEdit(student)} size="sm" variant="outline" className="flex items-center gap-1">
                  <Edit className="w-4 h-4" /> تعديل
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="flex items-center gap-1">
                      <Trash2 className="w-4 h-4" /> حذف
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                      <AlertDialogDescription>
                        هل أنت متأكد من حذف الطالب "{student.fullName}"؟ سيتم مسح جميع بياناته نهائياً ولا يمكن التراجع عن هذا الإجراء.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                        حذف نهائي
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentListItem;
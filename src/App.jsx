import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import StudentForm from '@/components/StudentForm';
import StudentList from '@/components/StudentList';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { GraduationCap, UserPlus, Users, Settings, Database, CheckCircle, LogOut, CalendarCheck2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Login from '@/components/Login';

function App() {
  const { toast } = useToast();
  const { user, session, signOut } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('register');
  const [isDarkTheme, setIsDarkTheme] = useLocalStorage('darkTheme', true);

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
  }, [isDarkTheme]);

  const fetchStudents = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "لم نتمكن من جلب قائمة الطلبة من قاعدة البيانات.",
        variant: "destructive"
      });
      const formattedStudents = data.map(student => ({
        ...student,
        recorded: student.recorded || 'غير محدد' // إضافة هذا السطر
      }));
    } else {
      setStudents(data);
    }
    setLoading(false);
  }, [toast, user]);

  useEffect(() => {
    if (session) {
      fetchStudents();
    }
  }, [session, fetchStudents]);

  const handleAddStudent = async (studentData) => {
    const { fullName, previousSchool, nationalId, phoneNumber, gender, address, documents, recorded } = studentData;
    
     const payload = { 
    fullName, 
    previousSchool, 
    nationalId, 
    phoneNumber, 
    gender, 
    address, 
    documents,
    recorded, // إضافة هذا السطر
  };

    if (editingStudent) {
      const { data, error } = await supabase
        .from('students')
        .update(payload)
        .eq('id', editingStudent.id)
        .select();

      if (error) {
        console.error('Error updating student:', error);
        toast({ title: "فشل التحديث", description: error.message, variant: "destructive" });
      } else {
        setStudents(prev => prev.map(s => (s.id === editingStudent.id ? data[0] : s)));
        toast({ title: "تم التحديث بنجاح", description: `تم تحديث بيانات الطالب ${fullName}` });
        setEditingStudent(null);
        setActiveTab('list');
      }
    } else {
       const { data: existingStudent, error: checkError } = await supabase
        .from('students')
        .select('id')
        .eq('nationalId', nationalId)
        .maybeSingle();

      if (checkError) {
        toast({ title: "خطأ", description: "حدث خطأ أثناء التحقق من الرقم القومي.", variant: "destructive" });
        return;
      }

      if (existingStudent) {
        toast({ title: "خطأ في التسجيل", description: "يوجد طالب مسجل بنفس الرقم القومي", variant: "destructive" });
        return;
      }

      const insertPayload = { ...payload, user_id: user.id, registrationDate: new Date().toISOString() };
      
      const { data, error } = await supabase
        .from('students')
        .insert([insertPayload])
        .select();

      if (error) {
        console.error('Error adding student:', error);
        toast({ title: "فشل التسجيل", description: error.message, variant: "destructive" });
      } else {
        setStudents(prev => [data[0], ...prev]);
        toast({ title: "تم التسجيل بنجاح", description: `تم تسجيل الطالب ${fullName}` });
        setActiveTab('list');
      }
    }
  };
  
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setActiveTab('register');
  };

  const handleDeleteStudent = async (studentId) => {
    const { error } = await supabase.from('students').delete().eq('id', studentId);

    if (error) {
      console.error('Error deleting student:', error);
      toast({ title: "فشل الحذف", description: error.message, variant: "destructive" });
    } else {
      setStudents(prev => prev.filter(s => s.id !== studentId));
      toast({ title: "تم الحذف بنجاح" });
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };
  
  const handleImportStudents = async (importedStudents) => {
    if (!user) {
        toast({ title: "خطأ", description: "يجب تسجيل الدخول أولاً", variant: "destructive" });
        return;
    }
    if (!Array.isArray(importedStudents)) {
      toast({ title: "خطأ في الاستيراد", description: "تنسيق الملف غير صحيح", variant: "destructive" });
      return;
    }

    const studentsToUpsert = importedStudents.map(s => {
        const { id, created_at, ...rest } = s;
        return {
            ...rest,
            phoneNumber: s.phoneNumber || s.phone,
            user_id: user.id,
            registrationDate: s.registrationDate || new Date().toISOString(),
        };
    });

    const { error } = await supabase.from('students').upsert(studentsToUpsert, { onConflict: 'nationalId' });

    if (error) {
      toast({ title: "خطأ في استيراد البيانات", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم الاستيراد بنجاح", description: "تم استيراد البيانات ومزامنتها." });
      fetchStudents();
    }
  };

  const studentsRegisteredToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return students.filter(s => s.registrationDate && s.registrationDate.slice(0, 10) === today).length;
  }, [students]);

  if (!session) {
    return <Login />;
  }

  return (
    <>
      <Helmet>
        <title>نظام تسجيل الطلبة - مدرسة الشهيد المقدم محمد عبداللاه صالح الصناعية العسكرية</title>
        <meta name="description" content="نظام إلكتروني متكامل لتسجيل وإدارة طلبة المرحلة الثانوية الصناعية مع إمكانية إدارة البيانات وطباعة التقارير" />
      </Helmet>

      <div className="min-h-screen pattern-bg">
        <div className="container mx-auto px-4 py-8">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-4">
                 <img  alt="شعار المدرسة" className="w-16 h-16 rounded-full" src="/image/logo.jpg" />
               </div>
              <div className="flex items-center gap-4">
                <ThemeToggle isDark={isDarkTheme} onToggle={() => setIsDarkTheme(!isDarkTheme)} />
                <Button onClick={signOut} variant="outline" size="sm" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </Button>
              </div>
            </div>
            <motion.div
              className="animate-float"
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <h1 className="text-4xl md:text-4xl font-bold gradient-text mb-4">
                مدرسة الشهيد المقدم محمد عبداللاه صالح الصناعية العسكرية
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-2">
                نظام تسجيل طلبة الصف الأول للعام الدراسي 2024 / 2025
              </p>
              <div className="flex items-center justify-center gap-2 text-lg">
                <GraduationCap className="w-6 h-6" />
                <span>إدارة شاملة للطلبة والمستندات</span>
              </div>
            </motion.div>
          </motion.header>

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  {editingStudent ? 'تعديل الطالب' : 'تسجيل طالب'}
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  قائمة الطلبة ({students.length})
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  الإعدادات
                </TabsTrigger>
              </TabsList>
              <TabsContent value="register">
                <StudentForm
                  onSubmit={handleAddStudent}
                  editingStudent={editingStudent}
                  onCancel={handleCancelEdit}
                />
              </TabsContent>
              <TabsContent value="list">
                <StudentList
                  students={students}
                  loading={loading}
                  onEdit={handleEditStudent}
                  onDelete={handleDeleteStudent}
                  onImport={handleImportStudents}
                />
              </TabsContent>
              <TabsContent value="settings">
                 <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="grid gap-6">
                    <div className="glass-effect rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">إعدادات النظام</h3>
                       <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>المظهر الحالي</span>
                          <ThemeToggle isDark={isDarkTheme} onToggle={() => setIsDarkTheme(!isDarkTheme)} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>حالة الاتصال بـ Supabase</span>
                           <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>متصل</span>
                          </div>
                        </div>
                         <div className="flex items-center justify-between">
                          <span>مزامنة البيانات</span>
                          <Button onClick={fetchStudents} variant="outline" size="sm" className="flex items-center gap-2">
                             <Database className="w-4 h-4" />
                            إعادة المزامنة
                          </Button>
                        </div>
                      </div>
                    </div>
                     <div className="glass-effect rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">إحصائيات النظام</h3>
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-500/20 rounded-lg">
                          <div className="text-2xl font-bold">{students.length}</div>
                          <div className="text-sm text-muted-foreground">إجمالي الطلبة</div>
                        </div>
                        <div className="text-center p-4 bg-purple-500/20 rounded-lg">
                          <div className="text-2xl font-bold">{studentsRegisteredToday}</div>
                          <div className="text-sm text-muted-foreground">تسجيل اليوم</div>
                        </div>
                        <div className="text-center p-4 bg-green-500/20 rounded-lg">
                          <div className="text-2xl font-bold">
                            {students.filter(s => s.documents && checkDocumentCompleteness(s.documents).isComplete).length}
                          </div>
                          <div className="text-sm text-muted-foreground">مستندات مكتملة</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
                          <div className="text-2xl font-bold">
                             {students.filter(s => !s.documents || !checkDocumentCompleteness(s.documents).isComplete).length}
                          </div>
                          <div className="text-sm text-muted-foreground">مستندات ناقصة</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.main>
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center text-muted-foreground"
          >
            <div className="glass-effect rounded-lg p-6">
              <p className="mb-2">
                © {new Date().getFullYear()} مدرسة الشهيد المقدم محمد عبداللاه صالح الصناعية العسكرية
              </p>
              <p className="text-sm">
  نظام إدارة الطلبة الإلكتروني - جميع الحقوق محفوظة <span style={{ color: 'black', fontWeight: 'bold' }}>تصميم أ / علاء فريد</span>
</p>
            </div>
          </motion.footer>
        </div>
      </div>
    </>
  );
}

function checkDocumentCompleteness(documents) {
    const REQUIRED_DOC_IDS = [ 'birthCertificate', 'graduationCertificate', 'personalPhotos', 'guardianId', 'feeReceipt', 'unionStamp', 'developmentStamp', 'applicationFile' ];
    if (!documents) return { isComplete: false };
    return { isComplete: REQUIRED_DOC_IDS.every(id => documents[id] && documents[id].received) };
}

export default App;

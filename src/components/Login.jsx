import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { GraduationCap, LogIn } from 'lucide-react';

const Login = () => {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const authMethod = isSignUp ? signUp : signIn;
    const { error } = await authMethod(email, password);
    if (!error && isSignUp) {
      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'تم إرسال رابط تأكيد إلى بريدك الإلكتروني. يرجى التحقق منه.',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pattern-bg p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* <GraduationCap className="mx-auto h-12 w-12 mb-4 text-primary" /> */}
              <div className="flex justify-center mb-4">
  <img  src="/image/logo-white.png" // مسار صورة الشعار
    alt="شعار مدرسة الشهيد المقدم محمد عبداللاه صالح"
    className="h-20 w-20 rounded-full object-cover border-4 border-primary shadow-lg " // يمكن تعديل الأبعاد حسب الحاجة
  />
</div>
              <CardTitle className="gradient-text text-2xl">نظام تسجيل الطلبة</CardTitle>
              <CardTitle className="text-xl font-semibold text-primary">مدرسة الشهيد المقدم محمد عبداللاه صالح</CardTitle>
              <CardDescription>
                {isSignUp ? 'إنشاء حساب جديد للوصول للنظام' : 'تسجيل الدخول إلى حسابك'}
              </CardDescription>
            </motion.div>
          </CardHeader>
          <form onSubmit={handleAuth}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full btn-gradient" disabled={loading}>
                {loading ? 'جاري التحميل...' : (isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول الى حسابك')}
                {!loading && <LogIn className="mr-2 h-4 w-4" />}
              </Button>
              {/* <Button
                type="button"
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={loading}
              >
                {isSignUp ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب جديد'}
              </Button> */}
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
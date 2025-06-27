import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ThemeToggle = ({ isDark, onToggle }) => {
  const { toast } = useToast();

  const handleToggle = () => {
    onToggle();
    toast({
      title: "تم تغيير المظهر",
      description: isDark ? "تم التبديل إلى المظهر الفاتح" : "تم التبديل إلى المظهر الداكن"
    });
  };

  return (
    <Button
      onClick={handleToggle}
      variant="outline"
      size="sm"
      className="theme-toggle"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="mr-2">{isDark ? 'فاتح' : 'داكن'}</span>
    </Button>
  );
};

export default ThemeToggle;
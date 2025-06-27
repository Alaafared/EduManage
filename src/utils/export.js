export const exportToJSON = (data, filename = 'students_backup') => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('ملف غير صالح'));
      }
    };
    
    reader.onerror = () => reject(new Error('خطأ في قراءة الملف'));
    reader.readAsText(file);
  });
};

export const generatePrintableReport = (students, filters = {}) => {
  const filteredStudents = students.filter(student => {
    if (filters.name && !student.fullName.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    if (filters.school && !student.previousSchool.toLowerCase().includes(filters.school.toLowerCase())) {
      return false;
    }
    if (filters.gender && student.gender !== filters.gender) {
      return false;
    }
    if (filters.address && !student.address.toLowerCase().includes(filters.address.toLowerCase())) {
      return false;
    }
    if (filters.phoneNumber && !student.phoneNumber.includes(filters.phoneNumber)) {
      return false;
    }
    return true;
  });

  return {
    students: filteredStudents,
    totalCount: filteredStudents.length,
    generatedAt: new Date().toLocaleString('ar-EG'),
    filters: filters
  };
};
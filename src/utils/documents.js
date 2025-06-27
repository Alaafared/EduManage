export const REQUIRED_DOCUMENTS = [
  {
    id: 'birthCertificate',
    name: 'أصل شهادة الميلاد + 3 صور',
    required: true
  },
  {
    id: 'graduationCertificate',
    name: 'أصل شهادة النجاح في الشهادة الإعدادية + 3 صور',
    required: true
  },
  {
    id: 'personalPhotos',
    name: '6 صور شخصية حديثة',
    required: true
  },
  {
    id: 'guardianId',
    name: 'صورة من بطاقة الرقم القومي لولي الأمر',
    required: true
  },
  {
    id: 'feeReceipt',
    name: 'إيصال سداد المصروفات الدراسية + 3 صور',
    required: true
  },
  {
    id: 'unionStamp',
    name: 'طابع نقابة مهن تعليمية (1 جنيه)',
    required: true
  },
  {
    id: 'developmentStamp',
    name: 'طابع دعم وتنمية المشروعات التعليمية (10 جنيهات)',
    required: true
  },
  {
    id: 'applicationFile',
    name: 'ملف التقديم (طلب الالتحاق + دمغات حكومية)',
    required: true
  },
  {
    id: 'preferencesForm',
    name: 'استمارة الرغبات',
    required: true
  },
  {
    id: 'conductForm',
    name: 'استمارة حسن السير والسلوك',
    required: true
  },
  {
    id: 'healthCertificate',
    name: 'الشهادة الصحية',
    required: true
  }
];

export const checkDocumentCompleteness = (documents) => {
  const missing = [];
  const incomplete = [];

  REQUIRED_DOCUMENTS.forEach(doc => {
    const studentDoc = documents[doc.id];
    
    if (doc.required && (!studentDoc || !studentDoc.received)) {
      missing.push(doc.name);
    } else if (studentDoc && !studentDoc.received) {
      incomplete.push(doc.name);
    }
  });

  return {
    isComplete: missing.length === 0,
    missing,
    incomplete,
    totalRequired: REQUIRED_DOCUMENTS.filter(doc => doc.required).length,
    completedRequired: REQUIRED_DOCUMENTS.filter(doc => doc.required && documents[doc.id]?.received).length
  };
};

export const initializeDocuments = () => {
  const docs = {};
  REQUIRED_DOCUMENTS.forEach(doc => {
    docs[doc.id] = {
      received: false,
      notes: ''
    };
  });
  return docs;
};
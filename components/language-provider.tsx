"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin Panel',
    'nav.settings': 'Settings',
    'nav.reports': 'Reports',
    
    // Dashboard
    'dashboard.title': 'NeuroAlert Dashboard',
    'dashboard.subtitle': 'AI-Powered EEG Health Monitoring',
    'dashboard.realtime': 'Real-time EEG Monitoring',
    'dashboard.status': 'Health Status',
    'dashboard.predictions': 'AI Predictions',
    'dashboard.history': 'Historical Data',
    'dashboard.start_session': 'Start New Session',
    'dashboard.stop_session': 'Stop Session',
    
    // Health Status
    'health.normal': 'Normal',
    'health.mild_anomaly': 'Mild Anomaly',
    'health.cognitive_fatigue': 'Cognitive Fatigue',
    'health.early_risk': 'Early Risk',
    'health.confidence': 'Confidence',
    'health.recommendation': 'Recommendation',
    
    // EEG Waves
    'eeg.alpha': 'Alpha Waves',
    'eeg.beta': 'Beta Waves',
    'eeg.theta': 'Theta Waves',
    'eeg.delta': 'Delta Waves',
    'eeg.gamma': 'Gamma Waves',
    'eeg.frequency': 'Frequency (Hz)',
    'eeg.amplitude': 'Amplitude (μV)',
    
    // Admin Panel
    'admin.title': 'Admin Panel',
    'admin.users': 'User Management',
    'admin.sessions': 'Active Sessions',
    'admin.system': 'System Status',
    'admin.analytics': 'Analytics',
    
    // Reports
    'reports.generate': 'Generate Report',
    'reports.download': 'Download PDF',
    'reports.monthly': 'Monthly Report',
    'reports.summary': 'Health Summary',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.disclaimer': 'NeuroAlert is a predictive health assistant. It is not a diagnostic or therapeutic tool.',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.admin': 'لوحة الإدارة',
    'nav.settings': 'الإعدادات',
    'nav.reports': 'التقارير',
    
    // Dashboard
    'dashboard.title': 'لوحة تحكم نيوروألرت',
    'dashboard.subtitle': 'مراقبة صحة الدماغ بالذكاء الاصطناعي',
    'dashboard.realtime': 'مراقبة الموجات الدماغية المباشرة',
    'dashboard.status': 'الحالة الصحية',
    'dashboard.predictions': 'توقعات الذكاء الاصطناعي',
    'dashboard.history': 'البيانات التاريخية',
    'dashboard.start_session': 'بدء جلسة جديدة',
    'dashboard.stop_session': 'إيقاف الجلسة',
    
    // Health Status
    'health.normal': 'طبيعي',
    'health.mild_anomaly': 'شذوذ طفيف',
    'health.cognitive_fatigue': 'إرهاق معرفي',
    'health.early_risk': 'خطر مبكر',
    'health.confidence': 'الثقة',
    'health.recommendation': 'التوصية',
    
    // EEG Waves
    'eeg.alpha': 'موجات ألفا',
    'eeg.beta': 'موجات بيتا',
    'eeg.theta': 'موجات ثيتا',
    'eeg.delta': 'موجات دلتا',
    'eeg.gamma': 'موجات جاما',
    'eeg.frequency': 'التردد (هرتز)',
    'eeg.amplitude': 'السعة (ميكروفولت)',
    
    // Admin Panel
    'admin.title': 'لوحة الإدارة',
    'admin.users': 'إدارة المستخدمين',
    'admin.sessions': 'الجلسات النشطة',
    'admin.system': 'حالة النظام',
    'admin.analytics': 'التحليلات',
    
    // Reports
    'reports.generate': 'إنشاء تقرير',
    'reports.download': 'تحميل PDF',
    'reports.monthly': 'التقرير الشهري',
    'reports.summary': 'ملخص الصحة',
    
    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.loading': 'جارٍ التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.warning': 'تحذير',
    'common.disclaimer': 'نيوروألرت هو مساعد صحي تنبؤي. وهو ليس أداة تشخيصية أو علاجية.',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.className = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('neuroalert-language', lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem('neuroalert-language') as Language;
    if (saved && ['en', 'ar'].includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
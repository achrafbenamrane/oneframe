'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Lang = 'en' | 'ar';

type Dict = Record<string, { en: string; ar: string }>;

const dict: Dict = {
  makeOrderTitle: { en: 'MakeOrder', ar: 'اتمم الطلب' },
  sendOrderBelow: { en: 'Send us your order details below', ar: 'أرسل لنا تفاصيل طلبك أدناه' },
  productId: { en: 'Product ID', ar: 'معرّف المنتج' },
  name: { en: 'Your name', ar: 'اسمك' },
  email: { en: 'Your email', ar: 'بريدك الإلكتروني' },
  number: { en: 'Your phone number', ar: 'رقم هاتفك' },
  message: { en: 'Your order details', ar: 'تفاصيل طلبك' },
  buy: { en: 'Buy', ar: 'شراء' },
  buyNow: { en: 'Buy Now', ar: 'اشتري الآن' },
  details: { en: 'Details', ar: 'تفاصيل' },
  sending: { en: 'Sending...', ar: 'جارٍ الإرسال...' },
  orderSentSuccess: { en: 'Order sent successfully!', ar: 'تم إرسال الطلب بنجاح!' },
  bestSeller: { en: 'Best Seller', ar: 'الأكثر مبيعًا' },
  ownIt: { en: 'Own it', ar: 'امتلكه' },
  priceSymbol: { en: '$', ar: '$' },
  carouselPlaceholder: { en: 'Carousel placeholder', ar: 'معرض الصور' },
  productTitle: { en: 'Nike Airforce1 Premium', ar: 'نايك ايرفورس1 بريميوم' },
  productDescription: {
    en: 'Step back into classic hoops style with a durable leather. Best for casual wear, comfort and timeless look.',
    ar: 'عُد إلى أسلوب السلة الكلاسيكي بجلد متين. مثالي للارتداء اليومي والراحة والمظهر الخالد.'
  },
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: keyof typeof dict) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('lang') as Lang | null) : null;
    if (saved === 'ar' || saved === 'en') setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('lang', lang);
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((p) => (p === 'en' ? 'ar' : 'en')), []);

  const t = useCallback((key: keyof typeof dict) => dict[key][lang], [lang]);

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, setLang, toggleLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider');
  return ctx;
}

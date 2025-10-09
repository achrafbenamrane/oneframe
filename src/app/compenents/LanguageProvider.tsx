'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'en' | 'ar';

type Dict = Record<string, { en: string; ar: string }>; 

const dict: Dict = {
  // General
  makeOrderTitle: { en: 'Complete your order', ar: 'اتمم الطلب' },
  sendOrderBelow: { en: 'Fill the full information to place your order', ar: 'املأ المعلومات كاملة للطلب' },
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

  // Order form specific
  formHeader: { en: 'Fill the complete information for the order', ar: 'املأ المعلومات كاملة للطلب' },
  nameLabel: { en: 'Full name', ar: 'الاسم واللقب' },
  namePlaceholder: { en: 'Enter your full name here', ar: 'أدخل اسمك ولقبك هنا' },
  phoneLabel: { en: 'Phone number', ar: 'رقم الهاتف' },
  phonePlaceholder: { en: 'Enter your phone number here', ar: 'أدخل رقم هاتفك هنا' },
  wilayaLabel: { en: 'Wilaya', ar: 'الولاية' },
  communeLabel: { en: 'Commune', ar: 'البلدية' },
  productPriceLabel: { en: 'Product price', ar: 'سعر المنتج' },
  deliveryPriceLabel: { en: 'Delivery price', ar: 'سعر التوصيل' },
  totalPriceLabel: { en: 'Total price', ar: 'السعر الإجمالي' },
  confirmOrder: { en: 'Confirm order', ar: 'تأكيد الطلب' },
  vehicleLabel: { en: 'Vehicle', ar: 'نوع المركبة' },
  vehiclePlaceholder: { en: 'Selected vehicle', ar: 'نوع المركبة المختار' },
  selectVehicleFirst: { en: 'Please select a vehicle first.', ar: 'يرجى اختيار نوع المركبة أولاً.' },
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
      const html = document.documentElement;
      const currentDir = html.getAttribute('dir');
      const newDir = lang === 'ar' ? 'rtl' : 'ltr';
      if (currentDir !== newDir) html.setAttribute('dir', newDir);
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

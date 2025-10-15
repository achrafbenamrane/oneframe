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

  // NEW: Carousel specific translations
  exploreVehicles: { en: 'OneFrame for One Algerian Owner', ar: 'ون فريم لمالك جزائري واحد' },
  dragToBrowse: { en: 'When u buy One of OneFrame products you gonna be the One algerian , the One owner and the Only  One  who have this product ', ar: 'اسحب لتصفح مجموعتنا' },
  orderNow: { en: 'Order Now', ar: 'اطلب الآن' },
  discoverMore: { en: 'Discover More', ar: 'اكتشف المزيد' },
  hoverToPlay: { en: 'Hover to play', ar: 'مرّر للتشغيل' },
  playing: { en: 'Playing', ar: 'قيد التشغيل' },
  previousCard: { en: 'Previous card', ar: 'البطاقة السابقة' },
  nextCard: { en: 'Next card', ar: 'البطاقة التالية' },
  goToCard: { en: 'Go to card', ar: 'اذهب إلى البطاقة' },
  videoSectionTitle: { en: 'Explore Our Products Values', ar: 'استكشف قيم منتجاتنا' },
  videoSectionSubtitle: { en: 'Video Section', ar: 'قسم الفيديو' },
  goToBuyOne: { en: 'Go To Buy One', ar: 'اذهب للشراء' },
  
  // NEW: Specific vehicle names
  van: { en: 'VanLife', ar: 'فان' },
  camaro: { en: 'Camaro ZL1', ar: 'كامارو' },
  landRover: { en: 'Algerian Arizona', ar: 'أريزونا الجزائر'},
  bike: { en: 'Bike', ar: 'دراجة' },
  f1: { en: 'F1', ar: 'فورمولا 1' },
  mercedesGTR: { en: 'Mercedes GTR', ar: 'مرسيدس جي تي آر' },

  // NEW: Vehicle descriptions
  vanDescription: { 
    en: 'Spacious and reliable van perfect for commercial use and large families. Great for transportation and delivery services.', 
    ar: 'فان واسع وموثوق مثالي للاستخدام التجاري والعائلات الكبيرة. رائع لخدمات النقل والتوصيل.' 
  },
  camaroDescription: { 
    en: 'Sporty and powerful muscle car with exceptional performance and sleek design. Perfect for car enthusiasts.', 
    ar: 'سيارة عضلية رياضية وقوية بأداء استثنائي وتصميم أنيق. مثالية لعشاق السيارات.' 
  },
  landRoverDescription: { 
    en: 'Luxurious SUV with superior off-road capabilities and premium comfort. Ideal for adventure and family trips.', 
    ar: 'سيارة دفع رباعي فاخرة بإمكانيات متطورة خارج الطرق وراحة فائقة. مثالية للمغامرات والرحلات العائلية.' 
  },
  bikeDescription: { 
    en: 'High-performance motorcycle with excellent fuel efficiency and agile handling. Great for urban commuting.', 
    ar: 'دراجة نارية عالية الأداء بكفاءة وقود ممتازة وتوجيه رشيق. رائعة للتنقل الحضري.' 
  },
  f1Description: { 
    en: 'Racing car with cutting-edge technology and unparalleled performance. Built for speed and precision.', 
    ar: 'سيارة سباق بتقنية متطورة وأداء لا مثيل له. مصممة للسرعة والدقة.' 
  },
  mercedesGTRDescription: { 
    en: 'High-performance sports car with luxury features and track-ready capabilities. The ultimate driving machine.', 
    ar: 'سيارة رياضية عالية الأداء بميزات فاخرة وإمكانيات جاهزة للمسار. آلة القيادة المثالية.' 
  },

  // Footer and shared UI
  contactUs: { en: 'Contact Us', ar: 'اتصل بنا' },
  followUs: { en: 'Follow Us', ar: 'تابعنا' },
  brandTagline: { 
    en: 'OneFrame is a creative brand where every frame captures emotion, depth, and imagination — transforming 3D art into stories you can see, feel, and connect with', 
    ar: 'ون فريم علامة إبداعية حيث يلتقط كل إطار الإحساس والعمق والخيال — نحول الفن ثلاثي الأبعاد إلى قصص يمكن رؤيتها والشعور بها والارتباط بها' 
  },
  facebook: { en: 'Facebook', ar: 'فيسبوك' },
  instagram: { en: 'Instagram', ar: 'إنستغرام' },
  tiktok: { en: 'TikTok', ar: 'تيك توك' },
  idLabel: { en: 'ID', ar: 'المعرّف' },
  noProducts: { en: 'No products available', ar: 'لا توجد منتجات متاحة' },
  previousProduct: { en: 'Previous product', ar: 'المنتج السابق' },
  nextProduct: { en: 'Next product', ar: 'المنتج التالي' },
  goToSlide: { en: 'Go to slide', ar: 'اذهب إلى الشريحة' },
  ofLabel: { en: 'of', ar: 'من' },
  // Product details modal
  close: { en: 'Close', ar: 'إغلاق' },
  previousImage: { en: 'Previous image', ar: 'الصورة السابقة' },
  nextImage: { en: 'Next image', ar: 'الصورة التالية' },
  noImage: { en: 'No image available', ar: 'لا توجد صورة متاحة' },
  expected: { en: 'Expected:', ar: 'المتوقّع:' },

  // Video card specific titles
  videoCard1Title: { en: 'Buy one for your real big car', ar: 'اشترِ واحدًا لسيارتك الكبيرة' },
  videoCard2Title: { en: 'LED Detector Effect', ar: 'تأثير مستشعر LED' },
  videoCard3Title: { en: 'Our Packaging', ar: 'التغليف الخاص بنا' },
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
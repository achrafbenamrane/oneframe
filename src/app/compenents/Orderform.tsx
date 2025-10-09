"use client";

import { useState, useEffect, useMemo } from "react";
import { useI18n } from "./LanguageProvider";

// Simple price map in DZD to match the form's currency
const PRICE_MAP: Record<string, number> = {
  "van": 2900,
  "camaro": 3200,
  "land rover": 2800,
  "bike": 1800,
  "f1": 15000,
  "mercedes gtr": 4500,
};

const WILAYAS = [
  { value: "", labelEn: "Wilaya", labelAr: "الولاية" },
  { value: "algiers", labelEn: "Algiers", labelAr: "الجزائر" },
  { value: "oran", labelEn: "Oran", labelAr: "وهران" },
  { value: "blida", labelEn: "Blida", labelAr: "البليدة" },
];

const COMMUNES = [
  { value: "", labelEn: "Commune", labelAr: "البلدية" },
  { value: "center", labelEn: "Center", labelAr: "المركز" },
  { value: "east", labelEn: "East", labelAr: "الشرق" },
  { value: "west", labelEn: "West", labelAr: "الغرب" },
];

const VEHICLES = [
  { value: 'van', labelEn: 'Van', labelAr: 'فان' },
  { value: 'camaro', labelEn: 'Camaro', labelAr: 'كامارو' },
  { value: 'land rover', labelEn: 'Land Rover', labelAr: 'لاند روفر' },
  { value: 'bike', labelEn: 'Bike', labelAr: 'دراجة' },
  { value: 'f1', labelEn: 'F1', labelAr: 'اف 1' },
  { value: 'mercedes gtr', labelEn: 'Mercedes GTR', labelAr: 'مرسيدس GTR' },
];

function formatDA(amount: number | null, lang: "en" | "ar") {
  if (amount == null) return lang === "ar" ? "؟" : "?";
  const formatted = new Intl.NumberFormat(lang === "ar" ? "ar-DZ" : "en-DZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `DA ${formatted} DZD`;
}

export default function OrderForm({ defaultProductId }: { defaultProductId?: string }) {
  const { t, lang } = useI18n();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(defaultProductId || "");

  // New fields per the reference design
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");

  // Update when defaultProductId changes
  useEffect(() => {
    if (defaultProductId) setSelectedProduct(defaultProductId);
  }, [defaultProductId]);

  const productPrice = useMemo(() => {
    if (!selectedProduct) return null;
    return PRICE_MAP[selectedProduct] ?? null;
  }, [selectedProduct]);

  const deliveryPrice = useMemo(() => {
    // Only known after a wilaya is chosen; example flat price
    if (!wilaya) return null;
    return 400; // DZD flat example
  }, [wilaya]);

  const total = useMemo(() => {
    if (productPrice == null || deliveryPrice == null) return null;
    return productPrice + deliveryPrice;
  }, [productPrice, deliveryPrice]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedProduct) {
      alert(t('selectVehicleFirst'));
      return;
    }
    setLoading(true);

    const data = {
      productId: selectedProduct,
      name,
      number: phone,
      wilaya,
      commune,
      productPrice,
      deliveryPrice,
      total,
    };

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setSuccess(res.ok);
    } catch (err) {
      console.error("Error sending order:", err);
      setSuccess(false);
    }

    setLoading(false);
    if (success) {
      setName("");
      setPhone("");
      setWilaya("");
      setCommune("");
    }
  }

  // Icon blocks (no external libs)
  const IconUser = (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500" fill="currentColor" aria-hidden>
      <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.86 0-7 3.14-7 7h2a5 5 0 0 1 10 0h2c0-3.86-3.14-7-7-7z"/>
    </svg>
  );
  const IconPhone = (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79a15.463 15.463 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C10.4 22 2 13.6 2 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2z"/>
    </svg>
  );
  const IconChevron = (
    <svg viewBox="0 0 20 20" className="w-5 h-5 text-gray-600" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.939l3.71-3.71a.75.75 0 1 1 1.06 1.061l-4.24 4.24a.75.75 0 0 1-1.06 0L5.25 8.29a.75.75 0 0 1-.02-1.06z" clipRule="evenodd"/>
    </svg>
  );

  // Direction helpers
  const isRTL = lang === "ar";
  const labelClass = "text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1 mb-2";
  const asterisk = <span className="text-red-500">*</span>;
  const fieldWrapper = "w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl flex items-center overflow-hidden";
  const inputBase = "w-full bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base py-3 px-4";

  // Hidden select for product id (selected via carousel), keep for POST
  const HiddenProductField = (
    <input type="hidden" name="productId" value={selectedProduct} />
  );

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
        {t('formHeader')}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 p-4 sm:p-6 rounded-2xl shadow-md w-full max-w-xl">
        {HiddenProductField}

        {/* Vehicle (select) */}
        <label className={`${labelClass} ${isRTL ? 'justify-end' : ''}`}>
          {t('vehicleLabel')} {asterisk}
        </label>
        <div className={`${fieldWrapper} mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <select
            name="productId"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
            className={`${inputBase} appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <option value="" disabled>{t('vehiclePlaceholder')}</option>
            {VEHICLES.map((v) => (
              <option key={v.value} value={v.value}>
                {lang === 'ar' ? v.labelAr : v.labelEn}
              </option>
            ))}
          </select>
          <div className="px-3 py-2 bg-gray-200 dark:bg-gray-700 h-full flex items-center justify-center">
            {IconChevron}
          </div>
        </div>

        {/* Name */}
        <label className={`${labelClass} ${isRTL ? 'justify-end' : ''}`}>
          {t('nameLabel')} {asterisk}
        </label>
        <div className={`${fieldWrapper} mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePlaceholder')}
            required
            className={`${inputBase} ${isRTL ? 'text-right' : 'text-left'}`}
          />
          <div className="px-3 py-2 bg-gray-200 dark:bg-gray-700 h-full flex items-center justify-center">
            {IconUser}
          </div>
        </div>

        {/* Phone */}
        <label className={`${labelClass} ${isRTL ? 'justify-end' : ''}`}>
          {t('phoneLabel')} {asterisk}
        </label>
        <div className={`${fieldWrapper} mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <input
            name="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('phonePlaceholder')}
            required
            type="tel"
            inputMode="numeric"
            maxLength={10}
            className={`${inputBase} ${isRTL ? 'text-right' : 'text-left'}`}
          />
          <div className="px-3 py-2 bg-gray-200 dark:bg-gray-700 h-full flex items-center justify-center">
            {IconPhone}
          </div>
        </div>

        {/* Wilaya */}
        <label className={`${labelClass} ${isRTL ? 'justify-end' : ''}`}>
          {t('wilayaLabel')} {asterisk}
        </label>
        <div className={`${fieldWrapper} mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <select
            name="wilaya"
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            required
            className={`${inputBase} appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {WILAYAS.map((w) => (
              <option key={w.value} value={w.value}>
                {lang === 'ar' ? w.labelAr : w.labelEn}
              </option>
            ))}
          </select>
          <div className="px-3 py-2 bg-gray-200 dark:bg-gray-700 h-full flex items-center justify-center">
            {IconChevron}
          </div>
        </div>

        {/* Commune */}
        <label className={`${labelClass} ${isRTL ? 'justify-end' : ''}`}>
          {t('communeLabel')} {asterisk}
        </label>
        <div className={`${fieldWrapper} mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <select
            name="commune"
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            required
            className={`${inputBase} appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {COMMUNES.map((c) => (
              <option key={c.value} value={c.value}>
                {lang === 'ar' ? c.labelAr : c.labelEn}
              </option>
            ))}
          </select>
          <div className="px-3 py-2 bg-gray-200 dark:bg-gray-700 h-full flex items-center justify-center">
            {IconChevron}
          </div>
        </div>

        {/* Price box */}
        <div className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 mb-5">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">{t('productPriceLabel')}</span>
            <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100">{formatDA(productPrice, lang)}</span>
          </div>
          <div className={`flex items-center justify-between mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">{t('deliveryPriceLabel')}</span>
            <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100">{formatDA(deliveryPrice, lang)}</span>
          </div>
          <div className="my-3 h-px bg-gray-200 dark:bg-gray-800" />
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-gray-100">{t('totalPriceLabel')}</span>
            <span className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-gray-100">{formatDA(total, lang)}</span>
          </div>
        </div>

        {/* Submit — keep your existing button style unchanged */}
        <div className="flex items-center justify-center font-sans">
          <style>{`
            @keyframes shimmer-rotate { to { transform: rotate(360deg); } }
            .shimmer-anim { animation: shimmer-rotate 2.3s linear infinite; will-change: transform; }
            @media (prefers-reduced-motion: reduce) { .shimmer-anim { animation: none !important; } }
          `}</style>
          <button
            type="submit"
            disabled={loading}
            className="relative inline-flex items-center justify-center min-w-full p-[6px] bg-gray-300 dark:bg-black rounded-full overflow-hidden group"
          >
            <div
              className="absolute inset-0 shimmer-anim"
              style={{ background: "conic-gradient(from 0deg, transparent 25%, #06b6d4, transparent 50%)", pointerEvents: "none" }}
            />
            <span className="relative z-10 inline-flex items-center justify-center w-full h-full px-8 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-900 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors duration-300">
              {loading ? t('sending') : t('confirmOrder')}
            </span>
          </button>
        </div>
        {success && (
          <p className="text-green-600 dark:text-green-400 mt-3 text-center">✅ {t('orderSentSuccess')}</p>
        )}
      </form>
    </div>
  );
}

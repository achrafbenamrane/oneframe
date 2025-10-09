/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useI18n } from "./LanguageProvider";


export default function OrderForm({ defaultProductId }: { defaultProductId?: string }) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(defaultProductId || "");

  // Update when defaultProductId changes
  useEffect(() => {
    if (defaultProductId) setSelectedProduct(defaultProductId);
  }, [defaultProductId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    // ✅ Safe typing for TypeScript
    const productIdInput = form.elements.namedItem("productId") as HTMLSelectElement | null;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const numberInput = form.elements.namedItem(
      "number"
    ) as HTMLTextAreaElement;
    const messageInput = form.elements.namedItem(
      "message"
    ) as HTMLTextAreaElement;

    const data = {
      productId: productIdInput?.value || "",
      name: nameInput.value,
      email: emailInput.value,
      number: numberInput.value,
      message: messageInput.value,
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
    form.reset();
    setSelectedProduct("");
  }
  const customCss = `
    /* Cross-browser spinner animation: rotate the layer instead of animating a custom property.
       This works in Chrome, Safari, Firefox, and mobile browsers. */
    @keyframes shimmer-rotate {
      to { transform: rotate(360deg); }
    }

    /* Utility class for the animated layer */
    .shimmer-anim { animation: shimmer-rotate 2.3s linear infinite; will-change: transform; }

    /* Respect reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
      .shimmer-anim { animation: none !important; }
    }
  `;

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-gray-600 dark:text-gray-300 mb-6">{t('sendOrderBelow')}</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-200 p-6 rounded-xl shadow-md w-full max-w-md"
      >
        {/* Product Selection Dropdown */}
        <select
          name="productId"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          required
          className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        >
          <option value="" disabled>Select Vehicle Type</option>
          <option value="van">Van</option>
          <option value="camaro">Camaro</option>
          <option value="land rover">Land Rover</option>
          <option value="bike">Bike</option>
          <option value="f1">F1</option>
          <option value="mercedes gtr">Mercedes GTR</option>
        </select>

        <input
          name="name"
          placeholder={t('name')}
          required
          className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
        <input
          name="email"
          placeholder={t('email')}
          required
          type="email"
          className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
        <input
          name="number"
          placeholder={t('number')}
          required
          type="text"
          inputMode="numeric"
          maxLength={10}
          className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
        <textarea
          name="message"
          placeholder={t('message')}
          required
          className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent min-h-[100px]"
        />

        <div className="flex items-center justify-center font-sans">
          <style>{customCss}</style>
          <button
            type="submit"
            disabled={loading}
            className="relative inline-flex items-center justify-center min-w-full p-[6px] bg-gray-300 dark:bg-black rounded-full overflow-hidden group"
          >
            <div
              className="absolute inset-0 shimmer-anim"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 25%, #06b6d4, transparent 50%)",
                pointerEvents: "none",
              }}
            />

            <span className="relative z-10 inline-flex items-center justify-center w-full h-full px-8 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-900 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors duration-300">
              {loading ? t('sending') : t('buyNow')}
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

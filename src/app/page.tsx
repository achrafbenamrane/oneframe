/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";
import OrderForm from "./compenents/Orderform";
import ThreeDCarousel from "./compenents/ThreeDCarousel";
import DetailsModal from "./compenents/DetailsModal";
import ProductDetails from "./compenents/ProductDetails";
import TopBar from "./compenents/TopBar";
import { useI18n } from "./compenents/LanguageProvider";

export default function Home() {
  const { t } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ index: number; src: string } | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("1");

  const openDetails = useCallback((index: number, src: string) => {
    setModalContent({ index, src });
    setModalOpen(true);
  }, []);

  const closeDetails = useCallback(() => setModalOpen(false), []);

  const scrollToOrder = useCallback(() => {
    const el = document.getElementById("order-form-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const setAndScroll = useCallback((id: string) => {
    setSelectedProductId(id);
    scrollToOrder();
  }, [scrollToOrder]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 sm:p-6">
      <TopBar />

      <ThreeDCarousel
        leftButtonLabel={t('buy')}
        rightButtonLabel={t('details')}
        onLeftButtonClick={(i) => setAndScroll(String(i + 1))}
        onRightButtonClick={(i, src) => openDetails(i, src)}
      />

      <h1 className="flex justify-center items-center text-2xl sm:text-3xl text-gray-600 dark:text-gray-200 font-bold mt-2 mb-2">{t('makeOrderTitle')}</h1>
      <section id="order-form-section" className="w-full flex justify-center">
        <OrderForm defaultProductId={selectedProductId} />
      </section>

      <DetailsModal open={modalOpen} onClose={closeDetails} title={modalContent ? `${t('details')} (#${modalContent.index + 1})` : t('details')}>
        {modalContent && (
          <ProductDetails
            id={String(modalContent.index + 1)}
            title={t('productTitle')}
            price={111}
            description={t('productDescription')}
            images={[modalContent.src]}
            onBuy={() => {
              setModalOpen(false);
              setAndScroll(String(modalContent.index + 1));
            }}
          />
        )}
      </DetailsModal>
    </main>
  );
}

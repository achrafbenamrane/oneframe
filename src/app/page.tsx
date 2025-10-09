/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";
import OrderForm from "./compenents/Orderform";
import ThreeDCarousel from "./compenents/ThreeDCarousel";
import DetailsModal from "./compenents/DetailsModal";
import ProductDetails from "./compenents/ProductDetails";
import TopBar from "./compenents/TopBar";
import Footer from "./compenents/Footer";
import { useI18n } from "./compenents/LanguageProvider";

export default function Home() {
  const { t } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ index: number; src: string } | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  // Map carousel index to the OrderForm select values
  const VEHICLE_IDS = ['van', 'camaro', 'land rover', 'bike', 'f1', 'mercedes gtr'] as const;

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
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      <TopBar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 pt-24">
        <ThreeDCarousel
          leftButtonLabel={t('buy')}
          rightButtonLabel={t('details')}
          onLeftButtonClick={(i) => setAndScroll(VEHICLE_IDS[i])}
          onRightButtonClick={(i, src) => openDetails(i, src)}
        />

        <h1 className="flex justify-center items-center text-2xl sm:text-3xl text-gray-600 dark:text-gray-200 font-bold mt-8 mb-6">{t('makeOrderTitle')}</h1>
        <section id="order-form-section" className="w-full flex justify-center mb-12">
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
                setAndScroll(VEHICLE_IDS[modalContent.index]);
              }}
            />
          )}
        </DetailsModal>
      </main>

      <Footer />
    </div>
  );
}

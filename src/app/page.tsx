/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";
import OrderForm from "./compenents/Orderform";
import ThreeDCarousel from "./compenents/ThreeDCarousel";
import DetailsModal from "./compenents/DetailsModal";
import ProductDetails from "./compenents/ProductDetails";

export default function Home() {
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className=" pb-4 rounded-xl">
        <img src="/logo.png" alt="Logo" width={180} height={105} />
      </div>

      <ThreeDCarousel
        leftButtonLabel="Buy"
        rightButtonLabel="Details"
        onLeftButtonClick={(i) => setAndScroll(String(i + 1))}
        onRightButtonClick={(i, src) => openDetails(i, src)}
      />

      <h1 className="flex justify-center items-center text-3xl text-gray-600  font-bold mt-2 mb-2">MakeOrder </h1>
      <section id="order-form-section" className="w-full flex justify-center">
        <OrderForm defaultProductId={selectedProductId} />
      </section>

      <DetailsModal open={modalOpen} onClose={closeDetails} title={modalContent ? `Details (Card #${modalContent.index + 1})` : "Details"}>
        {modalContent && (
          <ProductDetails
            id={String(modalContent.index + 1)}
            title="Nike Airforce1 Premium"
            price={111}
            description="Step back into classic hoops style with a durable leather. Best for casual wear, comfort and timeless look."
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

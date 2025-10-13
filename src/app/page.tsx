"use client";

import { useState, useCallback } from "react";
import OrderForm from "./compenents/Orderform";
import ThreeDCarousel from "./compenents/ThreeDCarousel";
import DetailsModal from "./compenents/DetailsModal";
import ProductDetails from "./compenents/ProductDetails";
import TopBar from "./compenents/TopBar";
import Footer from "./compenents/Footer";
import { useI18n } from "./compenents/LanguageProvider";


// Define the valid translation keys
type TranslationKey = 
  | 'van' | 'camaro' | 'landRover' | 'bike' | 'f1' | 'mercedesGTR'
  | 'vanDescription' | 'camaroDescription' | 'landRoverDescription' 
  | 'bikeDescription' | 'f1Description' | 'mercedesGTRDescription'
  | 'details' | 'productTitle' | 'productDescription'
  | 'makeOrderTitle' | 'buy' | 'buyNow' | 'orderNow' | 'exploreVehicles' | 'dragToBrowse'
  | 'bestSeller' | 'ownIt' | 'priceSymbol';

export default function Home() {
  const { t } = useI18n(); // Removed unused 'lang'
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ index: number; src: string } | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  
  // Map carousel index to the OrderForm select values
  const VEHICLE_IDS = ['van', 'camaro', 'land rover', 'bike', 'f1', 'mercedes gtr'] as const;

  // Folder names (match the folders created in public/)
  const VEHICLE_FOLDERS = ['van', 'camaro', 'land-rover', 'bike', 'f1', 'mercedes-gtr'] as const;

  // Vehicle-specific data with proper names, prices, and images
  const VEHICLE_DATA = [
    { 
      id: 'van', 
      nameKey: 'van' as TranslationKey,
      price: 2500, 
      descriptionKey: 'vanDescription' as TranslationKey,
      image: '/Van.jpg'
    },
    { 
      id: 'camaro', 
      nameKey: 'camaro' as TranslationKey,
      price: 3200, 
      descriptionKey: 'camaroDescription' as TranslationKey,
      image: '/Camaro.jpg'
    },
    { 
      id: 'land rover', 
      nameKey: 'landRover' as TranslationKey,
      price: 2800, 
      descriptionKey: 'landRoverDescription' as TranslationKey,
      image: '/Brezina.jpg'
    },
    { 
      id: 'bike', 
      nameKey: 'bike' as TranslationKey,
      price: 1800, 
      descriptionKey: 'bikeDescription' as TranslationKey,
      image: '/Bike.jpg'
    },
    { 
      id: 'f1', 
      nameKey: 'f1' as TranslationKey,
      price: 15000, 
      descriptionKey: 'f1Description' as TranslationKey,
      image: '/f1.jpg'
    },
    { 
      id: 'mercedes gtr', 
      nameKey: 'mercedesGTR' as TranslationKey,
      price: 4500, 
      descriptionKey: 'mercedesGTRDescription' as TranslationKey,
      image: '/Mercedes.jpg'
    },
  ];

  // Carousel images
  const CAROUSEL_IMAGES = [
    '/Van.jpg',
    '/Camaro.jpg',
    '/Brezina.jpg',
    '/Bike.jpg',
    '/f1.jpg',
    '/Mercedes.jpg'
  ];

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
    <div className="min-h-screen flex flex-col bg-white  dark:bg-[url(/bggg.jpeg)]">
      <TopBar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 pt-24">
        
        <div className=""></div> 
        <ThreeDCarousel
          images={CAROUSEL_IMAGES}
          leftButtonLabel={t('buy')}
          rightButtonLabel={t('details')}
          onLeftButtonClick={(i) => setAndScroll(VEHICLE_IDS[i])}
          onRightButtonClick={(i, src) => openDetails(i, src)}
        />

        <h1 className="flex justify-center items-center text-2xl sm:text-3xl text-gray-600 dark:text-gray-200 font-bold mt-8 mb-6">{t('makeOrderTitle')}</h1>
        <section id="order-form-section" className="w-full flex justify-center mb-12">
          <OrderForm defaultProductId={selectedProductId} />
        </section>

        <DetailsModal open={modalOpen} onClose={closeDetails} title={modalContent ? `${t('details')} - ${t(VEHICLE_DATA[modalContent.index]?.nameKey)}` : t('details')}>
          {modalContent && (
            <ProductDetails
              id={VEHICLE_IDS[modalContent.index]}
              title={t(VEHICLE_DATA[modalContent.index]?.nameKey) || t('productTitle')}
              price={VEHICLE_DATA[modalContent.index]?.price || 111}
              description={t(VEHICLE_DATA[modalContent.index]?.descriptionKey) || t('productDescription')}
              images={(() => {
                const folder = VEHICLE_FOLDERS[modalContent.index] || '';
                return [`/${folder}/1.jpg`, `/${folder}/2.jpg`, `/${folder}/3.jpg`, `/${folder}/4.jpg`];
              })()}
              onBuy={() => {
                setModalOpen(false);
                setAndScroll(VEHICLE_IDS[modalContent.index]);
              }}
              onClose={closeDetails}
            />
          )}
        </DetailsModal>
      </main>

      <Footer />
    </div>
  );
}
'use client';

import React, { useCallback, useMemo } from 'react';
import ResponsiveCarousel from './compenents/ResponsiveCarousel';
import { VehicleCardProps } from './compenents/VehicleCard';
import { VEHICLE_TYPES } from './constants/vehicles';

// Build vehicles from VEHICLE_TYPES for dynamic id binding and scalability
const vehicles: VehicleCardProps[] = VEHICLE_TYPES.map((v) => ({
  id: v.id, // e.g., 'van', 'camaro'
  title: v.label, // Display name
  images: ['/van.png'], // CHANGED: Use images array instead of image
  description:
    'High-performance, precision-built frame engineered for safety and control. Designed for all terrains and use cases.',
  price: 6400,
}));

const DemoCarouselPage: React.FC = () => {
  const handleBuy = useCallback(async (id: string) => {
    // Example: trigger action or fetch API with the correct vehicle id
    // await fetch(`/api/vehicles/${id}/purchase`, { method: 'POST' });
    console.log('Buy vehicle id:', id);
    alert(`Buy vehicle with id: ${id}`);
  }, []);

  const handleDetails = useCallback((id: string) => {
    // Example: open details or fetch data for the vehicle id
    console.log('Details for vehicle id:', id);
    alert(`Show details for vehicle id: ${id}`);
  }, []);

  const data = useMemo(() => vehicles, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-950">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 mt-8 text-gray-800 dark:text-gray-100">
        Responsive Vehicle Carousel Demo
      </h1>
      <ResponsiveCarousel vehicles={data} onBuy={handleBuy} onDetails={handleDetails} />
    </div>
  );
};

export default DemoCarouselPage;
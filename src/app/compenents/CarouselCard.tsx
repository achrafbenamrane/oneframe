'use client';

import React from 'react';
import VehicleCard from './VehicleCard';

interface CarouselCardProps {
  id: string;
  title: string;
  image: string;
  description: string;
  price: number;
  // ProductCarousel passes no-arg handlers; we adapt them to VehicleCard's signature internally
  onBuy?: () => void;
  onDetails?: () => void;
  isVisible?: boolean;
}

// Wrapper component to maintain backward compatibility with ProductCarousel
// while delegating UI to the newer VehicleCard component.
const CarouselCard: React.FC<CarouselCardProps> = ({
  id,
  title,
  image,
  description,
  price,
  onBuy,
  onDetails,
  isVisible = true,
}) => {
  // Adapt callbacks to VehicleCard API; ignore the id parameter from VehicleCard
  const handleBuy = (_: string) => onBuy?.();
  const handleDetails = (_: string) => onDetails?.();

  return (
    <VehicleCard
      id={id}
      title={title}
      image={image}
      description={description}
      price={price}
      onBuy={handleBuy}
      onDetails={handleDetails}
      isActive={isVisible}
    />
  );
};

export default CarouselCard;

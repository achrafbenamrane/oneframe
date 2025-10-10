// Updated Product type to support multiple images
export interface Product {
  id: string;
  title: string;
  images: string[];
  description: string;
  price: number;
}

export const sampleProducts: Product[] = [
  {
    id: 'van',
    title: 'Premium Van Frame',
    images: ['/van/1.jpg', '/van/2.jpg', '/van/3.jpg', '/van/4.jpg'],
    description: 'Heavy-duty van frame designed for maximum durability and load capacity. Perfect for commercial and personal use.',
    price: 2500
  },
  {
    id: 'camaro',
    title: 'Camaro Sports Frame',
    images: ['/camaro/1.jpg', '/camaro/2.jpg', '/camaro/3.jpg', '/camaro/4.jpg'],
    description: 'High-performance sports car frame with precision engineering for optimal speed and handling.',
    price: 3200
  },
  {
    id: 'land-rover',
    title: 'Land Rover Adventure Frame',
    images: ['/land-rover/1.jpg', '/land-rover/2.jpg', '/land-rover/3.jpg', '/land-rover/4.jpg'],
    description: 'Rugged off-road frame built to withstand the toughest terrains and weather conditions.',
    price: 2800
  },
  {
    id: 'bike',
    title: 'Motorcycle Racing Frame',
    images: ['/bike/1.jpg', '/bike/2.jpg', '/bike/3.jpg', '/bike/4.jpg'],
    description: 'Lightweight yet strong motorcycle frame engineered for racing performance and agility.',
    price: 1800
  },
  {
    id: 'f1',
    title: 'F1 Racing Frame',
    images: ['/f1/1.jpg', '/f1/2.jpg', '/f1/3.jpg', '/f1/4.jpg'],
    description: 'Ultra-lightweight carbon fiber frame designed for Formula 1 racing standards and performance.',
    price: 15000
  },
  {
    id: 'mercedes-gtr',
    title: 'Mercedes GTR Frame',
    images: ['/mercedes-gtr/1.jpg', '/mercedes-gtr/2.jpg', '/mercedes-gtr/3.jpg', '/mercedes-gtr/4.jpg'],
    description: 'Luxury sports frame combining Mercedes engineering excellence with cutting-edge materials.',
    price: 4500
  }
];



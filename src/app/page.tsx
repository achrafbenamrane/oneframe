/* eslint-disable @next/next/no-img-element */
"use client";

import OrderForm from "./compenents/Orderform"
import ThreeDCarousel from "./compenents/ThreeDCarousel";

  
export default function Home() {
  

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
       <div className=" pb-4 rounded-xl">
        <img src="/logo.png" alt="Logo" width={180} height={105} />
      </div>
      <h1 className="flex justify-center items-center text-3xl text-gray-600  font-bold mb-2">MakeOrder </h1>
      <OrderForm/>
      <ThreeDCarousel/>
    </main>
  );
}

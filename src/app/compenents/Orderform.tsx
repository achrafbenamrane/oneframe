/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

export default function OrderForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    // ✅ Safe typing for TypeScript
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const numberInput = form.elements.namedItem("number") as HTMLTextAreaElement;
    const messageInput = form.elements.namedItem("message") as HTMLTextAreaElement;

    const data = {
      name: nameInput.value,
      email: emailInput.value,
      number: parseInt(numberInput.value),
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
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-gray-600 mb-6">Send us your order details below</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-600 p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <input
          name="name"
          placeholder="Your name"
          required
          className="w-full border p-3 rounded mb-3"
        />
        <input
          name="email"
          placeholder="Your email"
          required
          type="email"
          className="w-full border p-3 rounded mb-3"
        />
          <input
          name="number"
          placeholder="Your phone number"
          required
          type="text"
          inputMode="numeric"
          maxLength={10}
          className="w-full border p-3 rounded mb-3"
        />
        <textarea
          name="message"
          placeholder="Your order details"
          required
          className="w-full border p-3 rounded mb-3"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Sending..." : "Send Order"}
        </button>
        {success && (
          <p className="text-green-600 mt-3 text-center">
            ✅ Order sent successfully!
          </p>
        )}
      </form>
    </div>
  );
}

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
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);
    setSuccess(res.ok);
    form.reset();
  }

  return (
    <div className="flex flex-col  items-center">
      <p className="text-gray-600 mb-6">Send us your order details below</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white  text-gray-600 p-6 rounded-xl shadow-md w-full max-w-md"
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
        <input type="" />
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

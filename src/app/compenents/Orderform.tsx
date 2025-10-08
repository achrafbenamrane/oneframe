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
    const numberInput = form.elements.namedItem(
      "number"
    ) as HTMLTextAreaElement;
    const messageInput = form.elements.namedItem(
      "message"
    ) as HTMLTextAreaElement;

    const data = {
      name: nameInput.value,
      email: emailInput.value,
      number: numberInput.value,
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
  const customCss = `
    /* This is the key to the seamless animation.
      The @property rule tells the browser that '--angle' is a custom property
      of type <angle>. This allows the browser to smoothly interpolate it
      during animations, preventing the "jump" at the end of the loop.
    */
    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    /* The keyframe animation simply transitions the --angle property
      from its start (0deg) to its end (360deg).
    */
    @keyframes shimmer-spin {
      to {
        --angle: 360deg;
      }
    }
  `;

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

        <div className="flex items-center justify-center font-sans">
          <style>{customCss}</style>
          <button
            type="submit"
            disabled={loading}
            className="relative inline-flex items-center justify-center min-w-full p-[1.5px] bg-gray-300 dark:bg-black rounded-full overflow-hidden group"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "conic-gradient(from var(--angle), transparent 25%, #06b6d4, transparent 50%)",
                animation: "shimmer-spin 2.3s linear infinite",
              }}
            />

            <span className="relative z-10 inline-flex items-center justify-center w-full h-full px-8 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-900 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors duration-300">
              {loading ? "Sending..." : "Buy Now"}
            </span>
          </button>
        </div>
        {success && (
          <p className="text-green-600 mt-3 text-center">
            ✅ Order sent successfully!
          </p>
        )}
      </form>
    </div>
  );
}

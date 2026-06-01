"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";

export function CheckoutClient() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function placeOrder() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items.map((item) => ({ productId: item.id, quantity: item.quantity })) })
    });
    setLoading(false);

    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error ?? "Please log in as a customer to check out.");
      return;
    }

    const payload = await response.json();
    if (payload.url) {
      clearCart();
      window.location.href = payload.url;
      return;
    }

    router.refresh();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold">Checkout</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
        <section className="rounded-lg border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-semibold">Shipping details</h2>
          <div className="mt-5 space-y-3">
            <input placeholder="Full name" className="w-full rounded-md border border-ink/15 bg-transparent px-3 py-3 dark:border-white/15" />
            <input placeholder="Shipping address" className="w-full rounded-md border border-ink/15 bg-transparent px-3 py-3 dark:border-white/15" />
            <p className="rounded-md bg-petal px-3 py-3 text-sm text-ink/70 dark:bg-white/10 dark:text-white/70">
              Payment is securely completed on Stripe after you place the order.
            </p>
          </div>
        </section>
        <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-ink/10 pt-5 text-lg font-semibold dark:border-white/10">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {error ? <p className="mt-4 rounded-md bg-rouge/10 px-3 py-2 text-sm text-rouge">{error}</p> : null}
          <button disabled={items.length === 0 || loading} onClick={placeOrder} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-rouge px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
            <CreditCard size={18} />
            {loading ? "Opening Stripe..." : "Pay with Stripe"}
          </button>
        </aside>
      </div>
    </main>
  );
}

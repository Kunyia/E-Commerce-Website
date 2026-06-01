"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";

export function CartPageClient() {
  const { items, updateQuantity, removeItem } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold">Shopping cart</h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-lg border border-ink/10 p-8 text-center dark:border-white/10">
          <p>Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-flex rounded-md bg-ink px-5 py-3 text-sm font-semibold text-pearl dark:bg-pearl dark:text-ink">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-[96px_1fr] gap-4 rounded-lg border border-ink/10 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <div className="relative aspect-square overflow-hidden rounded-md bg-petal">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-serif text-xl font-semibold">{item.name}</h2>
                    <p className="text-sm text-ink/60 dark:text-white/60">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button title="Decrease quantity" className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 dark:border-white/10" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button title="Increase quantity" className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 dark:border-white/10" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                    <button title="Remove item" className="grid h-9 w-9 place-items-center rounded-full text-rouge" onClick={() => removeItem(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <p className="mt-2 text-sm text-ink/60 dark:text-white/60">Shipping and taxes are calculated during checkout.</p>
            <Link href="/checkout" className="mt-5 block rounded-md bg-rouge px-4 py-3 text-center text-sm font-semibold text-white">
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";

type Product = {
  id: string;
  name: string;
  price: number | string;
  imageUrl: string;
  stock: number;
};

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const disabled = product.stock < 1;

  return (
    <button
      disabled={disabled}
      onClick={() => addItem({ ...product, price: Number(product.price) })}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-rouge px-4 py-3 text-sm font-semibold text-white transition hover:bg-rouge/90 disabled:cursor-not-allowed disabled:bg-ink/20"
    >
      <ShoppingBag size={18} />
      {disabled ? "Sold out" : "Add to cart"}
    </button>
  );
}

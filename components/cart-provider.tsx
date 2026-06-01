"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("beauty_queens_cart");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("beauty_queens_cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem: (item) => {
        setItems((current) => {
          const existing = current.find((cartItem) => cartItem.id === item.id);
          if (existing) {
            return current.map((cartItem) =>
              cartItem.id === item.id ? { ...cartItem, quantity: Math.min(cartItem.quantity + 1, item.stock) } : cartItem
            );
          }
          return [...current, { ...item, quantity: 1 }];
        });
      },
      updateQuantity: (id, quantity) => {
        setItems((current) =>
          current.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item))
        );
      },
      removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
      clearCart: () => setItems([])
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

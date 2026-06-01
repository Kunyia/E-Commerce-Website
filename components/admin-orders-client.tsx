"use client";

import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/format";

type AdminOrder = {
  id: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  totalPrice: string;
  createdAt: string;
  user: { name: string; email: string };
  items: Array<{ id: string; quantity: number; price: string; product: { name: string } }>;
};

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

export function AdminOrdersClient({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-serif text-4xl font-semibold">Orders</h1>
      <div className="mt-6 space-y-4">
        {orders.length === 0 ? <p className="rounded-lg border border-ink/10 p-6 dark:border-white/10">No orders yet.</p> : null}
        {orders.map((order) => (
          <article key={order.id} className="rounded-lg border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold">Order {order.id.slice(-8).toUpperCase()}</h2>
                <p className="text-sm text-ink/60 dark:text-white/60">{order.user.name} · {order.user.email}</p>
                <p className="text-sm text-ink/60 dark:text-white/60">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <select value={order.status} onChange={(event) => updateStatus(order.id, event.target.value)} className="rounded-md border border-ink/15 bg-transparent px-3 py-2 text-sm font-semibold dark:border-white/15">
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>{formatCurrency(Number(item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-ink/10 pt-4 text-right font-semibold dark:border-white/10">{formatCurrency(order.totalPrice)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

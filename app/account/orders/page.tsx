import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { hasDatabaseUrl } from "@/lib/db-ready";
import { formatCurrency } from "@/lib/format";

export default async function CustomerOrdersPage() {
  const user = await getSession();
  const orders = hasDatabaseUrl
    ? await prisma.order.findMany({
        where: { userId: user!.id },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" }
      })
    : [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold">Order history</h1>
      <div className="mt-8 space-y-4">
        {orders.length === 0 ? <p className="rounded-lg border border-ink/10 p-6 dark:border-white/10">No orders yet.</p> : null}
        {orders.map((order) => (
          <article key={order.id} className="rounded-lg border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Order {order.id.slice(-8).toUpperCase()}</h2>
                <p className="text-sm text-ink/60 dark:text-white/60">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="rounded-full bg-sage/15 px-3 py-1 text-sm font-semibold text-sage">{order.status}</span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>{formatCurrency(Number(item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-ink/10 pt-4 text-right font-semibold dark:border-white/10">{formatCurrency(order.totalPrice.toString())}</div>
          </article>
        ))}
      </div>
    </main>
  );
}

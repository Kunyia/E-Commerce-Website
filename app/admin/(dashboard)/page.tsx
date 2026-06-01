import { prisma } from "@/lib/prisma";
import { hasDatabaseUrl } from "@/lib/db-ready";
import { formatCurrency } from "@/lib/format";

export default async function AdminDashboardPage() {
  if (!hasDatabaseUrl) {
    return (
      <div>
        <h1 className="font-serif text-4xl font-semibold">Dashboard</h1>
        <p className="mt-4 rounded-lg border border-ink/10 p-6 dark:border-white/10">Set `DATABASE_URL`, run migrations, and seed the database to load dashboard data.</p>
      </div>
    );
  }

  const [productCount, orderCount, revenue, lowStock] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalPrice: true } }),
    prisma.product.findMany({ where: { stock: { lte: 5 } }, orderBy: { stock: "asc" }, take: 5 })
  ]);

  return (
    <div>
      <h1 className="font-serif text-4xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Products" value={String(productCount)} />
        <Stat label="Orders" value={String(orderCount)} />
        <Stat label="Revenue" value={formatCurrency(revenue._sum.totalPrice?.toString() ?? 0)} />
      </div>
      <div className="mt-6 rounded-lg border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
        <h2 className="font-serif text-2xl font-semibold">Low stock</h2>
        <div className="mt-4 space-y-3">
          {lowStock.length === 0 ? <p className="text-sm text-ink/60 dark:text-white/60">Inventory is healthy.</p> : null}
          {lowStock.map((product) => (
            <div key={product.id} className="flex justify-between text-sm">
              <span>{product.name}</span>
              <span>{product.stock} left</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm text-ink/60 dark:text-white/60">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

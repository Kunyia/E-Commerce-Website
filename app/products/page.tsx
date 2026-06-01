import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { hasDatabaseUrl } from "@/lib/db-ready";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const categories = hasDatabaseUrl ? await prisma.product.findMany({ distinct: ["category"], select: { category: true }, orderBy: { category: "asc" } }) : [];
  const products = hasDatabaseUrl
    ? await prisma.product.findMany({
        where: category ? { category } : {},
        orderBy: { createdAt: "desc" }
      })
    : [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Shop</p>
          <h1 className="font-serif text-4xl font-semibold">Beauty Queens collection</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/products" className="rounded-full border border-ink/10 px-4 py-2 text-sm hover:bg-ink/5 dark:border-white/10 dark:hover:bg-white/10">All</Link>
          {categories.map((item) => (
            <Link key={item.category} href={`/products?category=${encodeURIComponent(item.category)}`} className="rounded-full border border-ink/10 px-4 py-2 text-sm hover:bg-ink/5 dark:border-white/10 dark:hover:bg-white/10">
              {item.category}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </main>
  );
}

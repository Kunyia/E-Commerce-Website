import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { hasDatabaseUrl } from "@/lib/db-ready";

export default async function HomePage() {
  const products = hasDatabaseUrl ? await prisma.product.findMany({ take: 4, orderBy: { createdAt: "desc" } }) : [];

  return (
    <main>
      <section className="border-b border-ink/10 bg-petal dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rouge">Beauty Queens</p>
            <h1 className="font-serif text-5xl font-semibold leading-tight sm:text-6xl">Polished beauty for every crown.</h1>
            <p className="max-w-2xl text-lg text-ink/70 dark:text-white/70">
              Shop luminous skincare, rich color, and graceful fragrance curated for a high-end beauty routine.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="rounded-md bg-ink px-5 py-3 text-sm font-semibold text-pearl dark:bg-pearl dark:text-ink">
                Shop collection
              </Link>
              <Link href="/admin/login" className="rounded-md border border-ink/15 px-5 py-3 text-sm font-semibold dark:border-white/15">
                Admin portal
              </Link>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-lg bg-white shadow-soft">
            <Image src="/logo.png" alt="Beauty Queens logo" fill className="object-cover" priority />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Featured</p>
            <h2 className="font-serif text-3xl font-semibold">New royal essentials</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-rouge">View all</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </main>
  );
}

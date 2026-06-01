import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { hasDatabaseUrl } from "@/lib/db-ready";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!hasDatabaseUrl) {
    notFound();
  }
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-petal">
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" priority />
      </div>
      <section className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">{product.category}</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">{product.name}</h1>
        <p className="mt-4 text-2xl font-semibold">{formatCurrency(product.price.toString())}</p>
        <p className="mt-6 text-lg leading-8 text-ink/70 dark:text-white/70">{product.description}</p>
        <p className="mt-6 text-sm text-ink/60 dark:text-white/60">{product.stock} available</p>
        <div className="mt-8 max-w-sm">
          <AddToCart product={{ id: product.id, name: product.name, price: product.price.toString(), imageUrl: product.imageUrl, stock: product.stock }} />
        </div>
      </section>
    </main>
  );
}

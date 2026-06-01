import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { AddToCart } from "@/components/add-to-cart";
import { formatCurrency } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-white/5">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-petal">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-sage">{product.category}</p>
          <h3 className="mt-1 min-h-12 font-serif text-xl font-semibold">{product.name}</h3>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{formatCurrency(product.price.toString())}</span>
          <span className="text-ink/60 dark:text-white/60">{product.stock} in stock</span>
        </div>
        <AddToCart product={{ id: product.id, name: product.name, price: product.price.toString(), imageUrl: product.imageUrl, stock: product.stock }} />
      </div>
    </article>
  );
}

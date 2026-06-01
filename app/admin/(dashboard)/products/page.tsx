import { prisma } from "@/lib/prisma";
import { AdminProductsClient } from "@/components/admin-products-client";
import { hasDatabaseUrl } from "@/lib/db-ready";

export default async function AdminProductsPage() {
  const products = hasDatabaseUrl ? await prisma.product.findMany({ orderBy: { createdAt: "desc" } }) : [];
  return (
    <AdminProductsClient
      products={products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        imageUrl: product.imageUrl,
        stock: product.stock,
        category: product.category
      }))}
    />
  );
}

import { prisma } from "@/lib/prisma";
import { AdminOrdersClient } from "@/components/admin-orders-client";
import { hasDatabaseUrl } from "@/lib/db-ready";

export default async function AdminOrdersPage() {
  const orders = hasDatabaseUrl
    ? await prisma.order.findMany({
        include: { user: true, items: { include: { product: true } } },
        orderBy: { createdAt: "desc" }
      })
    : [];

  return (
    <AdminOrdersClient
      orders={orders.map((order) => ({
        id: order.id,
        status: order.status,
        totalPrice: order.totalPrice.toString(),
        createdAt: order.createdAt.toISOString(),
        user: { name: order.user.name, email: order.user.email },
        items: order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price.toString(),
          product: { name: item.product.name }
        }))
      }))}
    />
  );
}

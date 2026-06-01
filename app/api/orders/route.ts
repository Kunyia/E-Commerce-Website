import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validators";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: user.role === Role.ADMIN ? {} : { userId: user.id },
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user || user.role !== Role.CUSTOMER) {
    return NextResponse.json({ error: "Customer login required" }, { status: 401 });
  }

  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }

  const ids = parsed.data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const productMap = new Map(products.map((product) => [product.id, product]));

  for (const item of parsed.data.items) {
    const product = productMap.get(item.productId);
    if (!product || product.stock < item.quantity) {
      return NextResponse.json({ error: "One or more items are unavailable" }, { status: 400 });
    }
  }

  const total = parsed.data.items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + Number(product.price) * item.quantity;
  }, 0);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: user.id,
        totalPrice: total,
        items: {
          create: parsed.data.items.map((item) => {
            const product = productMap.get(item.productId)!;
            return { productId: item.productId, quantity: item.quantity, price: product.price };
          })
        }
      },
      include: { items: { include: { product: true } } }
    });

    for (const item of parsed.data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return created;
  });

  return NextResponse.json({ order }, { status: 201 });
}

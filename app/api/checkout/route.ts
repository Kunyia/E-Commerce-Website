import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user || user.role !== Role.CUSTOMER) {
    return NextResponse.json({ error: "Customer login required" }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env." }, { status: 500 });
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

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalPrice: total,
      paymentStatus: "CHECKOUT_STARTED",
      items: {
        create: parsed.data.items.map((item) => {
          const product = productMap.get(item.productId)!;
          return { productId: item.productId, quantity: item.quantity, price: product.price };
        })
      }
    },
    include: { items: { include: { product: true } } }
  });

  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: order.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(Number(item.price) * 100),
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: item.product.imageUrl.startsWith("http") ? [item.product.imageUrl] : undefined
        }
      }
    })),
    metadata: {
      orderId: order.id,
      userId: user.id
    },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancel?order_id=${order.id}`
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeCheckoutSessionId: session.id }
  });

  return NextResponse.json({ url: session.url });
}

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-xl place-items-center px-4 py-10 text-center">
      <section className="rounded-lg border border-ink/10 bg-white p-8 shadow-soft dark:border-white/10 dark:bg-white/5">
        <CheckCircle2 className="mx-auto text-sage" size={44} />
        <h1 className="mt-4 font-serif text-4xl font-semibold">Payment received</h1>
        <p className="mt-3 text-ink/70 dark:text-white/70">
          Thank you for shopping with Beauty Queens. Your order will appear in your order history once Stripe confirms the payment.
        </p>
        <Link href="/account/orders" className="mt-6 inline-flex rounded-md bg-rouge px-5 py-3 text-sm font-semibold text-white">
          View orders
        </Link>
      </section>
    </main>
  );
}

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-xl place-items-center px-4 py-10 text-center">
      <section className="rounded-lg border border-ink/10 bg-white p-8 shadow-soft dark:border-white/10 dark:bg-white/5">
        <XCircle className="mx-auto text-rouge" size={44} />
        <h1 className="mt-4 font-serif text-4xl font-semibold">Checkout canceled</h1>
        <p className="mt-3 text-ink/70 dark:text-white/70">
          No payment was collected. You can return to your cart and try again whenever you are ready.
        </p>
        <Link href="/cart" className="mt-6 inline-flex rounded-md bg-ink px-5 py-3 text-sm font-semibold text-pearl dark:bg-pearl dark:text-ink">
          Return to cart
        </Link>
      </section>
    </main>
  );
}

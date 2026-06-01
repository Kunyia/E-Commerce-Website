import Link from "next/link";
import { LayoutDashboard, Package, ReceiptText } from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ReceiptText }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="h-fit rounded-lg border border-ink/10 bg-white p-3 dark:border-white/10 dark:bg-white/5">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sage">Admin</p>
        <nav className="mt-2 grid gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="inline-flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold hover:bg-ink/5 dark:hover:bg-white/10">
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <section>{children}</section>
    </main>
  );
}

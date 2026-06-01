import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getSession } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartProvider } from "@/components/cart-provider";
import { LogoutButton } from "@/components/logout-button";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Beauty Queens",
  description: "A polished beauty e-commerce storefront with admin management."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <CartProvider>
          <div className="min-h-screen bg-pearl text-ink transition-colors dark:bg-ink dark:text-pearl">
            <header className="sticky top-0 z-40 border-b border-ink/10 bg-pearl/90 backdrop-blur dark:border-white/10 dark:bg-ink/90">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3">
                  <Image src="/logo.png" alt="Beauty Queens logo" width={46} height={46} className="h-11 w-11 rounded-full object-cover" priority />
                  <span className="font-serif text-xl font-semibold">Beauty Queens</span>
                </Link>
                <nav className="flex items-center gap-2 text-sm">
                  <Link className="hidden rounded-full px-3 py-2 hover:bg-ink/5 dark:hover:bg-white/10 sm:inline-flex" href="/products">
                    Shop
                  </Link>
                  <Link className="rounded-full px-3 py-2 hover:bg-ink/5 dark:hover:bg-white/10" href="/cart">
                    Cart
                  </Link>
                  {user?.role === "CUSTOMER" ? (
                    <Link className="hidden rounded-full px-3 py-2 hover:bg-ink/5 dark:hover:bg-white/10 sm:inline-flex" href="/account/orders">
                      Orders
                    </Link>
                  ) : null}
                  {user?.role === "ADMIN" ? (
                    <Link className="rounded-full px-3 py-2 hover:bg-ink/5 dark:hover:bg-white/10" href="/admin">
                      Admin
                    </Link>
                  ) : null}
                  {user ? <LogoutButton /> : <Link className="rounded-full bg-ink px-4 py-2 text-pearl dark:bg-pearl dark:text-ink" href="/login">Login</Link>}
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}

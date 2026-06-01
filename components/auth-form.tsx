"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthMode = "register" | "customer-login" | "admin-login";

export function AuthForm({
  mode,
  title,
  endpoint,
  alternateHref,
  alternateText
}: {
  mode: AuthMode;
  title: string;
  endpoint: string;
  alternateHref: string;
  alternateText: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const body = {
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password")
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mode === "register" ? body : { email: body.email, password: body.password })
    });

    setLoading(false);
    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error ?? "Something went wrong");
      return;
    }

    router.push(mode === "admin-login" ? "/admin" : "/products");
    router.refresh();
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-md place-items-center px-4 py-10">
      <form onSubmit={submit} className="w-full rounded-lg border border-ink/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
        <h1 className="font-serif text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-ink/60 dark:text-white/60">
          {mode === "admin-login" ? "Admin credentials are separate from customer accounts." : "Welcome to Beauty Queens."}
        </p>
        <div className="mt-6 space-y-4">
          {mode === "register" ? (
            <label className="block text-sm font-medium">
              Name
              <input name="name" required minLength={2} className="mt-2 w-full rounded-md border border-ink/15 bg-transparent px-3 py-3 outline-none focus:border-rouge dark:border-white/15" />
            </label>
          ) : null}
          <label className="block text-sm font-medium">
            Email
            <input name="email" type="email" required className="mt-2 w-full rounded-md border border-ink/15 bg-transparent px-3 py-3 outline-none focus:border-rouge dark:border-white/15" />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input name="password" type="password" required minLength={mode === "register" ? 8 : 1} className="mt-2 w-full rounded-md border border-ink/15 bg-transparent px-3 py-3 outline-none focus:border-rouge dark:border-white/15" />
          </label>
        </div>
        {error ? <p className="mt-4 rounded-md bg-rouge/10 px-3 py-2 text-sm text-rouge">{error}</p> : null}
        <button disabled={loading} className="mt-6 w-full rounded-md bg-rouge px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? "Please wait..." : title}
        </button>
        <Link href={alternateHref} className="mt-4 block text-center text-sm font-semibold text-rouge">
          {alternateText}
        </Link>
      </form>
    </main>
  );
}

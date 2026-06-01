"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/format";

type AdminProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  stock: number;
  category: string;
};

const blankProduct = {
  name: "",
  description: "",
  price: "",
  imageUrl: "/products/lip-glow.jpg",
  stock: 0,
  category: ""
};

export function AdminProductsClient({ products }: { products: AdminProduct[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [draft, setDraft] = useState<Omit<AdminProduct, "id">>(blankProduct);
  const [error, setError] = useState("");

  function startCreate() {
    setEditing(null);
    setDraft(blankProduct);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch(editing ? `/api/products/${editing.id}` : "/api/products", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });

    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error ?? "Could not save product");
      return;
    }

    startCreate();
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function upload(file: File | null) {
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    const response = await fetch("/api/uploads", { method: "POST", body: data });
    const payload = await response.json();
    if (response.ok) {
      setDraft((current) => ({ ...current, imageUrl: payload.imageUrl }));
    } else {
      setError(payload.error ?? "Upload failed");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section>
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-serif text-4xl font-semibold">Products</h1>
          <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-pearl dark:bg-pearl dark:text-ink">
            <Plus size={18} />
            New
          </button>
        </div>
        <div className="mt-6 overflow-hidden rounded-lg border border-ink/10 bg-white dark:border-white/10 dark:bg-white/5">
          {products.map((product) => (
            <div key={product.id} className="grid gap-4 border-b border-ink/10 p-4 last:border-b-0 dark:border-white/10 md:grid-cols-[72px_1fr_auto] md:items-center">
              <div className="relative aspect-square overflow-hidden rounded-md bg-petal">
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
              </div>
              <div>
                <h2 className="font-semibold">{product.name}</h2>
                <p className="line-clamp-1 text-sm text-ink/60 dark:text-white/60">{product.description}</p>
                <p className="mt-1 text-sm">{formatCurrency(product.price)} · {product.stock} in stock · {product.category}</p>
              </div>
              <div className="flex gap-2">
                <button title="Edit product" onClick={() => { setEditing(product); setDraft({ name: product.name, description: product.description, price: product.price, imageUrl: product.imageUrl, stock: product.stock, category: product.category }); }} className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 dark:border-white/10">
                  <Pencil size={17} />
                </button>
                <button title="Delete product" onClick={() => remove(product.id)} className="grid h-10 w-10 place-items-center rounded-full text-rouge">
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <form onSubmit={submit} className="h-fit rounded-lg border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
        <h2 className="font-serif text-2xl font-semibold">{editing ? "Edit product" : "Add product"}</h2>
        <div className="mt-5 space-y-3">
          <input required placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full rounded-md border border-ink/15 bg-transparent px-3 py-3 dark:border-white/15" />
          <input required placeholder="Category" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="w-full rounded-md border border-ink/15 bg-transparent px-3 py-3 dark:border-white/15" />
          <div className="grid grid-cols-2 gap-3">
            <input required type="number" min="0.01" step="0.01" placeholder="Price" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className="w-full rounded-md border border-ink/15 bg-transparent px-3 py-3 dark:border-white/15" />
            <input required type="number" min="0" placeholder="Stock" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} className="w-full rounded-md border border-ink/15 bg-transparent px-3 py-3 dark:border-white/15" />
          </div>
          <textarea required placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="min-h-28 w-full rounded-md border border-ink/15 bg-transparent px-3 py-3 dark:border-white/15" />
          <input required placeholder="Image URL" value={draft.imageUrl} onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} className="w-full rounded-md border border-ink/15 bg-transparent px-3 py-3 dark:border-white/15" />
          <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-ink/15 px-4 py-3 text-sm font-semibold dark:border-white/15">
            <Upload size={18} />
            Upload image
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => upload(e.target.files?.[0] ?? null)} className="sr-only" />
          </label>
        </div>
        {error ? <p className="mt-4 rounded-md bg-rouge/10 px-3 py-2 text-sm text-rouge">{error}</p> : null}
        <button className="mt-5 w-full rounded-md bg-rouge px-4 py-3 text-sm font-semibold text-white">Save product</button>
      </form>
    </div>
  );
}

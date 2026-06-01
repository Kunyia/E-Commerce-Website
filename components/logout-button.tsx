"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button aria-label="Logout" title="Logout" onClick={logout} className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 hover:bg-ink/5 dark:border-white/10 dark:hover:bg-white/10">
      <LogOut size={18} />
    </button>
  );
}

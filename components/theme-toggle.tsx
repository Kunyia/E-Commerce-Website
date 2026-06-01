"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", shouldDark);
    setDark(shouldDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <button aria-label="Toggle dark mode" title="Toggle dark mode" onClick={toggle} className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 hover:bg-ink/5 dark:border-white/10 dark:hover:bg-white/10">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

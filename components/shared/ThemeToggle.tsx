"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  variant?: "pill" | "icon";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  variant = "pill",
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const observer = new MutationObserver(() => {
      const darkNow = document.documentElement.classList.contains("dark");
      setTheme(darkNow ? "dark" : "light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("isy_theme", "dark");
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("isy_theme", "light");
      } catch {}
    }
    setTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <div
        className={`h-8 w-16 rounded-full bg-surface-secondary border border-border animate-pulse ${className}`}
      />
    );
  }

  if (variant === "icon") {
    return (
      <button
        onClick={toggleTheme}
        aria-label={`Ubah ke mode ${theme === "dark" ? "terang (light)" : "gelap (dark)"}`}
        title={`Mode ${theme === "dark" ? "Gelap (Klik untuk Light)" : "Terang (Klik untuk Dark)"}`}
        className={`p-2 rounded-xl bg-surface border border-border text-foreground hover:bg-surface-secondary transition-all active:scale-95 shadow-2xs ${className}`}
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Ganti mode tema (saat ini ${theme === "dark" ? "Dark" : "Light"})`}
      title={`Klik untuk ganti ke mode ${theme === "dark" ? "Light" : "Dark"}`}
      className={`inline-flex items-center gap-1.5 p-1 rounded-full bg-surface-secondary border border-border hover:border-border/80 transition-all active:scale-95 select-none shadow-2xs ${className}`}
    >
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] transition-all ${
          theme === "light"
            ? "bg-amber-500/15 text-amber-950 border border-amber-500/30 shadow-subtle font-bold"
            : "text-foreground-muted hover:text-foreground font-medium"
        }`}
      >
        <Sun className="w-3.5 h-3.5 text-amber-600" />
        <span className="hidden sm:inline">Light</span>
      </span>

      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] transition-all ${
          theme === "dark"
            ? "bg-slate-800 text-slate-100 border border-slate-700 shadow-subtle font-bold"
            : "text-foreground-muted hover:text-foreground font-medium"
        }`}
      >
        <Moon className="w-3.5 h-3.5 text-indigo-300" />
        <span className="hidden sm:inline">Dark</span>
      </span>
    </button>
  );
};

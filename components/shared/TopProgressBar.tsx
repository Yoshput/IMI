"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const trickleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const watchdogTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeOutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  // Clear all active timers
  const clearTimers = useCallback(() => {
    if (trickleTimerRef.current) clearInterval(trickleTimerRef.current);
    if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
    if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
  }, []);

  // Complete and hide progress bar
  const complete = useCallback(() => {
    clearTimers();
    isNavigatingRef.current = false;
    setProgress(100);

    // Fade out smoothly after reaching 100%
    fadeOutTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, 240);
  }, [clearTimers]);

  // Start progress bar with smooth trickle
  const start = useCallback(() => {
    clearTimers();
    isNavigatingRef.current = true;
    setIsVisible(true);
    setProgress(18);

    // Trickle forward naturally
    trickleTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return prev;
        const diff = 88 - prev;
        const inc = Math.max(1, Math.random() * (diff * 0.15));
        return Math.min(88, prev + inc);
      });
    }, 180);

    // Watchdog timer: auto-complete if navigation exceeds 4.5s
    watchdogTimerRef.current = setTimeout(() => {
      if (isNavigatingRef.current) {
        complete();
      }
    }, 4500);
  }, [clearTimers, complete]);

  // Listen for route / query changes to complete loading
  useEffect(() => {
    if (isNavigatingRef.current) {
      complete();
    }
  }, [pathname, searchParams, complete]);

  // Global click listener to detect internal link clicks
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find nearest anchor tag
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external, hash, target blank, or download links
      if (
        href.startsWith("http") &&
        !href.startsWith(window.location.origin)
      ) {
        return;
      }
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }
      if (target.getAttribute("target") === "_blank") return;
      if (target.hasAttribute("download")) return;

      // Ignore if clicking the exact current URL without params difference
      const targetUrl = new URL(href, window.location.href);
      if (targetUrl.href === window.location.href) return;

      // Start progress bar
      start();
    };

    // Listen for custom trigger event
    const handleCustomStart = () => start();
    const handleCustomComplete = () => complete();

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("app-navigation-start", handleCustomStart);
    window.addEventListener("app-navigation-complete", handleCustomComplete);

    return () => {
      clearTimers();
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("app-navigation-start", handleCustomStart);
      window.removeEventListener("app-navigation-complete", handleCustomComplete);
    };
  }, [start, complete, clearTimers]);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-200"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Hairline 2.5px Bar */}
      <div
        className="h-[2.5px] bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8),0_0_4px_rgba(16,185,129,0.5)] transition-all duration-200 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        {/* Glow Pip at front edge */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-400/40 rounded-full blur-xs -mr-1" />
      </div>
    </div>
  );
}

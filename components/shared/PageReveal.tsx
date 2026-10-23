"use client";

import React, { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import gsap from "gsap";

interface PageRevealProps {
  children: React.ReactNode;
}

export function PageReveal({ children }: PageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    // Skip initial mount animation to prevent FOUC / layout flicker on SSR load
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }

    if (!containerRef.current) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // GSAP context for scoped animation & automatic cleanup
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0.75,
          y: 5,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.22,
          ease: "power2.out",
          clearProps: "all",
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [pathname, searchParams]);

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}

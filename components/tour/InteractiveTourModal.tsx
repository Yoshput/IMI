"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDashboardTour } from "./DashboardTourProvider";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  Lightbulb,
  Building2,
  Calendar,
  BarChart3,
  TrendingUp,
  Table2,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import gsap from "gsap";

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export function InteractiveTourModal() {
  const {
    currentStepIndex,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
  } = useDashboardTour();

  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [arrowPlacement, setArrowPlacement] = useState<"top" | "bottom" | "none">("bottom");
  const tooltipRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const isWelcomeStep = currentStep.id === "welcome";
  const isLastStep = currentStepIndex === totalSteps - 1;

  // Measure and align to target element
  const updateTargetPosition = useCallback(() => {
    if (isWelcomeStep || !currentStep.targetSelector) {
      setTargetRect(null);
      return;
    }

    // Try primary selector, then mobile selector
    let el = document.querySelector(currentStep.targetSelector) as HTMLElement | null;
    if (!el && currentStep.mobileTargetSelector) {
      el = document.querySelector(currentStep.mobileTargetSelector) as HTMLElement | null;
    }

    if (!el) {
      // Element not in DOM right now; show centered fallback
      setTargetRect(null);
      return;
    }

    // Scroll into view with breathing room
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    const rect = el.getBoundingClientRect();
    const padding = 8;
    const computedRect: TargetRect = {
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
      bottom: rect.bottom + padding,
      right: rect.right + padding,
    };
    setTargetRect(computedRect);

    // Calculate optimal tooltip position
    const tooltipWidth = Math.min(380, window.innerWidth - 32);
    const tooltipHeight = 240; // estimated max height
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top = 0;
    let left = 0;
    let placement: "top" | "bottom" | "none" = "bottom";

    // Check space below target
    const spaceBelow = viewportHeight - computedRect.bottom;
    const spaceAbove = computedRect.top;

    if (spaceBelow >= tooltipHeight + 20) {
      // Place below target
      top = computedRect.bottom + 12;
      placement = "bottom";
    } else if (spaceAbove >= tooltipHeight + 20) {
      // Place above target
      top = computedRect.top - tooltipHeight - 12;
      placement = "top";
    } else {
      // Screen too small or target fills view; center vertically below target or at bottom
      top = Math.max(16, Math.min(viewportHeight - tooltipHeight - 16, computedRect.bottom + 10));
      placement = "none";
    }

    // Center horizontally relative to target, clamped to viewport margins
    const targetCenterX = computedRect.left + computedRect.width / 2;
    left = targetCenterX - tooltipWidth / 2;
    left = Math.max(16, Math.min(viewportWidth - tooltipWidth - 16, left));

    setTooltipPos({ top, left });
    setArrowPlacement(placement);
  }, [isWelcomeStep, currentStep]);

  // Update position on step change and window resize/scroll
  useEffect(() => {
    updateTargetPosition();

    const handleResizeOrScroll = () => {
      updateTargetPosition();
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
    };
  }, [updateTargetPosition]);

  // GSAP micro-animation on tooltip change
  useEffect(() => {
    if (tooltipRef.current) {
      gsap.fromTo(
        tooltipRef.current,
        { opacity: 0, scale: 0.96, y: 4 },
        { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: "power2.out" }
      );
    }
  }, [currentStepIndex]);

  // Keyboard navigation & trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        skipTour();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextStep();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextStep, prevStep, skipTour]);

  // Icon mapping per step
  const renderStepIcon = () => {
    switch (currentStep.id) {
      case "welcome":
        return <Sparkles className="w-6 h-6 text-emerald-500" />;
      case "branch-filter":
        return <Building2 className="w-5 h-5 text-emerald-500" />;
      case "date-range":
        return <Calendar className="w-5 h-5 text-emerald-500" />;
      case "kpi-metrics":
        return <BarChart3 className="w-5 h-5 text-emerald-500" />;
      case "performance-chart":
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case "campaign-table":
        return <Table2 className="w-5 h-5 text-emerald-500" />;
      case "tour-help-button":
        return <HelpCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <Compass className="w-5 h-5 text-emerald-500" />;
    }
  };

  // =========================================================================
  // CASE 1: WELCOME MODAL (STEP 0)
  // =========================================================================
  if (isWelcomeStep) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Panduan Selamat Datang IMI"
        className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      >
        <div
          ref={modalRef}
          className="w-full max-w-lg bg-surface dark:bg-[#121E19] border border-[#124734]/25 dark:border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 relative"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={skipTour}
            className="absolute top-4 right-4 p-2 rounded-full text-foreground-muted hover:text-foreground hover:bg-muted/50 transition-colors"
            title="Lewati panduan (Esc)"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 block">
                Executive Guided Walkthrough
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                {currentStep.title}
              </h2>
            </div>
          </div>

          <p className="text-sm text-foreground-secondary leading-relaxed mb-5">
            {currentStep.description}
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs text-foreground-secondary">
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>5 Cabang Terintegrasi</span>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Audit Harian Google Sheets</span>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>GSC &amp; Antrian Cek Mata</span>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>100% Data Riil Terverifikasi</span>
            </div>
          </div>

          {/* Tip */}
          <div className="p-3 rounded-xl bg-emerald-500/8 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-start gap-2.5 mb-6 text-xs text-foreground-secondary">
            <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>{currentStep.tip}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={skipTour}
              className="px-4 py-2 text-xs font-semibold text-foreground-muted hover:text-foreground transition-colors"
            >
              Lewati Sekarang
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#124734] hover:bg-[#185c44] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Mulai Panduan (1 Menit)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE 2: SPOTLIGHT GUIDED WALKTHROUGH (STEPS 1 to 6)
  // =========================================================================
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Panduan Langkah ${currentStepIndex + 1}: ${currentStep.title}`}
      className="fixed inset-0 z-[99990] pointer-events-auto"
    >
      {/* SVG Mask Spotlight Dimming */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none transition-all duration-300">
        <defs>
          <mask id="tour-spotlight-mask">
            {/* White covers all (opaque overlay) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cut-out for target element (transparent hole) */}
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="10"
                ry="10"
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Dimming overlay rectangle with mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(10, 18, 14, 0.72)"
          mask="url(#tour-spotlight-mask)"
        />
      </svg>

      {/* Target Highlight Glowing Outline */}
      {targetRect && (
        <div
          className="fixed pointer-events-none rounded-xl border-2 border-emerald-400 dark:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.55)] transition-all duration-300 z-[99992]"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
          }}
        />
      )}

      {/* Floating Tooltip Card */}
      <div
        ref={tooltipRef}
        className="fixed z-[99995] w-full max-w-[380px] bg-surface dark:bg-[#121E19] border border-[#124734]/25 dark:border-emerald-500/40 rounded-2xl shadow-2xl p-5 text-foreground transition-all duration-200"
        style={{
          top: targetRect ? `${tooltipPos.top}px` : "50%",
          left: targetRect ? `${tooltipPos.left}px` : "50%",
          transform: targetRect ? "none" : "translate(-50%, -50%)",
        }}
      >
        {/* Step Badge & Close */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              {renderStepIcon()}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Langkah {currentStepIndex + 1} dari {totalSteps}
            </span>
          </div>

          <button
            type="button"
            onClick={skipTour}
            className="p-1 rounded-full text-foreground-muted hover:text-foreground hover:bg-muted/50 transition-colors"
            title="Tutup panduan (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-base font-extrabold text-foreground tracking-tight">
          {currentStep.title}
        </h3>
        {currentStep.subtitle && (
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-0.5 mb-2">
            {currentStep.subtitle}
          </p>
        )}

        {/* Description */}
        <p className="text-xs text-foreground-secondary leading-relaxed mb-3">
          {currentStep.description}
        </p>

        {/* Tip Box */}
        {currentStep.tip && (
          <div className="p-2.5 rounded-xl bg-emerald-500/8 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-start gap-2 mb-4 text-[11px] text-foreground-secondary">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>{currentStep.tip}</span>
          </div>
        )}

        {/* Progress Bar & Actions */}
        <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
          {/* Dots Indicator */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentStepIndex
                    ? "w-4 bg-emerald-600 dark:bg-emerald-400"
                    : idx < currentStepIndex
                    ? "w-1.5 bg-emerald-600/40 dark:bg-emerald-400/40"
                    : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            {currentStepIndex > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="p-1.5 rounded-lg border border-border text-foreground-secondary hover:text-foreground hover:bg-muted/50 text-xs transition-colors"
                title="Langkah sebelumnya (Panah Kiri)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={isLastStep ? completeTour : nextStep}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#124734] hover:bg-[#185c44] text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <span>{isLastStep ? "Selesai" : "Lanjut"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

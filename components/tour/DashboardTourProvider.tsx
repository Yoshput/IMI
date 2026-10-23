"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { TOUR_STEPS, TourStep } from "./tour-config";
import { InteractiveTourModal } from "./InteractiveTourModal";

interface TourContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep;
  totalSteps: number;
  startTour: (force?: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  goToStep: (index: number) => void;
  hasCompletedTour: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const TOUR_STORAGE_KEY = "imi_tour_v1_completed";

export function DashboardTourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(true); // default true until client check

  // Check localStorage on mount
  useEffect(() => {
    try {
      const completed = localStorage.getItem(TOUR_STORAGE_KEY);
      if (completed === "true") {
        setHasCompletedTour(true);
      } else {
        setHasCompletedTour(false);

        // Auto prompt on first visit if on dashboard or home
        if (pathname === "/dashboard" || pathname === "/") {
          const timer = setTimeout(() => {
            setIsActive(true);
            setCurrentStepIndex(0);
          }, 850);
          return () => clearTimeout(timer);
        }
      }
    } catch (e) {
      console.warn("Could not access localStorage for tour state:", e);
    }
  }, [pathname]);

  const startTour = useCallback((force = true) => {
    setCurrentStepIndex(0);
    setIsActive(true);
    if (force) {
      try {
        localStorage.removeItem(TOUR_STORAGE_KEY);
        setHasCompletedTour(false);
      } catch (e) {
        console.warn("localStorage error:", e);
      }
    }
  }, []);

  const skipTour = useCallback(() => {
    setIsActive(false);
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
      setHasCompletedTour(true);
    } catch (e) {
      console.warn("localStorage error:", e);
    }
  }, []);

  const completeTour = useCallback(() => {
    setIsActive(false);
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
      setHasCompletedTour(true);
    } catch (e) {
      console.warn("localStorage error:", e);
    }

    // Dispatch completion event for optional toast
    window.dispatchEvent(
      new CustomEvent("app-toast", {
        detail: {
          title: "Panduan Selesai",
          message: "Anda dapat membuka kembali panduan kapan saja melalui tombol '? Panduan' di header.",
          type: "success",
        },
      })
    );
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev >= TOUR_STEPS.length - 1) {
        completeTour();
        return prev;
      }
      return prev + 1;
    });
  }, [completeTour]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < TOUR_STEPS.length) {
      setCurrentStepIndex(index);
    }
  }, []);

  const currentStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];

  // Listen for global custom trigger event
  useEffect(() => {
    const handleStartTour = () => startTour(true);
    window.addEventListener("start-imi-tour", handleStartTour);
    return () => window.removeEventListener("start-imi-tour", handleStartTour);
  }, [startTour]);

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep,
        totalSteps: TOUR_STEPS.length,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        completeTour,
        goToStep,
        hasCompletedTour,
      }}
    >
      {children}
      {isActive && <InteractiveTourModal />}
    </TourContext.Provider>
  );
}

export function useDashboardTour() {
  const context = useContext(TourContext);
  if (!context) {
    return {
      isActive: false,
      currentStepIndex: 0,
      currentStep: TOUR_STEPS[0],
      totalSteps: TOUR_STEPS.length,
      startTour: () => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("start-imi-tour"));
        }
      },
      nextStep: () => {},
      prevStep: () => {},
      skipTour: () => {},
      completeTour: () => {},
      goToStep: () => {},
      hasCompletedTour: true,
    };
  }
  return context;
}

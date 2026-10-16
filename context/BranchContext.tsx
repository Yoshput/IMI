"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  CanonicalBranchId,
  CanonicalBranchMeta,
  CANONICAL_BRANCHES,
  normalizeBranchId,
  matchesBranch,
} from "@/lib/branch-accounts";

export type { CanonicalBranchId, CanonicalBranchMeta };
export { CANONICAL_BRANCHES, normalizeBranchId, matchesBranch };

interface BranchContextValue {
  selectedBranchId: CanonicalBranchId;
  setSelectedBranchId: (id: CanonicalBranchId | string) => void;
  selectedBranchMeta: CanonicalBranchMeta;
  matchesCurrentBranch: (itemBranch?: string | null) => boolean;
  branches: CanonicalBranchMeta[];
}

const BranchContext = createContext<BranchContextValue | undefined>(undefined);

const STORAGE_KEY = "isy_active_branch";

function BranchSearchParamSync({
  onSync,
}: {
  onSync: (branch: string) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const paramBranch = searchParams?.get("branch");
    if (paramBranch) {
      onSync(paramBranch);
    }
  }, [searchParams, onSync]);
  return null;
}

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedBranchId, setBranchState] = useState<CanonicalBranchId>("all");

  // Read initial stored branch from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBranchState(normalizeBranchId(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleParamSync = useCallback((rawBranch: string) => {
    const canonical = normalizeBranchId(rawBranch);
    setBranchState(canonical);
    try {
      localStorage.setItem(STORAGE_KEY, canonical);
    } catch {
      // ignore
    }
  }, []);

  const setSelectedBranchId = useCallback(
    (rawId: CanonicalBranchId | string) => {
      const canonical = normalizeBranchId(rawId);
      setBranchState(canonical);

      try {
        localStorage.setItem(STORAGE_KEY, canonical);
      } catch {
        // ignore
      }

      // Sync with URL query parameter
      if (typeof window !== "undefined") {
        const currentParams = new URLSearchParams(window.location.search);
        if (canonical === "all") {
          currentParams.delete("branch");
        } else {
          currentParams.set("branch", canonical);
        }
        const qs = currentParams.toString() ? `?${currentParams.toString()}` : "";
        router.push(`${pathname}${qs}`, { scroll: false });
      }
    },
    [pathname, router]
  );

  const selectedBranchMeta = useMemo(() => {
    return (
      CANONICAL_BRANCHES.find((b) => b.id === selectedBranchId) ||
      CANONICAL_BRANCHES[0]
    );
  }, [selectedBranchId]);

  const matchesCurrentBranch = useCallback(
    (itemBranch?: string | null) => {
      return matchesBranch(itemBranch, selectedBranchId);
    },
    [selectedBranchId]
  );

  const value = useMemo(
    () => ({
      selectedBranchId,
      setSelectedBranchId,
      selectedBranchMeta,
      matchesCurrentBranch,
      branches: CANONICAL_BRANCHES,
    }),
    [selectedBranchId, setSelectedBranchId, selectedBranchMeta, matchesCurrentBranch]
  );

  return (
    <BranchContext.Provider value={value}>
      <Suspense fallback={null}>
        <BranchSearchParamSync onSync={handleParamSync} />
      </Suspense>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch(): BranchContextValue {
  const ctx = useContext(BranchContext);
  if (!ctx) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return ctx;
}

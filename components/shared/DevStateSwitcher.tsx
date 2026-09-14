"use client";

import React, { useState, useEffect } from "react";
import { Wrench } from "lucide-react";

interface DevStateSwitcherProps {
  moduleName: string;
  currentState: "success" | "loading" | "empty" | "error";
  onStateChange: (state: "success" | "loading" | "empty" | "error") => void;
}

export const DevStateSwitcher: React.FC<DevStateSwitcherProps> = ({
  moduleName,
  currentState,
  onStateChange,
}) => {
  const [isDevEnabled, setIsDevEnabled] = useState(false);

  useEffect(() => {
    // Enabled only via ?dev=true query parameter, localStorage flag, or explicit dev trigger
    const params = new URLSearchParams(window.location.search);
    const hasDevQuery = params.get("dev") === "true" || params.get("dev") === "1";
    const hasDevStorage = localStorage.getItem("isy_dev_mode") === "true";
    
    if (hasDevQuery || hasDevStorage) {
      setIsDevEnabled(true);
    }
  }, []);

  // Hidden in standard mode and during presentations (Audit Item #1)
  if (!isDevEnabled) return null;

  return (
    <div className="flex items-center justify-between p-2 rounded-control bg-[#2A3B35] text-white text-[11px] shadow-sm mb-4 border border-brand/40 animate-in fade-in duration-200">
      <div className="flex items-center gap-1.5 font-medium text-emerald-200">
        <Wrench className="w-3.5 h-3.5 text-amber-300" />
        <span className="font-bold uppercase tracking-wider">Dev State Inspector ({moduleName}):</span>
        <span className="text-[10px] text-white/70">AGENT §17 QA Mode</span>
      </div>

      <div className="flex items-center gap-1">
        {(["success", "loading", "empty", "error"] as const).map((s) => (
          <button
            key={s}
            onClick={() => onStateChange(s)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-all ${
              currentState === s
                ? "bg-amber-400 text-black shadow-xs font-bold"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            {s}
          </button>
        ))}
        <button
          onClick={() => {
            localStorage.removeItem("isy_dev_mode");
            setIsDevEnabled(false);
          }}
          className="ml-2 text-[10px] text-white/50 hover:text-white underline"
          title="Tutup Dev Inspector"
        >
          Sembunyikan
        </button>
      </div>
    </div>
  );
};

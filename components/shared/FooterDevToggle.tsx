"use client";

import React, { useState, useEffect } from "react";

export const FooterDevToggle: React.FC = () => {
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsDev(localStorage.getItem("isy_dev_mode") === "true");
  }, []);

  const toggle = () => {
    if (isDev) {
      localStorage.removeItem("isy_dev_mode");
      setIsDev(false);
      window.location.reload();
    } else {
      localStorage.setItem("isy_dev_mode", "true");
      setIsDev(true);
      window.location.reload();
    }
  };

  return (
    <button
      onClick={toggle}
      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded transition-colors ${
        isDev
          ? "bg-amber-100 text-amber-900 border border-amber-300"
          : "text-foreground-muted hover:text-foreground underline decoration-dotted"
      }`}
      title="Toggle QA Async State Inspector (AGENT §17)"
    >
      {isDev ? "QA Inspector: ON" : "QA Dev Mode"}
    </button>
  );
};

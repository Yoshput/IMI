"use client";

import React from "react";
import Image from "next/image";

export const ProductByBadge: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-foreground-muted font-normal select-none">
        Product by
      </span>
      <a
        href="https://yossikaputra.my.id/"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white border border-slate-700/80 hover:border-slate-500 shadow-sm transition-all duration-200"
        title="Yossika Putra Erlangga — Fullstack Software Engineer & AI Developer (https://yossikaputra.my.id/)"
      >
        <div className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/25 flex-shrink-0">
          <Image
            src="/yossika-avatar.webp"
            alt="Yossika Putra"
            width={24}
            height={24}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <span className="font-semibold text-xs text-white group-hover:text-emerald-300 transition-colors tracking-tight">
          Yossika Putra
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/80 group-hover:border-slate-600 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Portfolio</span>
          <svg
            className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </span>
      </a>

      {/* GitHub Icon (Matching the community icon next to pill in ngodingpakai screenshot) */}
      <a
        href="https://github.com/yoshput"
        target="_blank"
        rel="noopener noreferrer"
        className="p-1 rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
        title="GitHub: @yoshput"
        aria-label="GitHub Profile"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      </a>

      {/* LinkedIn Icon */}
      <a
        href="https://www.linkedin.com/in/yossikaputraerlangga/"
        target="_blank"
        rel="noopener noreferrer"
        className="p-1 rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
        title="LinkedIn: Yossika Putra Erlangga"
        aria-label="LinkedIn Profile"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      </a>
    </div>
  );
};

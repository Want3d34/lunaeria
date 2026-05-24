"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { dofusElements } from "@/lib/stuffs-data";

export function LunaeriaSelect({
  label,
  options,
  value,
  onChange,
  maxMenuHeight = "max-h-72",
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  maxMenuHeight?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative overflow-visible grid gap-2 ${isOpen ? "z-[99999]" : "z-40"}`}>
      <span className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">
        {label}
      </span>
      <button
        className="flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-violet-100/10 bg-[#030512]/72 px-3 text-left text-sm font-bold text-violet-50 outline-none shadow-[inset_0_0_14px_rgba(196,181,253,0.025)] transition hover:border-violet-200/22 hover:bg-[#06091b]/86"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          className={`shrink-0 text-violet-100/70 transition ${isOpen ? "rotate-180" : ""}`}
          size={16}
        />
      </button>
      {isOpen ? (
        <div
          className={`absolute left-0 right-0 top-full z-[99999] mt-2 overflow-y-auto rounded-2xl border border-violet-200/14 bg-[#050817]/98 p-1 shadow-[0_18px_42px_rgba(0,0,0,0.5),0_0_18px_rgba(124,58,237,0.13)] backdrop-blur-md ${maxMenuHeight}`}
        >
          {options.map((option) => (
            <button
              className={`flex min-h-10 w-full items-center justify-between rounded-xl px-3 text-left text-sm font-bold transition ${
                option === value
                  ? "bg-violet-100/[0.09] text-violet-50"
                  : "text-slate-400 hover:bg-violet-100/[0.055] hover:text-violet-100"
              }`}
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              type="button"
            >
              {option}
              {option === value ? <Check size={15} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ChoiceChips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option === value;

          return (
            <button
              className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
                active
                  ? "border-violet-200/24 bg-violet-100/[0.09] text-violet-50 shadow-[0_0_14px_rgba(124,58,237,0.14)]"
                  : "border-violet-100/10 bg-[#030512]/60 text-slate-400 hover:border-violet-200/18 hover:text-violet-100"
              }`}
              key={option}
              onClick={() => onChange(option)}
              type="button"
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ElementChips({
  selected,
  onChange,
  includeAll = false,
}: {
  selected: string[];
  onChange: (elements: string[]) => void;
  includeAll?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">
        Élément
      </span>
      <div className="flex flex-wrap gap-2">
        {includeAll ? (
          <button
            className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
              selected.length === 0
                ? "border-violet-200/22 bg-violet-100/[0.08] text-violet-50"
                : "border-violet-100/10 bg-[#030512]/60 text-slate-400 hover:text-violet-100"
            }`}
            onClick={() => onChange([])}
            type="button"
          >
            Tous
          </button>
        ) : null}
        {dofusElements.map((item) => {
          const active = selected.includes(item.label);

          return (
            <button
              className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
                active
                  ? "bg-violet-100/[0.08] shadow-[0_0_14px_rgba(124,58,237,0.12)]"
                  : "bg-[#030512]/60"
              }`}
              key={item.label}
              onClick={() =>
                onChange(
                  active
                    ? selected.filter((entry) => entry !== item.label)
                    : [...selected, item.label],
                )
              }
              style={{
                borderColor: `${item.accent}66`,
                color: item.accent,
              }}
              type="button"
            >
              {item.icon} {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

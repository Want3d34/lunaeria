"use client";

import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function AdminCard({
  title,
  icon: Icon,
  children,
  action,
  className = "",
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`premium-card rounded-[1.75rem] border border-violet-200/10 bg-[linear-gradient(180deg,rgba(8,12,35,0.88),rgba(4,7,25,0.78))] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.42),0_0_24px_rgba(76,29,149,0.07)] backdrop-blur-md transition duration-500 hover:border-violet-200/16 sm:p-6 ${className}`}
    >
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-violet-100/8 pb-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-violet-100/16 bg-[linear-gradient(145deg,rgba(196,181,253,0.12),rgba(76,29,149,0.055))] text-violet-100 shadow-[inset_0_1px_12px_rgba(196,181,253,0.05),0_0_15px_rgba(124,58,237,0.12)]">
            <Icon size={19} />
          </div>
          <h2 className="text-base font-black tracking-[0.06em] text-slate-50">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export function AdminSection({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`scroll-mt-6 ${className}`} id={id}>
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
}) {
  const variants = {
    primary:
      "discord-cta border-violet-200/18 bg-[linear-gradient(135deg,rgba(139,92,246,0.4),rgba(79,70,229,0.2))] text-violet-50 shadow-[0_0_22px_rgba(124,58,237,0.2),inset_0_1px_0_rgba(237,233,254,0.16)] hover:border-violet-100/32 hover:shadow-[0_0_28px_rgba(167,139,250,0.28)]",
    ghost:
      "border-violet-100/12 bg-violet-100/[0.045] text-violet-50 shadow-[inset_0_0_15px_rgba(196,181,253,0.026)] hover:border-violet-200/24 hover:bg-violet-200/8",
    danger:
      "border-rose-300/14 bg-rose-400/[0.07] text-rose-100 shadow-[0_0_16px_rgba(244,63,94,0.08)] hover:border-rose-200/30 hover:bg-rose-400/[0.12]",
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-black transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-h-12 rounded-2xl border border-violet-100/12 bg-[#030512]/78 px-4 text-sm font-semibold text-violet-50 outline-none shadow-[inset_0_0_14px_rgba(196,181,253,0.025)] transition placeholder:text-slate-600 focus:border-violet-200/32 focus:bg-[#070b22]/90 focus:shadow-[0_0_18px_rgba(124,58,237,0.14)] ${className}`}
      {...props}
    />
  );
}

export function AdminTextarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-32 rounded-2xl border border-violet-100/12 bg-[#030512]/78 px-4 py-3 text-sm font-semibold leading-6 text-violet-50 outline-none shadow-[inset_0_0_14px_rgba(196,181,253,0.025)] transition placeholder:text-slate-600 focus:border-violet-200/32 focus:bg-[#070b22]/90 focus:shadow-[0_0_18px_rgba(124,58,237,0.14)] ${className}`}
      {...props}
    />
  );
}

export function AdminField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2.5">
      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-200/82">
        {label}
      </span>
      {children}
    </label>
  );
}

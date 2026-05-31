"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

export type LunaeriaToastType = "success" | "error" | "info" | "warning";

export type LunaeriaToastNotice = {
  message: string;
  type: LunaeriaToastType;
};

const toastStyles: Record<LunaeriaToastType, string> = {
  success: "border-emerald-300/24 text-emerald-100",
  error: "border-rose-300/28 text-rose-100",
  info: "border-violet-300/24 text-violet-100",
  warning: "border-amber-300/28 text-amber-100",
};

const toastIcons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

export function inferLunaeriaToastType(message: string): LunaeriaToastType {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("erreur") ||
    normalizedMessage.includes("impossible")
  ) {
    return "error";
  }

  if (
    normalizedMessage.includes("obligatoire") ||
    normalizedMessage.includes("connecte")
  ) {
    return "warning";
  }

  return "success";
}

export function LunaeriaToast({
  notice,
  onDismiss,
  duration = 3500,
}: {
  notice: LunaeriaToastNotice;
  onDismiss: () => void;
  duration?: number;
}) {
  const [isLeaving, setIsLeaving] = useState(false);
  const Icon = toastIcons[notice.type];

  useEffect(() => {
    const leaveTimeout = window.setTimeout(() => {
      setIsLeaving(true);
    }, duration);
    const dismissTimeout = window.setTimeout(() => {
      onDismiss();
    }, duration + 260);

    return () => {
      window.clearTimeout(leaveTimeout);
      window.clearTimeout(dismissTimeout);
    };
  }, [duration, notice, onDismiss]);

  return (
    <div
      aria-live="polite"
      className={`lunaeria-toast fixed right-4 top-4 z-[100000] flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-2xl border bg-[#090617]/96 px-4 py-3 text-sm font-bold shadow-[0_18px_48px_rgba(0,0,0,0.52),0_0_24px_rgba(124,58,237,0.2)] backdrop-blur-xl sm:right-6 sm:top-6 sm:max-w-sm ${
        toastStyles[notice.type]
      } ${isLeaving ? "lunaeria-toast--leaving" : ""}`}
      role="status"
    >
      <Icon className="mt-0.5 shrink-0" size={18} />
      <span className="leading-5">{notice.message}</span>
      <button
        aria-label="Fermer la notification"
        className="ml-auto grid size-6 shrink-0 place-items-center rounded-lg text-current/70 transition hover:bg-white/8 hover:text-current"
        onClick={onDismiss}
        type="button"
      >
        <X size={14} />
      </button>
    </div>
  );
}

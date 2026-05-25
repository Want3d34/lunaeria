"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AuthCallbackPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function completeAuth() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const next = url.searchParams.get("next") || "/";

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            throw error;
          }
        } else {
          const { error } = await supabase.auth.getSession();

          if (error) {
            throw error;
          }
        }

        window.location.replace(next.startsWith("/") ? next : "/");
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setErrorMessage("Connexion Discord impossible. Retournez a l'accueil.");
        }
      }
    }

    completeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030512] px-6 text-violet-50">
      <div className="rounded-2xl border border-violet-200/12 bg-violet-100/[0.055] px-6 py-5 text-center shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-md">
        <p className="text-sm font-black uppercase tracking-[0.18em]">
          Connexion Discord
        </p>
        <p className="mt-3 text-sm text-violet-100/72">
          {errorMessage ?? "Finalisation en cours..."}
        </p>
      </div>
    </main>
  );
}

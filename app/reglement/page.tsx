"use client";

import { ArrowLeft, ScrollText, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { useHomepageContent } from "@/lib/lunaeria-content";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function splitRules(body: string) {
  const normalizedBody = body.replace(
    "Bienvenue dans Lunaeria",
    "Bienvenue chez Lunaeria",
  );
  const blocks = normalizedBody
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const [, introTitle, introText, ...sections] = blocks;

  return { introTitle, introText, sections };
}

export default function ReglementPage() {
  const { content } = useHomepageContent();
  const [regulationBody, setRegulationBody] = useState(content.regulation.body);
  const { introTitle, introText, sections } = splitRules(regulationBody);

  useEffect(() => {
    async function loadReglementFromSupabase() {
      const { data, error } = await supabase
        .from("reglement")
        .select("*")
        .order("id", { ascending: true })
        .limit(1)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setRegulationBody(data.body || content.regulation.body);
    }

    loadReglementFromSupabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-45" />
      <div className="fog-veil fixed inset-0" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-black text-violet-100 transition hover:text-violet-50"
          href="/"
        >
          <ArrowLeft size={17} />
          Retour au hub
        </Link>

        <header className="premium-card mt-6 rounded-[2rem] border border-violet-200/10 bg-[#06091b]/76 p-7 text-center shadow-[0_42px_120px_rgba(0,0,0,0.55),0_0_28px_rgba(76,29,149,0.08)] backdrop-blur-md sm:p-10">
          <div className="relative z-10 mx-auto grid size-16 place-items-center rounded-3xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820] shadow-[0_0_22px_rgba(124,58,237,0.22)]">
            <LunaeriaLogo size={35} />
          </div>
          <p className="relative z-10 mt-6 text-xs font-black uppercase tracking-[0.3em] text-violet-200">
            Charte officielle
          </p>
          <h1 className="legend-title relative z-10 mt-3 text-4xl font-black text-violet-50 sm:text-6xl">
            {content.regulation.title}
          </h1>
          <p className="relative z-10 mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-300">
            {introText}
          </p>
        </header>

        <section className="mt-8 grid gap-5">
          {introTitle ? (
            <div className="grid gap-5">
              <article className="premium-card rounded-[1.6rem] border border-violet-200/10 bg-[#06091b]/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-md">
              <div className="relative z-10 flex items-center gap-3">
                <Sparkles className="text-violet-100" size={20} />
                <h2 className="text-xl font-black text-violet-50">
                  {introTitle}
                </h2>
              </div>
              </article>
            </div>
          ) : null}

          {sections.map((section, index) => {
            const lines = section.split("\n").filter(Boolean);
            const title = lines[0];
            const bodyLines = lines.slice(1);

            return (
              <section
                className="grid gap-5"
                key={`${title}-${index}`}
              >
                <article className="premium-card rounded-[1.4rem] border border-violet-200/10 bg-[#06091b]/70 p-5 shadow-[0_18px_54px_rgba(0,0,0,0.34)] backdrop-blur-md sm:p-6">
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-2xl border border-violet-100/14 bg-violet-100/[0.055] text-violet-100">
                      {index % 2 === 0 ? (
                        <ShieldCheck size={19} />
                      ) : (
                        <ScrollText size={19} />
                      )}
                    </div>
                    <h2 className="text-xl font-black text-violet-50">{title}</h2>
                  </div>
                </article>
                <div className="space-y-5 px-1 text-[15px] leading-8 text-slate-300 sm:px-4">
                  {bodyLines.map((line) =>
                    line.startsWith("-") ? (
                      <p
                        className="pl-4 text-violet-100/90 before:mr-3 before:text-violet-300 before:content-['•']"
                        key={line}
                      >
                        {line.replace(/^- /, "")}
                      </p>
                    ) : (
                      <p key={line}>{line}</p>
                    ),
                  )}
                </div>
              </section>
            );
          })}
        </section>
      </div>
    </main>
  );
}

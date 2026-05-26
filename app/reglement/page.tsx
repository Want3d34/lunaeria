"use client";

import { ScrollText, ShieldCheck, Sparkles } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { PageSidebar } from "@/components/page-sidebar";
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
  const [regulationBody, setRegulationBody] = useState("");
  const [isRegulationLoaded, setIsRegulationLoaded] = useState(false);
  const { introTitle, introText, sections } = splitRules(regulationBody);
  const sidebarItems = [
    { label: "Règlement", href: "#reglement", icon: ScrollText, active: true },
    ...sections.slice(0, 6).map((section, index) => ({
      label: section.split("\n").filter(Boolean)[0] || `Section ${index + 1}`,
      href: `#regle-${index}`,
      icon: index % 2 === 0 ? ShieldCheck : ScrollText,
    })),
  ];

  useEffect(() => {
    async function loadReglementFromSupabase() {
      const { data, error } = await supabase
        .from("reglement")
        .select("*")
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(error);
        setRegulationBody(content.regulation.body);
        setIsRegulationLoaded(true);
        return;
      }

      if (!data) {
        setRegulationBody(content.regulation.body);
        setIsRegulationLoaded(true);
        return;
      }

      setRegulationBody(data.body ?? content.regulation.body);
      setIsRegulationLoaded(true);
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

      <PageSidebar items={sidebarItems} subtitle="Charte" title="LUNAE" />

      <div className="relative z-10 min-h-screen px-4 py-8 pt-[8.25rem] sm:px-6 sm:pt-[8.5rem] lg:ml-72 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-5xl">
        <header className="premium-card rounded-[2rem] border border-violet-200/10 bg-[#06091b]/76 p-7 text-center shadow-[0_42px_120px_rgba(0,0,0,0.55),0_0_28px_rgba(76,29,149,0.08)] backdrop-blur-md sm:p-10" id="reglement">
          <div className="relative z-10 mx-auto grid size-16 place-items-center rounded-3xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820] shadow-[0_0_22px_rgba(124,58,237,0.22)]">
            <LunaeriaLogo size={35} />
          </div>
          <p className="relative z-10 mt-6 text-xs font-black uppercase tracking-[0.3em] text-violet-200">
            Charte officielle
          </p>
          {isRegulationLoaded ? (
            <>
              <h1 className="legend-title relative z-10 mt-3 text-4xl font-black text-violet-50 sm:text-6xl">
                Règlement
              </h1>
              <p className="relative z-10 mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-300">
                {introText}
              </p>
            </>
          ) : (
            <div className="relative z-10 mx-auto mt-5 max-w-3xl space-y-4" aria-hidden="true">
              <div className="mx-auto h-12 w-2/3 rounded-2xl bg-violet-100/[0.055]" />
              <div className="mx-auto h-5 w-4/5 rounded-full bg-violet-100/[0.04]" />
            </div>
          )}
        </header>

        <section className="mt-8 grid gap-5">
          {!isRegulationLoaded ? (
            <div className="grid gap-5" aria-hidden="true">
              <div className="h-24 rounded-[1.4rem] border border-violet-200/10 bg-[#06091b]/70 shadow-[0_18px_54px_rgba(0,0,0,0.34)] backdrop-blur-md" />
              <div className="h-40 rounded-[1.4rem] border border-violet-200/10 bg-[#06091b]/50 backdrop-blur-md" />
            </div>
          ) : null}
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
                id={`regle-${index}`}
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
      </div>
    </main>
  );
}

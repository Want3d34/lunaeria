"use client";

import { CheckCircle2, ScrollText, Sparkles } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { PageSidebar } from "@/components/page-sidebar";
import { useHomepageContent } from "@/lib/lunaeria-content";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const REGULATION_ACCEPTANCE_KEY = "lunaeria-reglement-accepted";

function splitRules(body: string) {
  const normalizedBody = body.replace(
    "Bienvenue dans Lunaeria",
    "Bienvenue chez Lunaeria",
  );
  const blocks = normalizedBody
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const firstSectionIndex = blocks.findIndex((block) =>
    /^\s*\d+\.\s/.test(block),
  );
  const introTitle = blocks[1] ?? "";
  const introText =
    firstSectionIndex > 2
      ? blocks.slice(2, firstSectionIndex).join("\n\n")
      : blocks[2] ?? "";
  const contentBlocks =
    firstSectionIndex >= 0 ? blocks.slice(firstSectionIndex) : blocks.slice(3);
  const sections: { title: string; lines: string[] }[] = [];

  for (const block of contentBlocks) {
    const isSectionTitle =
      /^\d+\.\s/.test(block) || block.toLowerCase() === "valeurs de lunaeria";

    if (isSectionTitle || sections.length === 0) {
      sections.push({ title: block, lines: [] });
      continue;
    }

    sections[sections.length - 1].lines.push(
      ...block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    );
  }

  return { introTitle, introText, sections };
}

function RegulationLine({ line }: { line: string }) {
  if (line.endsWith(":")) {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-violet-100/10 bg-violet-100/[0.035] px-4 py-3 text-violet-50">
        <ScrollText className="shrink-0 text-violet-100" size={18} />
        <p className="font-black">{line}</p>
      </div>
    );
  }

  if (line.startsWith("-")) {
    return (
      <p className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.025] px-4 py-3 text-violet-100/90 before:mr-3 before:text-violet-300 before:content-['•']">
        {line.replace(/^- /, "")}
      </p>
    );
  }

  return <p>{line}</p>;
}

export default function ReglementPage() {
  const { content } = useHomepageContent();
  const [regulationBody, setRegulationBody] = useState("");
  const [isRegulationLoaded, setIsRegulationLoaded] = useState(false);
  const [isDiscordConnected, setIsDiscordConnected] = useState(false);
  const [hasAcceptedRegulation, setHasAcceptedRegulation] = useState(false);
  const { introTitle, introText, sections } = splitRules(regulationBody);

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

      setRegulationBody(data?.body ?? content.regulation.body);
      setIsRegulationLoaded(true);
    }

    loadReglementFromSupabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function loadDiscordSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        return;
      }

      const user = data.session?.user;
      const hasDiscordIdentity = Boolean(
        user?.identities?.some((identity) => identity.provider === "discord"),
      );

      setIsDiscordConnected(hasDiscordIdentity);

      if (user?.id && typeof window !== "undefined") {
        setHasAcceptedRegulation(
          window.localStorage.getItem(`${REGULATION_ACCEPTANCE_KEY}:${user.id}`) ===
            "true",
        );
      }
    }

    loadDiscordSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const hasDiscordIdentity = Boolean(
        session?.user.identities?.some((identity) => identity.provider === "discord"),
      );

      setIsDiscordConnected(hasDiscordIdentity);

      if (!session?.user.id || typeof window === "undefined") {
        setHasAcceptedRegulation(false);
        return;
      }

      setHasAcceptedRegulation(
        window.localStorage.getItem(
          `${REGULATION_ACCEPTANCE_KEY}:${session.user.id}`,
        ) === "true",
      );
    });

    return () => subscription.unsubscribe();
  }, []);

  async function acceptRegulation() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error(error);
      return;
    }

    const userId = data.session?.user.id;

    if (!userId || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(`${REGULATION_ACCEPTANCE_KEY}:${userId}`, "true");
    setHasAcceptedRegulation(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-45" />
      <div className="fog-veil fixed inset-0" />

      <PageSidebar
        items={[
          { label: "Règlement", href: "#reglement", icon: ScrollText, active: true },
        ]}
        subtitle="Charte"
        title="LUNAE"
      />

      <div className="relative z-10 min-h-screen px-4 py-8 pt-[8.25rem] sm:px-6 sm:pt-[8.5rem] lg:ml-72 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-5xl">
          <header
            className="premium-card rounded-[2rem] border border-violet-200/10 bg-[#06091b]/76 p-7 text-center shadow-[0_42px_120px_rgba(0,0,0,0.55),0_0_28px_rgba(76,29,149,0.08)] backdrop-blur-md sm:p-10"
            id="reglement"
          >
            <div className="relative z-10 mx-auto grid size-16 place-items-center rounded-3xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820] shadow-[0_0_22px_rgba(124,58,237,0.22)]">
              <LunaeriaLogo size={35} />
            </div>
            <p className="relative z-10 mt-6 text-xs font-black uppercase tracking-[0.3em] text-violet-200">
              Charte officielle
            </p>
            <h1 className="legend-title relative z-10 mt-3 text-4xl font-black text-violet-50 sm:text-6xl">
              Règlement
            </h1>
          </header>

          <section className="mt-8 grid gap-6">
            {!isRegulationLoaded ? (
              <div className="grid gap-5" aria-hidden="true">
                <div className="h-28 rounded-[1.4rem] border border-violet-200/10 bg-[#06091b]/70 shadow-[0_18px_54px_rgba(0,0,0,0.34)] backdrop-blur-md" />
                <div className="h-56 rounded-[1.4rem] border border-violet-200/10 bg-[#06091b]/50 backdrop-blur-md" />
              </div>
            ) : null}

            {introTitle && introText ? (
              <article className="premium-card rounded-[1.6rem] border border-violet-200/10 bg-[#06091b]/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-md sm:p-7">
                <div className="relative z-10">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-violet-100" size={20} />
                    <h2 className="text-2xl font-black text-violet-50">
                      {introTitle}
                    </h2>
                  </div>
                  {introText ? (
                    <p className="mt-5 text-base leading-8 text-slate-300">
                      {introText}
                    </p>
                  ) : null}
                </div>
              </article>
            ) : null}

            {sections.map((section) => (
              <article
                className="premium-card rounded-[1.6rem] border border-violet-200/10 bg-[#06091b]/70 p-6 shadow-[0_18px_54px_rgba(0,0,0,0.34)] backdrop-blur-md sm:p-7"
                key={section.title}
              >
                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-violet-100/14 bg-violet-100/[0.055] text-violet-100">
                      <ScrollText size={19} />
                    </div>
                    <h2 className="pt-1 text-2xl font-black leading-tight text-violet-50">
                      {section.title}
                    </h2>
                  </div>
                  <div className="mt-6 space-y-4 text-[15px] leading-8 text-slate-300 sm:text-base sm:leading-8">
                    {section.lines.map((line) => (
                      <RegulationLine key={`${section.title}-${line}`} line={line} />
                    ))}
                  </div>
                </div>
              </article>
            ))}

            {isDiscordConnected ? (
              <div className="premium-card rounded-[1.6rem] border border-violet-200/10 bg-[#06091b]/70 p-5 shadow-[0_18px_54px_rgba(0,0,0,0.34)] backdrop-blur-md sm:p-6">
                <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-violet-100" size={22} />
                    <div>
                      <p className="font-black text-violet-50">
                        Validation du règlement
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {hasAcceptedRegulation
                          ? "Règlement validé avec ce compte Discord."
                          : "Confirme que tu as lu et accepté la charte Lunaeria."}
                      </p>
                    </div>
                  </div>
                  <button
                    className="discord-cta inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200/18 bg-[linear-gradient(135deg,rgba(139,92,246,0.36),rgba(79,70,229,0.18))] px-5 text-sm font-black text-violet-50 transition hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-70"
                    disabled={hasAcceptedRegulation}
                    onClick={acceptRegulation}
                    type="button"
                  >
                    <CheckCircle2 size={18} />
                    {hasAcceptedRegulation ? "Validé" : "Valider"}
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}

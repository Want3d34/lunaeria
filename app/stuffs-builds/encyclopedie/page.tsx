"use client";

import { Eye, Search, ShieldCheck, SlidersHorizontal, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { PageSidebar } from "@/components/page-sidebar";
import { getLinkedDiscordProfile, type LinkedDiscordProfile } from "@/lib/discord-profile";
import { dofusClasses, getClassImage, getElement } from "@/lib/stuffs-data";
import { type BuildItem, useHomepageContent } from "@/lib/lunaeria-content";
import { getSiteUrl } from "@/lib/site-url";
import { supabase } from "@/lib/supabase";
import { ChoiceChips, ElementChips, LunaeriaSelect } from "../_components";

const modes = ["Tous", "PvM", "PvP"];
const budgets = ["Tous", "Petit", "Moyen", "Gros"];

function matchesBudgetFilter(buildBudget: string, selectedBudget: string) {
  if (selectedBudget === "Tous") {
    return true;
  }

  if (selectedBudget === "Petit") {
    return ["Petit", "Bas"].includes(buildBudget);
  }

  if (selectedBudget === "Gros") {
    return ["Gros", "Élevé", "Optimisé"].includes(buildBudget);
  }

  return buildBudget === selectedBudget;
}

export default function StuffEncyclopediePage() {
  const { content, setContent } = useHomepageContent();
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("Tous");
  const [className, setClassName] = useState("Tous");
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [budget, setBudget] = useState("Tous");
  const [linkedDiscordProfile, setLinkedDiscordProfile] =
    useState<LinkedDiscordProfile | null>(null);
  const [isDiscordProfileLoaded, setIsDiscordProfileLoaded] = useState(false);
  const [discordPrompt, setDiscordPrompt] = useState("");
  const [deleteError, setDeleteError] = useState("");

  async function loadBuildsFromSupabase() {
    const { data, error } = await supabase
      .from("builds")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const buildsFromSupabase: BuildItem[] = (data ?? []).map((item) => ({
      id: String(item.id),
      title: item.title,
      gamePseudo: item.game_pseudo || "",
      discordPseudo: item.discord_pseudo || "",
      className: item.class_name,
      classImage: item.class_image || getClassImage(item.class_name),
      elements: item.elements?.length ? item.elements : ["Multi"],
      elementIcons:
        item.element_icons?.length
          ? item.element_icons
          : (item.elements?.length ? item.elements : ["Multi"]).map(
              (entry: string) => getElement(entry)?.icon ?? "✦",
            ),
      orientation: item.orientation || "",
      mode: item.mode || "PvM",
      budget: item.budget || "Moyen",
      level: item.level || "200",
      dofusbookUrl: item.dofusbook_url || "https://www.dofusbook.net",
      description: item.description || "",
      image: item.image || item.class_image || getClassImage(item.class_name),
      createdAt: item.created_at || new Date().toISOString(),
      views: item.views ?? 0,
      creatorDiscordId: item.creator_discord_id || "",
      creatorDisplayName: item.creator_display_name || "",
    }));

    setContent((current) => ({
      ...current,
      builds: buildsFromSupabase,
    }));
  }

  useEffect(() => {
    loadBuildsFromSupabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function loadLinkedDiscordProfile() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        setIsDiscordProfileLoaded(true);
        return;
      }

      setLinkedDiscordProfile(
        await getLinkedDiscordProfile(supabase, data.session?.user ?? null),
      );
      setIsDiscordProfileLoaded(true);
    }

    loadLinkedDiscordProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void getLinkedDiscordProfile(supabase, session?.user ?? null).then(
        (profile) => {
          setLinkedDiscordProfile(profile);
          setIsDiscordProfileLoaded(true);
        },
      );
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleAddBuild() {
    setDiscordPrompt("");

    if (!isDiscordProfileLoaded) {
      return;
    }

    if (linkedDiscordProfile) {
      window.location.href = "/stuffs-builds/ajouter";
      return;
    }

    setDiscordPrompt("Connecte ton compte Discord pour ajouter un stuff.");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${getSiteUrl()}/auth/callback?next=/stuffs-builds/ajouter`,
      },
    });

    if (error) {
      console.error(error);
      setDiscordPrompt("Connexion Discord impossible pour le moment.");
    }
  }

  async function deleteBuild(build: BuildItem) {
    setDeleteError("");

    if (!linkedDiscordProfile?.discordId) {
      setDeleteError("Connecte ton compte Discord pour supprimer ce stuff.");
      return;
    }

    const { error } = await supabase
      .from("builds")
      .delete()
      .eq("id", build.id)
      .eq("creator_discord_id", linkedDiscordProfile.discordId);

    if (error) {
      console.error(error);
      setDeleteError("Suppression impossible.");
      return;
    }

    setContent((current) => ({
      ...current,
      builds: current.builds.filter((item) => item.id !== build.id),
    }));
  }

  const builds = useMemo(
    () =>
      content.builds.filter((build) => {
        const matchesSearch = build.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesMode = mode === "Tous" || build.mode === mode;
        const matchesClass = className === "Tous" || build.className === className;
        const buildElements = Array.isArray(build.elements)
          ? build.elements
          : [build.elements].filter(Boolean);
        const matchesElement =
          selectedElements.length === 0 ||
          selectedElements.every((selectedElement) =>
            buildElements.includes(selectedElement),
          );
        const matchesBudget = matchesBudgetFilter(build.budget, budget);

        return (
          matchesSearch &&
          matchesMode &&
          matchesClass &&
          matchesElement &&
          matchesBudget
        );
      }),
    [budget, className, content.builds, mode, search, selectedElements],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-45" />
      <div className="fog-veil fixed inset-0" />

      <PageSidebar
        items={[
          { label: "Encyclopédie", href: "#builds", icon: ShieldCheck, active: true },
        ]}
        subtitle="Builds"
        title="STUFFS"
      />

      <div className="relative z-10 min-h-screen px-4 py-8 pt-[8.25rem] sm:px-6 sm:pt-[8.5rem] lg:ml-72 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-7xl">
        <header className="premium-card rounded-[2rem] border border-violet-200/10 bg-[#06091b]/76 p-7 shadow-[0_42px_120px_rgba(0,0,0,0.55),0_0_28px_rgba(76,29,149,0.08)] backdrop-blur-md sm:p-10">
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="grid size-16 place-items-center rounded-3xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820]">
                <LunaeriaLogo size={35} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-200">
                  Stuffs & Builds
                </p>
                <h1 className="legend-title mt-3 text-4xl font-black text-violet-50 sm:text-6xl">
                  Encyclopédie
                </h1>
              </div>
            </div>
            <button className="discord-cta inline-flex min-h-12 items-center justify-center rounded-2xl border border-violet-200/18 bg-[linear-gradient(135deg,rgba(139,92,246,0.36),rgba(79,70,229,0.18))] px-5 text-sm font-black text-violet-50 disabled:cursor-wait disabled:opacity-70" disabled={!isDiscordProfileLoaded} onClick={handleAddBuild} type="button">
              Ajouter un Stuff
            </button>
          </div>
          {discordPrompt ? (
            <p className="relative z-10 mt-4 rounded-2xl border border-violet-100/10 bg-violet-100/[0.045] px-4 py-3 text-sm font-bold text-violet-100/80">
              {discordPrompt}
            </p>
          ) : null}
          {deleteError ? (
            <p className="relative z-10 mt-3 rounded-2xl border border-rose-200/12 bg-rose-300/[0.055] px-4 py-3 text-sm font-bold text-rose-100/82">
              {deleteError}
            </p>
          ) : null}
        </header>

        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[280px_1fr]">
          <aside className="premium-card h-fit overflow-visible rounded-[1.5rem] border border-violet-200/10 bg-[#06091b]/72 p-5 backdrop-blur-md" id="filtres">
            <div className="relative z-10 mb-5 flex items-center gap-3">
              <SlidersHorizontal className="text-violet-100" size={19} />
              <h2 className="font-black text-violet-50">Filtres</h2>
            </div>
            <div className="relative z-10 grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">Recherche</span>
                <div className="flex items-center gap-2 rounded-2xl border border-violet-100/10 bg-[#030512]/72 px-3">
                  <Search size={16} className="text-violet-100/70" />
                  <input className="min-h-11 flex-1 bg-transparent text-sm text-violet-50 outline-none" onChange={(event) => setSearch(event.target.value)} value={search} />
                </div>
              </label>
              <ChoiceChips
                label="Mode"
                onChange={setMode}
                options={modes}
                value={mode}
              />
              <LunaeriaSelect
                label="Classe"
                maxMenuHeight="max-h-80"
                onChange={setClassName}
                options={["Tous", ...dofusClasses.map((item) => item.name)]}
                value={className}
              />
              <ElementChips
                includeAll
                onChange={setSelectedElements}
                selected={selectedElements}
              />
              <ChoiceChips
                label="Budget"
                onChange={setBudget}
                options={budgets}
                value={budget}
              />
            </div>
          </aside>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" id="builds">
            {builds.map((build) => (
              <article className="premium-card rounded-[1.35rem] border border-violet-100/9 bg-[#06091b]/72 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-violet-200/18" key={build.id}>
                <div className="relative z-10 flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={build.className} className="h-20 w-16 rounded-2xl border border-violet-100/10 bg-[#030512]/75 object-contain p-1" src={build.image || getClassImage(build.className)} />
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">{build.className}</p>
                    <h2 className="mt-2 line-clamp-2 text-lg font-black text-violet-50">{build.title}</h2>
                  </div>
                </div>
                <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                  {build.elements.map((item) => {
                    const data = getElement(item);
                    return (
                      <span className="rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em]" key={item} style={{ borderColor: `${data?.accent ?? "#c4b5fd"}55`, color: data?.accent ?? "#c4b5fd" }}>
                        {data?.icon} {item}
                      </span>
                    );
                  })}
                  <span className="rounded-full border border-violet-100/10 bg-violet-100/[0.055] px-3 py-1 text-[11px] font-black text-violet-100">{build.mode}</span>
                  <span className="rounded-full border border-[#e8dcbd]/20 bg-[#e8dcbd]/[0.055] px-3 py-1 text-[11px] font-black text-[#e8dcbd]">{build.budget}</span>
                </div>
                <p className="relative z-10 mt-4 text-sm leading-6 text-slate-400">{build.description}</p>
                <div className="relative z-10 mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
                  <span>Niv. {build.level}</span>
                  <span className="inline-flex items-center gap-1"><Eye size={14} /> {build.views}</span>
                </div>
                <a className="relative z-10 mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-100/12 bg-violet-100/[0.045] px-4 py-3 text-sm font-black text-violet-50 transition hover:border-violet-200/24 hover:bg-violet-200/8" href={build.dofusbookUrl} rel="noreferrer" target="_blank">
                  <ShieldCheck size={17} />
                  Voir le build
                </a>
                {linkedDiscordProfile?.discordId &&
                build.creatorDiscordId === linkedDiscordProfile.discordId ? (
                  <button
                    className="relative z-10 mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200/14 bg-rose-300/[0.055] px-4 py-3 text-sm font-black text-rose-100 transition hover:border-rose-200/24 hover:bg-rose-300/[0.09]"
                    onClick={() => deleteBuild(build)}
                    type="button"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                ) : null}
              </article>
            ))}
          </section>
        </div>
        </div>
      </div>
    </main>
  );
}

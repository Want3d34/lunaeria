"use client";

import {
  BookOpen,
  Compass,
  Database,
  ExternalLink,
  Map,
  Sparkles,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { PageSidebar } from "@/components/page-sidebar";
import { type UsefulLink, type UsefulLinkSection } from "@/lib/lunaeria-content";

const sectionLabels: Record<UsefulLinkSection, string> = {
  general: "Outils généraux",
  specific: "Guides & outils spécifiques",
};

const icons = [Database, BookOpen, Compass, Map, Sparkles];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function LiensUtilesPage() {
  const [usefulLinks, setUsefulLinks] = useState<UsefulLink[]>([]);

  useEffect(() => {
    async function loadUsefulLinksFromSupabase() {
      const { data, error } = await supabase
        .from("useful_links")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setUsefulLinks(
        (data ?? []).map((item) => ({
          id: String(item.id),
          title: item.title,
          description: item.description || "",
          url: item.url,
          section: item.section || "general",
        })),
      );
    }

    loadUsefulLinksFromSupabase();
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-45" />
      <div className="fog-veil fixed inset-0" />

      <PageSidebar
        items={[
          { label: "Généraux", href: "#general", icon: Database, active: true },
          { label: "Guides", href: "#specific", icon: BookOpen },
        ]}
        subtitle="Bibliothèque"
        title="LIENS"
      />

      <div className="relative z-10 min-h-screen px-4 py-8 pt-[8.25rem] sm:px-6 sm:pt-[8.5rem] lg:ml-72 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-7xl">
        <header className="premium-card rounded-[2rem] border border-violet-200/10 bg-[#06091b]/76 p-7 shadow-[0_42px_120px_rgba(0,0,0,0.55),0_0_28px_rgba(76,29,149,0.08)] backdrop-blur-md sm:p-10">
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid size-16 place-items-center rounded-3xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820] shadow-[0_0_22px_rgba(124,58,237,0.22)]">
              <LunaeriaLogo size={35} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-200">
                Bibliothèque de guilde
              </p>
              <h1 className="legend-title mt-3 text-4xl font-black text-violet-50 sm:text-6xl">
                Liens utiles
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                Outils, bases de données et guides pratiques pour accélérer la
                progression de Lunaeria.
              </p>
            </div>
          </div>
        </header>

        {(Object.keys(sectionLabels) as UsefulLinkSection[]).map((section) => (
          <section className="mt-8" id={section} key={section}>
            <h2 className="mb-4 text-xl font-black text-violet-50">
              {sectionLabels[section]}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {usefulLinks
                .filter((link) => link.section === section)
                .map((link, index) => {
                  const Icon = icons[index % icons.length];

                  return (
                    <a
                      className="premium-card rounded-[1.45rem] border border-violet-100/9 bg-[#06091b]/72 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-violet-200/18"
                      href={link.url}
                      key={link.id}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <div className="relative z-10 flex items-start justify-between gap-4">
                        <div className="grid size-12 place-items-center rounded-2xl border border-violet-100/14 bg-violet-100/[0.055] text-violet-100">
                          <Icon size={20} />
                        </div>
                        <ExternalLink className="text-violet-100/55" size={17} />
                      </div>
                      <h3 className="relative z-10 mt-5 text-lg font-black text-violet-50">
                        {link.title}
                      </h3>
                      <p className="relative z-10 mt-3 min-h-16 text-sm leading-6 text-slate-400">
                        {link.description}
                      </p>
                
                    </a>
                  );
                })}
            </div>
          </section>
        ))}
        </div>
      </div>
    </main>
  );
}

"use client";

import { CalendarDays } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { PageSidebar } from "@/components/page-sidebar";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type EventItem = {
  id: string;
  title: string;
  date: string;
  description: string;
  createdAt: string;
  published: boolean;
};

export default function EvenementsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    async function loadEventsFromSupabase() {
      const { data, error } = await supabase
        .from("evenements")
        .select("id, title, date, description, created_at, published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setEvents(
        (data ?? []).map((eventItem) => ({
          id: String(eventItem.id),
          title: eventItem.title,
          date: eventItem.date,
          description: eventItem.description || "Détails à compléter.",
          createdAt: eventItem.created_at || "",
          published: Boolean(eventItem.published),
        })),
      );
    }

    loadEventsFromSupabase();
  }, []);

  const sidebarItems = useMemo(
    () => [
      { label: "Tous", href: "#evenements", icon: CalendarDays, active: true },
      ...events.slice(0, 6).map((eventItem) => ({
        label: eventItem.title,
        href: `#event-${eventItem.id}`,
        icon: CalendarDays,
      })),
    ],
    [events],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-45" />
      <div className="fog-veil fixed inset-0" />

      <PageSidebar
        items={sidebarItems}
        subtitle="Calendrier"
        title="EVENTS"
      />

      <div className="relative z-10 min-h-screen px-4 py-8 pt-[8.25rem] sm:px-6 sm:pt-[8.5rem] lg:ml-72 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-6xl">
          <header className="premium-card rounded-[2rem] border border-violet-200/10 bg-[#06091b]/76 p-7 shadow-[0_42px_120px_rgba(0,0,0,0.55),0_0_28px_rgba(76,29,149,0.08)] backdrop-blur-md sm:p-10">
            <div className="relative z-10 flex items-center gap-5">
              <div className="grid size-16 place-items-center rounded-3xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820]">
                <LunaeriaLogo size={35} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-200">
                  Tableau public
                </p>
                <h1 className="legend-title mt-3 text-4xl font-black text-violet-50 sm:text-6xl">
                  Évènements
                </h1>
              </div>
            </div>
          </header>

          <section className="mt-6 grid gap-4 md:grid-cols-2" id="evenements">
            {events.length === 0 ? (
              <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-5 text-sm font-bold text-violet-100/65 md:col-span-2">
                Aucun évènement planifié pour le moment.
              </div>
            ) : null}

            {events.map((eventItem) => (
              <article
                className="premium-card rounded-[1.45rem] border border-violet-100/9 bg-[#06091b]/72 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.35)]"
                id={`event-${eventItem.id}`}
                key={eventItem.id}
              >
                <div className="relative z-10 flex items-start gap-4">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-violet-100/14 bg-violet-100/[0.055] text-violet-100">
                    <CalendarDays size={19} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">
                        {eventItem.date}
                      </span>
                      <span className="rounded-full border border-violet-100/10 bg-[#030512]/70 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-violet-100/75">
                        {eventItem.published ? "Publié" : "Brouillon"}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-black text-violet-50">
                      {eventItem.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {eventItem.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}

"use client";

import { ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type AnnouncementItem = {
  id: string;
  title: string;
  content: string;
  category: string;
};

export default function AnnoncesPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);

  useEffect(() => {
    async function loadAnnouncementsFromSupabase() {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setAnnouncements(
        (data ?? []).map((announcement) => ({
          id: String(announcement.id),
          title: announcement.title,
          content: announcement.content,
          category: announcement.category || "Guilde",
        })),
      );
    }

    loadAnnouncementsFromSupabase();
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-45" />
      <div className="fog-veil fixed inset-0" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link className="inline-flex items-center gap-2 text-sm font-black text-violet-100 transition hover:text-violet-50" href="/">
          <ArrowLeft size={17} />
          Retour au hub
        </Link>
        <header className="premium-card mt-6 rounded-[2rem] border border-violet-200/10 bg-[#06091b]/76 p-7 shadow-[0_42px_120px_rgba(0,0,0,0.55),0_0_28px_rgba(76,29,149,0.08)] backdrop-blur-md sm:p-10">
          <div className="relative z-10 flex items-center gap-5">
            <div className="grid size-16 place-items-center rounded-3xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820]">
              <LunaeriaLogo size={35} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-200">Tableau public</p>
              <h1 className="legend-title mt-3 text-4xl font-black text-violet-50 sm:text-6xl">Annonces</h1>
            </div>
          </div>
        </header>
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {announcements.map((announcement) => (
            <article className="premium-card rounded-[1.45rem] border border-violet-100/9 bg-[#06091b]/72 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.35)]" key={announcement.id}>
              <div className="relative z-10 flex items-start gap-4">
                <div className="grid size-12 place-items-center rounded-2xl border border-violet-100/14 bg-violet-100/[0.055] text-violet-100">
                  <Bell size={19} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">{announcement.category}</span>
                  <h2 className="mt-3 text-xl font-black text-violet-50">{announcement.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{announcement.content}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

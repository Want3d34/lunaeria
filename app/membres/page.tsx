"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { supabase } from "../../lib/supabase";

type MemberDirectoryItem = {
  discord_id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  highest_role: string | null;
};

type PlayerProfile = {
  discord_id: string;
  ingame_name: string | null;
  main_class: string | null;
  level: number | null;
  professions: string[] | null;
};

export default function MembersPage() {
  const [members, setMembers] = useState<MemberDirectoryItem[]>([]);
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);

  useEffect(() => {
    async function loadMembers() {
      const [{ data: discordData }, { data: playerData }] = await Promise.all([
        supabase
          .from("discord_profiles")
          .select("discord_id, display_name, username, avatar_url, highest_role")
          .order("display_name", { ascending: true }),
        supabase
          .from("player_profiles")
          .select("discord_id, ingame_name, main_class, level, professions"),
      ]);

      setMembers(discordData ?? []);
      setProfiles(playerData ?? []);
    }

    loadMembers();
  }, []);

  function getPlayerProfile(discordId: string) {
    return profiles.find((profile) => profile.discord_id === discordId);
  }

  return (
    <main
      className="min-h-screen text-violet-50"
      style={{
        backgroundImage:
          "linear-gradient(rgba(3,5,17,0.65), rgba(3,5,17,0.84)), url('/fond2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8 rounded-3xl border border-violet-300/20 bg-[#0b0718]/75 p-8 shadow-[0_0_60px_rgba(139,92,246,0.18)] backdrop-blur-xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
            Annuaire Lunaeria
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Membres de la guilde
          </h1>
          <p className="mt-3 max-w-2xl text-violet-100/70">
            Retrouvez les profils publics des joueurs Lunaeria.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => {
            const profile = getPlayerProfile(member.discord_id);
            const displayName =
              member.display_name || member.username || "Membre Lunaeria";

            return (
              <NextLink
                key={member.discord_id}
                href={`/membres/${member.discord_id}`}
                className="group rounded-3xl border border-violet-300/20 bg-[#0b0718]/80 p-5 shadow-[0_0_35px_rgba(124,58,237,0.12)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-violet-300/40 hover:shadow-[0_0_45px_rgba(168,85,247,0.22)]"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-violet-300/25 bg-violet-900/40 shadow-[0_0_22px_rgba(168,85,247,0.25)]">
                    {member.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.avatar_url}
                        alt={displayName}
                        className="h-16 w-16 object-cover"
                      />
                    ) : (
                      <span className="text-xl font-black">
                        {displayName.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-black">
                      {displayName}
                    </h2>
                    <p className="mt-1 font-sans text-sm font-semibold text-violet-300">
                      {member.highest_role || "Membre"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl border border-violet-300/15 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">
                      Personnage
                    </p>
                    <p className="mt-1 font-black">
                      {profile?.ingame_name || "Non renseigné"}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-violet-300/15 bg-black/25 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">
                        Classe
                      </p>
                      <p className="mt-1 font-black">
                        {profile?.main_class || "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-violet-300/15 bg-black/25 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">
                        Niveau
                      </p>
                      <p className="mt-1 font-black">
                        {profile?.level || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-violet-300/15 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">
                      Métiers
                    </p>
                    <p className="mt-1 line-clamp-1 font-black">
                      {profile?.professions?.length
                        ? profile.professions.join(", ")
                        : "Non renseignés"}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm font-black text-violet-300 transition group-hover:text-violet-100">
                  Voir le profil →
                </p>
              </NextLink>
            );
          })}
        </section>
      </div>
    </main>
  );
}
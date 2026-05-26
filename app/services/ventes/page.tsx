"use client";

import {
  Coins,
  ImagePlus,
  PackageOpen,
  Plus,
  Send,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { FormEvent, useEffect, useState } from "react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { PageSidebar } from "@/components/page-sidebar";
import { useHomepageContent } from "@/lib/lunaeria-content";

const emptySale = {
  itemName: "",
  category: "",
  price: "",
  quantity: "1",
  message: "",
  imageUrl: "/file.svg",
  sellerGameName: "",
  sellerDiscordName: "",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function fieldClass() {
  return "min-h-12 rounded-2xl border border-violet-100/10 bg-[#030512]/72 px-4 text-sm font-semibold text-violet-50 outline-none shadow-[inset_0_0_14px_rgba(196,181,253,0.025)] transition placeholder:text-slate-600 focus:border-violet-200/28 focus:bg-[#06091b]/86";
}

export default function VentesPage() {
  const { content, setContent } = useHomepageContent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState(emptySale);

  async function loadSalesFromSupabase() {
    const { data, error } = await supabase
      .from("ventes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setContent((current) => ({
      ...current,
      sales: (data ?? []).map((item) => ({
        id: String(item.id),
        itemName: item.item_name,
        category: item.category || "Divers",
        price: item.price,
        quantity: item.quantity || "1",
        message: item.message || "",
        imageUrl: item.image_url || "/file.svg",
        sellerGameName: item.seller_game_name || "Anonyme",
        sellerDiscordName: item.seller_discord_name || "discord inconnu",
      })),
    }));
  }

  useEffect(() => {
    loadSalesFromSupabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function readImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraft((current) => ({ ...current, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  }

  async function submitSale(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.itemName.trim() || !draft.price.trim()) {
      return;
    }

    const payload = {
      item_name: draft.itemName.trim(),
      category: draft.category.trim() || "Divers",
      price: draft.price.trim(),
      quantity: draft.quantity.trim() || "1",
      message: draft.message.trim(),
      image_url: draft.imageUrl || "/file.svg",
      seller_game_name: draft.sellerGameName.trim() || "Anonyme",
      seller_discord_name: draft.sellerDiscordName.trim() || "discord inconnu",
    };

    const { error } = await supabase.from("ventes").insert(payload);

    if (error) {
      console.error(error);
      return;
    }

    setDraft(emptySale);
    setIsModalOpen(false);
    await loadSalesFromSupabase();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-45" />
      <div className="fog-veil fixed inset-0" />

      <PageSidebar
        items={[{ label: "Ventes", href: "#ventes", icon: ShoppingBag, active: true }]}
        subtitle="Services"
        title="MARCHÉ"
      />

      <div className="relative z-10 min-h-screen px-4 py-6 pt-[8.25rem] sm:px-6 sm:pt-[8.5rem] lg:ml-72 lg:px-8 lg:pt-6">
        <div className="mx-auto max-w-7xl">
        <header className="premium-card rounded-[2rem] border border-violet-200/10 bg-[#06091b]/76 p-6 shadow-[0_42px_120px_rgba(0,0,0,0.55),0_0_28px_rgba(76,29,149,0.08)] backdrop-blur-md sm:p-8">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-4">
                <div className="grid size-14 place-items-center rounded-2xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820] shadow-[0_0_18px_rgba(124,58,237,0.2)]">
                  <LunaeriaLogo size={31} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-200">
                    Marché de guilde
                  </p>
                  <h1 className="legend-title mt-2 text-4xl font-black text-violet-50 sm:text-6xl">
                    Ventes Lunaeria
                  </h1>
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Objets, ressources et lots proposés par les membres de la guilde.
              </p>
            </div>
            <button
              className="discord-cta inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200/18 bg-[linear-gradient(135deg,rgba(139,92,246,0.36),rgba(79,70,229,0.18))] px-5 py-3 text-sm font-black text-violet-50 shadow-[0_0_22px_rgba(124,58,237,0.2)] transition hover:-translate-y-0.5"
              onClick={() => setIsModalOpen(true)}
              type="button"
            >
              <Plus size={18} />
              Nouvelle vente
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" id="ventes">
          {content.sales.map((sale) => (
            <article
              className="premium-card rounded-[1.35rem] border border-violet-100/9 bg-[#06091b]/72 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-violet-200/18"
              key={sale.id}
            >
              <div className="relative z-10">
                <div className="grid aspect-square place-items-center overflow-hidden rounded-2xl border border-violet-100/10 bg-[#030512]/75">
                  <Image
                    alt={sale.itemName}
                    className="h-full w-full object-contain p-6 drop-shadow-[0_14px_24px_rgba(0,0,0,0.45)]"
                    height={220}
                    src={sale.imageUrl}
                    width={220}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-violet-100/10 bg-violet-100/[0.055] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-violet-200">
                    {sale.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-[#e8dcbd]">
                    <Coins size={14} />
                    {sale.price} k
                  </span>
                </div>
                <h2 className="mt-3 line-clamp-2 min-h-12 text-base font-black text-violet-50">
                  {sale.itemName}
                </h2>
                <div className="mt-3 grid gap-2 text-xs text-slate-400">
                  <p className="inline-flex items-center gap-2">
                    <PackageOpen size={14} /> Quantité: x{sale.quantity}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <UserRound size={14} /> {sale.sellerGameName} · Discord:{" "}
                    {sale.sellerDiscordName}
                  </p>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
                  {sale.message || "Contactez le vendeur pour plus de détails."}
                </p>
                <a
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-100/12 bg-violet-100/[0.045] px-4 py-3 text-sm font-black text-violet-50 transition hover:border-violet-200/24 hover:bg-violet-200/8"
                  href={`https://discord.com/channels/@me`}
                >
                  <ShoppingBag size={17} />
                  Voir la vente
                </a>
              </div>
            </article>
          ))}
        </section>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#020410]/78 p-4 backdrop-blur-md">
          <form
            className="premium-card max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] border border-violet-200/12 bg-[#06091b]/94 p-5 shadow-[0_42px_120px_rgba(0,0,0,0.72),0_0_30px_rgba(76,29,149,0.14)] sm:p-6"
            onSubmit={submitSale}
          >
            <div className="relative z-10 mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-200">
                  Nouvelle vente
                </p>
                <h2 className="mt-2 text-2xl font-black text-violet-50">
                  Ajouter un objet
                </h2>
              </div>
              <button
                className="grid size-10 place-items-center rounded-xl border border-violet-100/12 bg-violet-100/[0.045] text-violet-100"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative z-10 grid gap-4 md:grid-cols-[220px_1fr]">
              <label className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-violet-100/18 bg-[#030512]/70 p-4 text-center text-sm text-violet-100 transition hover:border-violet-200/32">
                <ImagePlus className="mb-3" size={26} />
                Image de l&apos;objet
                <input
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      readImage(file);
                    }
                  }}
                  type="file"
                />
                <Image
                  alt="Aperçu"
                  className="mt-4 max-h-32 object-contain"
                  height={128}
                  src={draft.imageUrl}
                  width={128}
                />
              </label>

              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className={fieldClass()}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        itemName: event.target.value,
                      }))
                    }
                    placeholder="Nom de l'objet"
                    value={draft.itemName}
                  />
                  <input
                    className={fieldClass()}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                    placeholder="Catégorie"
                    value={draft.category}
                  />
                  <input
                    className={fieldClass()}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        price: event.target.value,
                      }))
                    }
                    placeholder="Prix en kamas"
                    value={draft.price}
                  />
                  <input
                    className={fieldClass()}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        quantity: event.target.value,
                      }))
                    }
                    placeholder="Quantité"
                    value={draft.quantity}
                  />
                  <input
                    className={fieldClass()}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        sellerGameName: event.target.value,
                      }))
                    }
                    placeholder="Pseudo en jeu"
                    value={draft.sellerGameName}
                  />
                  <input
                    className={fieldClass()}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        sellerDiscordName: event.target.value,
                      }))
                    }
                    placeholder="Pseudo Discord"
                    value={draft.sellerDiscordName}
                  />
                </div>
                <textarea
                  className={`${fieldClass()} min-h-28 py-3`}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  placeholder="Message"
                  value={draft.message}
                />
                <button
                  className="discord-cta inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200/18 bg-[linear-gradient(135deg,rgba(139,92,246,0.36),rgba(79,70,229,0.18))] px-5 py-3 text-sm font-black text-violet-50 shadow-[0_0_22px_rgba(124,58,237,0.2)] transition hover:-translate-y-0.5"
                  type="submit"
                >
                  <Send size={17} />
                  Publier la vente
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}

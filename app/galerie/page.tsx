"use client";

import { Images, X } from "lucide-react";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type GalleryItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
};

function galleryPlaceholder(index: number) {
  return index % 2 === 0
    ? "bg-[radial-gradient(circle_at_35%_30%,rgba(167,139,250,0.18),transparent_26%),linear-gradient(135deg,#060b22,#240a42_54%,#030512)]"
    : "bg-[radial-gradient(circle_at_65%_25%,rgba(196,181,253,0.19),transparent_26%),linear-gradient(135deg,#030512,#171638_52%,#2b135f)]";
}

export default function GaleriePage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isGalleryLoaded, setIsGalleryLoaded] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] =
    useState<GalleryItem | null>(null);

  useEffect(() => {
    async function loadGallery() {
      const { data, error } = await supabase
        .from("galerie")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setIsGalleryLoaded(true);
        return;
      }

      setGalleryItems(
        (data ?? []).map((item) => ({
          id: String(item.id),
          title: item.title,
          description: item.description || "",
          category: item.category || "Guilde",
          image: item.image || "",
        })),
      );
      setIsGalleryLoaded(true);
    }

    loadGallery();
  }, []);

  return (
    <main
      className="standalone-premium-page min-h-screen text-violet-50"
      style={{
        backgroundImage:
          "linear-gradient(rgba(3,5,17,0.65), rgba(3,5,17,0.82)), url('/fond2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-10">
        <NextLink
          className="mb-5 inline-flex items-center rounded-xl border border-violet-300/20 bg-[#0b0718]/75 px-4 py-2 text-sm font-black text-violet-100 shadow-[0_0_18px_rgba(124,58,237,0.12)] backdrop-blur-xl transition hover:border-violet-300/40 hover:bg-violet-900/30 hover:text-violet-50"
          href="/"
        >
          ← Retour
        </NextLink>

        <section className="mb-8 rounded-3xl border border-violet-300/20 bg-[#0b0718]/75 p-8 shadow-[0_0_60px_rgba(139,92,246,0.18)] backdrop-blur-xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
            Archives visuelles
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Images className="text-violet-200" size={32} />
            <h1 className="text-5xl font-black tracking-tight">Galerie</h1>
          </div>
          <p className="mt-3 max-w-2xl text-violet-100/70">
            Retrouvez les souvenirs et moments partagés par la guilde Lunaeria.
          </p>
        </section>

        <section className="rounded-3xl border border-violet-300/20 bg-[#0b0718]/80 p-6 shadow-[0_0_45px_rgba(124,58,237,0.16)] backdrop-blur-xl">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {!isGalleryLoaded
              ? [0, 1, 2, 3].map((item) => (
                  <div
                    aria-hidden="true"
                    className="min-h-44 rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] shadow-[0_22px_54px_rgba(0,0,0,0.28)]"
                    key={item}
                  />
                ))
              : null}
            {isGalleryLoaded && galleryItems.length === 0 ? (
              <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-4 text-sm font-bold text-violet-100/65 sm:col-span-2 xl:col-span-4">
                Aucune image publiée pour le moment.
              </div>
            ) : null}
            {isGalleryLoaded
              ? galleryItems.map((item, index) => (
                  <div
                    className="group/gallery relative min-h-44 overflow-hidden rounded-2xl border border-violet-100/8 bg-slate-950 shadow-[0_22px_54px_rgba(0,0,0,0.38)]"
                    key={item.id}
                  >
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={item.title}
                        className="absolute inset-0 size-full object-cover transition duration-700 group-hover/gallery:scale-110"
                        src={item.image}
                      />
                    ) : (
                      <div
                        className={`absolute inset-0 ${galleryPlaceholder(index)} transition duration-700 group-hover/gallery:scale-110`}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/18 to-transparent" />
                    <div className="absolute inset-0 opacity-0 shadow-[inset_0_0_26px_rgba(196,181,253,0.075)] transition duration-500 group-hover/gallery:opacity-100" />
                    <div className="absolute left-4 top-4 rounded-full border border-violet-100/12 bg-[#030512]/70 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-violet-100 backdrop-blur-sm">
                      {item.category}
                    </div>
                    <div className="absolute bottom-0 p-4">
                      <p className="text-sm font-black text-violet-50">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        {item.description}
                      </p>
                    </div>
                    {item.image ? (
                      <button
                        aria-label={`Ouvrir ${item.title}`}
                        className="absolute inset-0 z-30 cursor-zoom-in"
                        onClick={() => setSelectedGalleryItem(item)}
                        type="button"
                      />
                    ) : null}
                  </div>
                ))
              : null}
          </div>
        </section>
      </div>

      {selectedGalleryItem ? (
        <div className="fixed inset-0 z-[100000] grid place-items-center bg-[#020410]/88 p-4 backdrop-blur-md">
          <button
            aria-label="Fermer l'image"
            className="absolute inset-0 cursor-zoom-out"
            onClick={() => setSelectedGalleryItem(null)}
            type="button"
          />
          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-violet-200/14 bg-[#06091b]/92 p-4 shadow-[0_42px_120px_rgba(0,0,0,0.72),0_0_30px_rgba(76,29,149,0.14)]">
            <button
              aria-label="Fermer l'image"
              className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-xl border border-violet-100/12 bg-[#030512]/80 text-violet-100 backdrop-blur-md transition hover:bg-violet-100/[0.08]"
              onClick={() => setSelectedGalleryItem(null)}
              type="button"
            >
              <X size={18} />
            </button>
            <div className="relative grid max-h-[78vh] place-items-center overflow-hidden rounded-2xl border border-violet-100/10 bg-[#030512]/75">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={selectedGalleryItem.title}
                className="max-h-[78vh] w-full object-contain"
                src={selectedGalleryItem.image}
              />
            </div>
            <div className="mt-4">
              <p className="text-sm font-black text-violet-50">
                {selectedGalleryItem.title}
              </p>
              {selectedGalleryItem.description ? (
                <p className="mt-1 text-sm text-slate-300">
                  {selectedGalleryItem.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

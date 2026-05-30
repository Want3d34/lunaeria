export default function ProfilPage() {
  return (
    <main className="min-h-screen bg-[#030511] text-violet-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-5xl font-black tracking-tight">
            Profil Lunaeria
          </h1>
          <p className="mt-2 text-violet-200/70">
            Gérez votre identité au sein de la guilde.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Carte profil Discord */}
          <div className="rounded-3xl border border-violet-400/15 bg-[#0b0718]/90 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-full bg-violet-900/40" />

              <h2 className="mt-4 text-2xl font-black">
                Azelyaa
              </h2>

              <p className="text-violet-300">
                Meneur
              </p>

              <div className="mt-4 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-sm">
                Discord lié
              </div>
            </div>
          </div>

          {/* Informations joueur */}
          <div className="rounded-3xl border border-violet-400/15 bg-[#0b0718]/90 p-6">
            <h2 className="mb-6 text-2xl font-black">
              Informations joueur
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-xl bg-black/30 p-3"
                placeholder="Pseudo en jeu"
              />

              <input
                className="rounded-xl bg-black/30 p-3"
                placeholder="Classe principale"
              />

              <input
                className="rounded-xl bg-black/30 p-3"
                placeholder="Niveau"
              />

              <input
                className="rounded-xl bg-black/30 p-3"
                placeholder="Disponibilités"
              />
            </div>

            <textarea
              className="mt-4 h-40 w-full rounded-xl bg-black/30 p-3"
              placeholder="Présentation..."
            />

            <button
              className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-black"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
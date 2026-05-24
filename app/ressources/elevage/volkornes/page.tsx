import { notFound } from "next/navigation";
import { getBreedingSpecies } from "@/lib/breeding-data";
import { BreedingTreePage } from "../_components";

export default async function VolkornesPage() {
  const species = await getBreedingSpecies("volkornes");

  if (!species) {
    notFound();
  }

  return <BreedingTreePage species={species} />;
}

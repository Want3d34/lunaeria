import { notFound } from "next/navigation";
import { getBreedingSpecies } from "@/lib/breeding-data";
import { BreedingTreePage } from "../_components";

export default async function MuldosPage() {
  const species = await getBreedingSpecies("muldos");

  if (!species) {
    notFound();
  }

  return <BreedingTreePage species={species} />;
}

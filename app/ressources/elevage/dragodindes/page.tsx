import { notFound } from "next/navigation";
import { getBreedingSpecies } from "@/lib/breeding-data";
import { BreedingTreePage } from "../_components";

export default async function DragodindesPage() {
  const species = await getBreedingSpecies("dragodindes");

  if (!species) {
    notFound();
  }

  return <BreedingTreePage species={species} />;
}

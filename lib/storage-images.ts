import type { SupabaseClient } from "@supabase/supabase-js";

type ImageBucket = "ventes" | "builds";

function slugifyFilePart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && /^[a-z0-9]+$/.test(extension)) {
    return extension;
  }

  return file.type.split("/").pop()?.toLowerCase() || "webp";
}

export async function uploadPublicImage(
  supabase: SupabaseClient,
  bucket: ImageBucket,
  file: File,
  label: string,
) {
  const safeLabel = slugifyFilePart(label) || "image";
  const extension = getFileExtension(file);
  const path = `${safeLabel}-${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || "image/webp",
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
}

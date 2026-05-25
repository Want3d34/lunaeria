import type { SupabaseClient, User } from "@supabase/supabase-js";

export type LinkedDiscordProfile = {
  discordId: string;
  displayName: string;
};

type DiscordProfileRow = {
  display_name?: string | null;
  username?: string | null;
};

function validDisplayName(value: string | null | undefined) {
  const displayName = value?.trim();

  if (!displayName) {
    return null;
  }

  const normalized = displayName.toLowerCase();

  if (normalized === "discord" || normalized === "compte discord") {
    return null;
  }

  return displayName;
}

function getMetadataValue(
  source: Record<string, unknown> | undefined,
  keys: string[],
) {
  if (!source) {
    return null;
  }

  for (const key of keys) {
    const value = source[key];

    if (typeof value !== "string") {
      continue;
    }

    const displayName = validDisplayName(value);

    if (displayName) {
      return displayName;
    }
  }

  return null;
}

export function getDiscordIdFromUser(user: User | null) {
  if (!user) {
    return null;
  }

  const discordIdentity = user.identities?.find(
    (identity) => identity.provider === "discord",
  );

  if (!discordIdentity) {
    return null;
  }

  const userMetadata = user.user_metadata as Record<string, unknown> | undefined;
  const identityData = discordIdentity.identity_data as
    | Record<string, unknown>
    | undefined;
  const providerId =
    "provider_id" in discordIdentity
      ? String(discordIdentity.provider_id || "")
      : "";

  return (
    providerId ||
    getMetadataValue(identityData, ["provider_id", "sub", "id"]) ||
    getMetadataValue(userMetadata, ["provider_id", "sub", "discord_id"])
  );
}

export function getOAuthDiscordDisplayName(user: User | null) {
  const metadata = user?.user_metadata as Record<string, unknown> | undefined;

  return getMetadataValue(metadata, [
    "full_name",
    "name",
    "global_name",
    "preferred_username",
    "user_name",
    "username",
  ]);
}

export async function getLinkedDiscordProfile(
  supabase: SupabaseClient,
  user: User | null,
): Promise<LinkedDiscordProfile | null> {
  const discordId = getDiscordIdFromUser(user);

  if (!discordId) {
    return null;
  }

  const { data, error } = await supabase
    .from("discord_profiles")
    .select("display_name, username")
    .eq("discord_id", discordId)
    .maybeSingle<DiscordProfileRow>();

  if (error) {
    console.error(error);
    return null;
  }

  if (!data) {
    const displayName = getOAuthDiscordDisplayName(user) || "Compte lié";
    const { error: insertError } = await supabase.from("discord_profiles").insert({
      discord_id: discordId,
      username: displayName,
    });

    if (insertError) {
      console.error(insertError);
      return null;
    }

    return {
      discordId,
      displayName,
    };
  }

  const displayName =
    validDisplayName(data.display_name) ||
    validDisplayName(data.username) ||
    getOAuthDiscordDisplayName(user) ||
    "Compte lié";

  return {
    discordId,
    displayName,
  };
}

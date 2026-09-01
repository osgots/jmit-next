import type {
  SocialBadgeKind,
} from "@/components/social/social-badge";


export type PublicSocialIdentity = {
  user_id: string;

  badge_kind:
    | SocialBadgeKind
    | null;

  account_title:
    | "Administrator"
    | "Verified Student"
    | "Student"
    | "Visitor";

  is_admin: boolean;

  is_blue_verified: boolean;

  verified_roll_number:
    string | null;

  approved_at:
    string | null;
};


export async function getPublicSocialIdentityMap(
  supabase: any,
  userIds: string[],
) {
  const ids =
    Array.from(
      new Set(
        userIds.filter(
          Boolean,
        ),
      ),
    );


  const map =
    new Map<
      string,
      PublicSocialIdentity
    >();


  if (
    ids.length ===
    0
  ) {
    return map;
  }


  const {
    data,
    error,
  } =
    await supabase.rpc(
      "social_public_identities",
      {
        p_user_ids:
          ids,
      },
    );


  if (error) {
    console.error(
      "Unable to resolve public Social identities:",
      error.message,
    );

    return map;
  }


  for (
    const row
    of data ??
    []
  ) {
    map.set(
      row.user_id,
      row as PublicSocialIdentity,
    );
  }


  return map;
}


export function identityKind(
  identity:
    PublicSocialIdentity
    | undefined,
  accountType?: string | null,
) {
  if (
    identity?.badge_kind
  ) {
    return identity.badge_kind;
  }


  if (
    accountType ===
    "student"
  ) {
    return "student" as const;
  }


  return "visitor" as const;
}

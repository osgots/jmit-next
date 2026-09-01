export async function getAdminDisplayName(
  supabase: any,
  fallback = "Administrator",
) {
  const {
    data,
  } =
    await supabase
      .from(
        "site_settings",
      )
      .select(
        "value",
      )
      .eq(
        "key",
        "admin_display_name",
      )
      .maybeSingle();


  return (
    data?.value?.trim() ||
    fallback
  );
}

export type UserLike = { name?: string | null; email?: string | null } | null | undefined;

export function getDisplayName(user: UserLike): string {
  const name = (user?.name || "").trim();
  if (name) return name;
  const email = (user?.email || "").trim();
  if (email) return email.split("@")[0] || "Usuário";
  return "Usuário";
}

export function getInitials(user: UserLike): string {
  const source = (user?.name || "").trim() || (user?.email || "").trim();
  if (!source) return "U";
  const parts = source
    .replace(/@.*/, "")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0][0] || "";
  const last = parts[parts.length - 1][0] || "";
  return (first + last).toUpperCase() || "U";
}

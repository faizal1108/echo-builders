import { ROLES } from "../data/communityDemo";

export default function RoleBadge({ role }) {
  const meta = ROLES[role] || ROLES.farmer;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-2 py-0.5 text-[11px] font-semibold text-forest-800">
      <span>{meta.emoji}</span> {meta.label}
    </span>
  );
}

import { USERS, ROLES } from "../data/communityDemo";
import RoleBadge from "../components/RoleBadge";
import { getCurrentUser, setCurrentUser } from "../services/communityService";
import { ct } from "../data/communityI18n";
import { useState } from "react";

export default function ProfilePage({ language }) {
  const c = ct(language);
  const [user, setUser] = useState(getCurrentUser());
  const role = ROLES[user.role];
  return (
    <div className="echo-card p-5">
      <h1 className="font-display text-3xl">{c.profile}</h1>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-700 font-bold text-white">{user.avatar}</div>
        <div>
          <p className="text-xl font-semibold">{user.name}</p>
          <RoleBadge role={user.role} />
          <p className="mt-1 text-sm text-forest-600">{user.village}, {user.district}</p>
          <p className="text-xs text-forest-500">Trust: {role?.trust} · Demo login only</p>
        </div>
      </div>
      <p className="mt-6 text-xs font-semibold">{c.continue}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {USERS.filter((u) => ["farmer", "expert", "landowner", "villager", "officer", "moderator"].includes(u.role)).map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => setUser(setCurrentUser(u.id))}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${u.id === user.id ? "bg-forest-700 text-white" : "border border-forest-100"}`}
          >
            {ROLES[u.role].emoji} {u.name}
          </button>
        ))}
      </div>
    </div>
  );
}

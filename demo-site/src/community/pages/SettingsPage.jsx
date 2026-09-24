import { getModeration } from "../services/communityService";
import PrivacyLocationSelector from "../components/PrivacyLocationSelector";
import { useState } from "react";
import { ct } from "../data/communityI18n";

export default function SettingsPage({ language }) {
  const c = ct(language);
  const [vis, setVis] = useState("approximate");
  const rows = getModeration();
  const isMod = true;
  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl">{c.settings}</h1>
      <div className="echo-card p-5">
        <PrivacyLocationSelector value={vis} onChange={setVis} label={c.privacy} />
      </div>
      {isMod && (
        <div className="echo-card p-5">
          <p className="echo-label">Moderator dashboard (demo)</p>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <Stat label="Reported posts" n={rows.filter((r) => r.postId).length} />
            <Stat label="Reported comments" n={rows.filter((r) => r.commentId).length} />
            <Stat label="Pending review" n={rows.filter((r) => r.status === "pending").length} />
            <Stat label="Resolved" n={rows.filter((r) => r.status === "resolved").length} />
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {rows.map((r) => (
              <li key={r.id} className="rounded-xl border border-forest-50 p-3">
                {r.reason} · {r.status} · {r.post?.title || r.postId}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ label, n }) {
  return (
    <div className="rounded-xl bg-forest-50 p-3">
      <p className="text-[10px] uppercase text-forest-500">{label}</p>
      <p className="font-display text-2xl">{n}</p>
    </div>
  );
}

import { NavLink } from "react-router-dom";
import { CATEGORIES, CROP_COMMUNITIES } from "../data/communityDemo";

export default function CommunitySidebar({ lang, c }) {
  const link = "block rounded-xl px-3 py-2 text-sm text-forest-800 hover:bg-forest-50";
  const active = "bg-forest-700 text-white hover:bg-forest-700";
  return (
    <aside className="hidden space-y-4 lg:block">
      <nav className="echo-card p-3">
        {[
          ["/community", c.title],
          ["/community/village", c.village],
          ["/community/map", c.map],
          ["/community/tips", c.tips],
          ["/community/crops", c.crops],
          ["/community/saved", c.saved],
          ["/community/profile", c.profile],
          ["/community/settings", c.settings],
        ].map(([to, label]) => (
          <NavLink key={to} to={to} end={to === "/community"} className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="echo-card p-3">
        <p className="echo-label">Categories</p>
        <div className="mt-2 space-y-1 text-sm">
          {CATEGORIES.map((cat) => (
            <NavLink key={cat.id} to={`/community?cat=${cat.id}`} className="block rounded-lg px-2 py-1 hover:bg-forest-50">
              {cat.emoji} {lang === "ta" ? cat.ta : cat.en}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="echo-card p-3">
        <p className="echo-label">{c.crops}</p>
        <div className="mt-2 space-y-1 text-sm">
          {CROP_COMMUNITIES.map((crop) => (
            <NavLink key={crop} to={`/community/crops/${crop}`} className="block rounded-lg px-2 py-1 hover:bg-forest-50">
              {crop}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}

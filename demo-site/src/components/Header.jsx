import { Leaf, Languages, Settings2 } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Header({ t, language, onLanguage, onOpenSettings, demoMode, onToggleDemo }) {
  const loc = useLocation();
  const links = [
    { to: "/", label: "Crop Journey" },
    { to: "/field", label: "Field Intelligence" },
    { to: "/community/report", label: "Pest Detection" },
    { to: "/field#plan", label: "Crop Planning" },
    { to: "/community", label: "Community" },
    { to: "/community/village", label: "Reports" },
  ];
  return (
    <header className="sticky top-0 z-30 border-b border-forest-100/80 bg-wheat-50/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-700 text-wheat-100 shadow-card">
              <Leaf size={20} />
            </div>
            <div>
              <p className="font-display text-xl font-semibold leading-none text-forest-800">ECHO</p>
              <p className="mt-1 text-[11px] tracking-wide text-forest-600">{t.subtitle}</p>
            </div>
          </Link>
        </div>
        <nav className="order-last flex w-full flex-wrap gap-1 text-xs font-semibold md:order-none md:w-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={() => {
                const path = loc.pathname;
                const on =
                  l.to === "/"
                    ? path === "/"
                    : l.to === "/field#plan"
                      ? path === "/field" && loc.hash === "#plan"
                      : l.to === "/field"
                        ? path === "/field" && loc.hash !== "#plan"
                        : l.to === "/community"
                          ? path === "/community"
                          : path === l.to || path.startsWith(`${l.to}/`);
                return `rounded-full px-3 py-1.5 ${on ? "bg-forest-700 text-white" : "text-forest-800 hover:bg-forest-50"}`;
              }}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <label className="hidden items-center gap-2 rounded-full border border-forest-100 bg-white px-3 py-1.5 text-xs font-medium text-forest-800 sm:flex">
            <input type="checkbox" checked={demoMode} onChange={(e) => onToggleDemo(e.target.checked)} />
            {t.demoMode}
          </label>
          <div className="flex items-center gap-1 rounded-full border border-forest-100 bg-white px-2 py-1.5 text-xs">
            <Languages size={14} className="text-forest-600" />
            <select
              className="bg-transparent font-medium text-forest-800 outline-none"
              value={language}
              onChange={(e) => onLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1 rounded-full bg-forest-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-forest-800"
          >
            <Settings2 size={14} />
            {t.settings}
          </button>
        </div>
      </div>
    </header>
  );
}

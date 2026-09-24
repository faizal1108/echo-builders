import { NavLink, Outlet } from "react-router-dom";
import CommunitySidebar from "./components/CommunitySidebar";
import { Home, Map, PlusCircle, Search, User } from "lucide-react";
import { ct } from "./data/communityI18n";

export default function CommunityLayout({ language }) {
  const c = ct(language);
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:pb-6">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <CommunitySidebar lang={language} c={c} />
        <div>
          <Outlet />
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-forest-100 bg-white/95 px-2 py-2 lg:hidden">
        <NavLink to="/community" end className="flex flex-col items-center text-[10px]"><Home size={18} /> Home</NavLink>
        <NavLink to="/community?focus=search" className="flex flex-col items-center text-[10px]"><Search size={18} /> Search</NavLink>
        <NavLink to="/community/ask" className="flex flex-col items-center text-[10px]"><PlusCircle size={18} /> Ask</NavLink>
        <NavLink to="/community/map" className="flex flex-col items-center text-[10px]"><Map size={18} /> Map</NavLink>
        <NavLink to="/community/profile" className="flex flex-col items-center text-[10px]"><User size={18} /> {c.profile}</NavLink>
      </nav>
    </div>
  );
}

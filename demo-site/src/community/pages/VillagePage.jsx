import { useEffect, useState } from "react";
import VillageCard from "../components/VillageCard";
import CommunityFeed from "../components/CommunityFeed";
import { ct } from "../data/communityI18n";
import { getCurrentUser, getUsers, getVillagePosts } from "../services/communityService";
import { ROLES } from "../data/communityDemo";

export default function VillagePage({ language }) {
  const c = ct(language);
  const me = getCurrentUser();
  const village = me.village;
  const [posts, setPosts] = useState([]);
  const locals = getUsers().filter((u) => u.village === village);

  useEffect(() => {
    getVillagePosts(village).then(setPosts);
  }, [village]);

  const pests = posts.filter((p) => p.category === "pests");
  const weather = posts.filter((p) => p.category === "weather");
  const experts = locals.filter((u) => u.role === "expert" || u.role === "officer");

  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl">{c.village}</h1>
      <VillageCard village={village} posts={posts} />
      <section>
        <p className="echo-label">LOCAL DISCUSSIONS</p>
        <div className="mt-3"><CommunityFeed posts={posts} c={c} /></div>
      </section>
      <section className="echo-card p-4">
        <p className="echo-label">LOCAL PEST REPORTS</p>
        <ul className="mt-2 list-disc pl-5 text-sm">{pests.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
      </section>
      <section className="echo-card p-4">
        <p className="echo-label">LOCAL WEATHER</p>
        <ul className="mt-2 list-disc pl-5 text-sm">{weather.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
        <p className="mt-2 text-xs text-forest-500">Connects to Open-Meteo on the Field Intelligence dashboard. Community posts are observations, not forecasts.</p>
      </section>
      <section className="echo-card p-4">
        <p className="echo-label">LOCAL FARMERS / EXPERTS / ALERTS</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {locals.map((u) => (
            <span key={u.id} className="rounded-full bg-forest-50 px-3 py-1 text-xs">{ROLES[u.role]?.emoji} {u.name}</span>
          ))}
        </div>
        <p className="mt-2 text-xs">Local experts: {experts.map((e) => e.name).join(", ") || "Invite an officer"}</p>
      </section>
    </div>
  );
}

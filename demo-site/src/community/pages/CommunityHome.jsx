import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CommunityHeader from "../components/CommunityHeader";
import CommunitySearch from "../components/CommunitySearch";
import CategoryFilter from "../components/CategoryFilter";
import CommunityFeed from "../components/CommunityFeed";
import NotificationPanel from "../components/NotificationPanel";
import AICommunityAssistant from "../components/AICommunityAssistant";
import ReportModal from "../components/ReportModal";
import { ct } from "../data/communityI18n";
import {
  blockUser,
  getCommunitySignals,
  getCurrentUser,
  getDemoStats,
  getNotifications,
  getPosts,
  hidePost,
  markHelpful,
  reportPost,
  toggleSave,
} from "../services/communityService";
import { getWeatherData } from "../../services/weatherService";

export default function CommunityHome({ language, apiKey }) {
  const c = ct(language);
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [report, setReport] = useState(null);
  const [weather, setWeather] = useState(null);
  const category = params.get("cat") || "";
  const stats = getDemoStats();
  const signals = getCommunitySignals();
  const user = getCurrentUser();

  async function reload() {
    setPosts(await getPosts({ query, category }));
  }

  useEffect(() => {
    reload();
  }, [query, category]);

  useEffect(() => {
    getWeatherData(11.02, 76.96).then(setWeather);
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
      <div>
        <CommunityHeader lang={language} c={c} />
        <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-5">
          {[
            [c.members, stats.members],
            [c.farmers, stats.activeFarmers],
            [c.questions, stats.openQuestions],
            [c.pests, stats.pestReports],
            [c.answers, stats.expertAnswers],
          ].map(([label, n]) => (
            <div key={label} className="echo-card p-3">
              <p className="text-[10px] uppercase text-forest-500">{label}</p>
              <p className="font-display text-2xl">{Number(n).toLocaleString("en-IN")}</p>
              <p className="text-[10px] font-bold text-amber-700">{c.demo}</p>
            </div>
          ))}
        </div>
        {signals[0] && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-bold">🐛 {c.signal}</p>
            <p>Possible pest: {signals[0].pest}</p>
            <p>Crop: {signals[0].crop} · Area: {signals[0].area}</p>
            <p>Reports: {signals[0].reports} · Last 7 days: {signals[0].recent}</p>
            <p className="mt-1 text-xs">{c.signalNote}</p>
          </div>
        )}
        {weather?.data?.current && (
          <div className="mb-4 echo-card p-4 text-sm">
            <p className="echo-label">{c.weatherAlerts}</p>
            <p className="mt-1 font-semibold text-forest-900">
              Coimbatore · {weather.data.current.condition} · {weather.data.current.temperature}°C
            </p>
            <p className="text-xs text-forest-600">{weather.message} · {weather.data.current.timeLabel}</p>
            <Link to="/community?cat=weather" className="mt-2 inline-block text-xs font-semibold text-forest-700">
              Open weather discussions
            </Link>
          </div>
        )}
        <CommunitySearch value={query} onChange={setQuery} placeholder={c.search} />
        <div className="mt-3">
          <CategoryFilter
            value={category}
            lang={language}
            onChange={(id) => {
              const next = new URLSearchParams(params);
              if (id) next.set("cat", id);
              else next.delete("cat");
              setParams(next);
            }}
          />
        </div>
        <div className="mt-5">
          <CommunityFeed
            posts={posts}
            c={c}
            onHelpful={async (id) => {
              await markHelpful(id);
              await reload();
            }}
            onSave={async (id) => {
              await toggleSave(id);
              await reload();
            }}
            onReport={setReport}
            onHide={async (id) => {
              await hidePost(id);
              await reload();
            }}
            onBlock={async (userId) => {
              await blockUser(userId);
              await reload();
            }}
          />
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-xs text-forest-600">Signed in as {user.name} (demo)</p>
        <NotificationPanel items={getNotifications()} />
        <AICommunityAssistant c={c} crop="Chilli" languageName={language === "ta" ? "Tamil" : "English"} apiKey={apiKey} />
      </div>
      <ReportModal open={!!report} onClose={() => setReport(null)} onSubmit={(reason) => report && reportPost({ postId: report.id, reason })} />
    </div>
  );
}

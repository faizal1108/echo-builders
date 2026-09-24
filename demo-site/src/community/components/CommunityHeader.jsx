import { Link } from "react-router-dom";
import { ct } from "../data/communityI18n";

export default function CommunityHeader({ lang, c }) {
  const t = c || ct(lang);
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-500">{t.digitalVillage}</p>
      <h1 className="font-display text-4xl text-forest-900">{t.title}</h1>
      <p className="mt-1 text-forest-700">{t.subtitle}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/community/ask" className="rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-white">{t.ask}</Link>
        <Link to="/community/report" className="rounded-full border border-forest-200 bg-white px-4 py-2 text-sm font-semibold">{t.report}</Link>
        <Link to="/community/ask?type=update" className="rounded-full border border-forest-200 bg-white px-4 py-2 text-sm font-semibold">{t.share}</Link>
        <Link to="/community/tips" className="rounded-full border border-forest-200 bg-white px-4 py-2 text-sm font-semibold">{t.tips}</Link>
      </div>
    </div>
  );
}

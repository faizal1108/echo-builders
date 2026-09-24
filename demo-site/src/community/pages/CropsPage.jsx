import { Link } from "react-router-dom";
import { CROP_COMMUNITIES } from "../data/communityDemo";
import { ct } from "../data/communityI18n";

export default function CropsPage({ language }) {
  const c = ct(language);
  return (
    <div>
      <h1 className="font-display text-3xl">{c.crops}</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {CROP_COMMUNITIES.map((crop) => (
          <Link key={crop} to={`/community/crops/${crop}`} className="echo-card p-5 font-semibold text-forest-900">
            {crop} Community
          </Link>
        ))}
      </div>
    </div>
  );
}

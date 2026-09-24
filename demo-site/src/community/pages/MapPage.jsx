import { useMemo } from "react";
import CommunityMap from "../components/CommunityMap";
import { ct } from "../data/communityI18n";
import { getMapReports } from "../services/communityService";

export default function MapPage({ language }) {
  const c = ct(language);
  const reports = useMemo(() => getMapReports(), []);
  return (
    <div>
      <h1 className="font-display text-3xl">{c.map}</h1>
      <p className="mb-3 text-sm text-forest-600">Markers use approximate / village-level points. Exact private farms are never published.</p>
      <CommunityMap reports={reports} />
    </div>
  );
}

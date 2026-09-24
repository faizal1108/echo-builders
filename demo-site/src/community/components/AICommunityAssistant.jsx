import { useState } from "react";
import { askCommunityAi } from "../services/aiCommunityService";

export default function AICommunityAssistant({ c, crop, languageName, apiKey }) {
  const [q, setQ] = useState("My chilli leaves are curling. What should I check?");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="echo-card p-5">
      <p className="echo-label">{c.aiAsk}</p>
      <p className="mt-1 text-xs text-forest-600">Not a diagnosis. No pesticide dosages.</p>
      <textarea value={q} onChange={(e) => setQ(e.target.value)} rows={3} className="mt-3 w-full rounded-xl border px-3 py-2 text-sm" />
      <button
        type="button"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const out = await askCommunityAi({ question: q, crop, languageName, apiKey });
          setRes(out);
          setLoading(false);
        }}
        className="mt-3 rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-white"
      >
        {loading ? "…" : c.aiAsk}
      </button>
      {res?.data && (
        <div className="mt-4 space-y-2 text-sm text-forest-800">
          <p className="text-xs text-forest-500">{res.status === "live" ? "LIVE AI" : "DEMO / FALLBACK"}</p>
          <p><strong>Possible causes:</strong> {(res.data.possible_causes || []).join(" ")}</p>
          <p><strong>Inspect:</strong> {(res.data.inspect || []).join(" ")}</p>
          <p><strong>Ask:</strong> {(res.data.questions || []).join(" ")}</p>
          <p><strong>Monitor:</strong> {(res.data.monitoring || []).join(" ")}</p>
          <p className="text-xs">{res.data.consult}</p>
        </div>
      )}
    </div>
  );
}

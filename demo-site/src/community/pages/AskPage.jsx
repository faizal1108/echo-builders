import { useLocation, useNavigate } from "react-router-dom";
import PostComposer from "../components/PostComposer";
import { ct } from "../data/communityI18n";
import { createPost } from "../services/communityService";

export default function AskPage({ language }) {
  const c = ct(language);
  const nav = useNavigate();
  const loc = useLocation();
  const prefill = loc.state || {};

  return (
    <div className="echo-card p-5">
      <h1 className="font-display text-3xl">{c.ask}</h1>
      <p className="mt-1 text-sm text-forest-600">Do not post exact farm GPS publicly. Default visibility is approximate area.</p>
      {prefill.aiDetection && (
        <p className="mt-3 rounded-xl bg-wheat-50 p-3 text-sm">
          Possible pest: {prefill.aiDetection.label} · Confidence {Math.round((prefill.aiDetection.confidence || 0) * 100)}%. {c.verify}
        </p>
      )}
      <div className="mt-5">
        <PostComposer
          c={c}
          initial={{ ...prefill, type: new URLSearchParams(loc.search).get("type") === "update" ? "update" : prefill.type || "question" }}
          submitLabel={new URLSearchParams(loc.search).get("type") === "update" ? c.share : c.postQuestion}
          onSubmit={async (data) => {
            const type = new URLSearchParams(loc.search).get("type") === "update" ? "update" : data.type;
            const post = await createPost({ ...data, type });
            nav(`/community/post/${post.id}`);
          }}
        />
      </div>
    </div>
  );
}

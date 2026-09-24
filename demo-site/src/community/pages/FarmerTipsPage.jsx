import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CommunityFeed from "../components/CommunityFeed";
import { ct } from "../data/communityI18n";
import { getPosts, hidePost, blockUser, markHelpful, toggleSave, reportPost } from "../services/communityService";
import ReportModal from "../components/ReportModal";

export default function FarmerTipsPage({ language }) {
  const c = ct(language);
  const [posts, setPosts] = useState([]);
  const [report, setReport] = useState(null);

  useEffect(() => {
    getPosts({ type: "tip" }).then(setPosts);
  }, []);

  return (
    <div className="space-y-4">
      <Link to="/community" className="text-sm text-forest-600">← {c.title}</Link>
      <h1 className="font-display text-3xl">Farmers Helping Farmers</h1>
      <p className="text-sm text-forest-700">{c.experience}</p>
      <CommunityFeed
        posts={posts}
        c={c}
        onHelpful={async (id) => {
          await markHelpful(id);
          setPosts(await getPosts({ type: "tip" }));
        }}
        onSave={async (id) => {
          await toggleSave(id);
          setPosts(await getPosts({ type: "tip" }));
        }}
        onReport={setReport}
        onHide={async (id) => {
          await hidePost(id);
          setPosts(await getPosts({ type: "tip" }));
        }}
        onBlock={async (userId) => {
          await blockUser(userId);
          setPosts(await getPosts({ type: "tip" }));
        }}
      />
      <ReportModal open={!!report} onClose={() => setReport(null)} onSubmit={(reason) => report && reportPost({ postId: report.id, reason })} />
    </div>
  );
}

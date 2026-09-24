import { useEffect, useState } from "react";
import CommunityFeed from "../components/CommunityFeed";
import { ct } from "../data/communityI18n";
import { getPosts } from "../services/communityService";

export default function SavedPage({ language }) {
  const c = ct(language);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    getPosts({ savedOnly: true }).then(setPosts);
  }, []);
  return (
    <div>
      <h1 className="font-display text-3xl">{c.saved}</h1>
      <div className="mt-4">
        <CommunityFeed posts={posts} c={c} />
      </div>
    </div>
  );
}

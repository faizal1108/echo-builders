import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommunityFeed from "../components/CommunityFeed";
import { ct } from "../data/communityI18n";
import { getCropPosts } from "../services/communityService";

export default function CropCommunityPage({ language }) {
  const { crop } = useParams();
  const c = ct(language);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    getCropPosts(crop).then(setPosts);
  }, [crop]);
  return (
    <div>
      <h1 className="font-display text-3xl">{crop} Community</h1>
      <p className="text-sm text-forest-600">Questions, pest reports, weather talk, practices and expert replies.</p>
      <div className="mt-4">
        <CommunityFeed posts={posts} c={c} />
      </div>
    </div>
  );
}

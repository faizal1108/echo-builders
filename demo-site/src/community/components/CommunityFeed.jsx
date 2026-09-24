import PostCard from "./PostCard";

export default function CommunityFeed({ posts, c, onHelpful, onSave, onReport, onHide, onBlock }) {
  if (!posts.length) {
    return <p className="echo-card p-6 text-sm text-forest-700">No posts match this filter.</p>;
  }
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          c={c}
          onHelpful={onHelpful}
          onSave={onSave}
          onReport={onReport}
          onHide={onHide}
          onBlock={onBlock}
        />
      ))}
    </div>
  );
}

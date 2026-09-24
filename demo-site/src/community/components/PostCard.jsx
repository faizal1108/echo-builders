import { useState } from "react";
import { Link } from "react-router-dom";
import { formatIndiaDateTime } from "../../utils/indiaTime";
import RoleBadge from "./RoleBadge";
import CropBadge from "./CropBadge";
import { Bookmark, Flag, MessageCircle, MoreHorizontal, Share2, ThumbsUp } from "lucide-react";

export default function PostCard({ post, c, onHelpful, onSave, onReport, onHide, onBlock, compact }) {
  const author = post.author || {};
  const [menu, setMenu] = useState(false);

  return (
    <article className="echo-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-700 text-xs font-bold text-white">{author.avatar}</div>
          <div>
            <p className="font-semibold text-forest-900">{author.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <RoleBadge role={author.role} />
              <span className="text-xs text-forest-600">
                {author.village} · {formatIndiaDateTime(post.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="relative flex items-center gap-2">
          <CropBadge crop={post.crop} />
          <button type="button" className="rounded-full p-1 text-forest-500" onClick={() => setMenu((v) => !v)} aria-label="Post menu">
            <MoreHorizontal size={18} />
          </button>
          {menu && (
            <div className="absolute right-0 top-8 z-10 w-40 rounded-xl border border-forest-100 bg-white p-1 text-xs shadow-lg">
              <button type="button" className="block w-full rounded-lg px-3 py-2 text-left hover:bg-forest-50" onClick={() => { onReport?.(post); setMenu(false); }}>
                Report
              </button>
              <button type="button" className="block w-full rounded-lg px-3 py-2 text-left hover:bg-forest-50" onClick={() => { onHide?.(post.id); setMenu(false); }}>
                Hide
              </button>
              <button type="button" className="block w-full rounded-lg px-3 py-2 text-left hover:bg-forest-50" onClick={() => { onBlock?.(post.authorId); setMenu(false); }}>
                Block user
              </button>
            </div>
          )}
        </div>
      </div>
      <Link to={`/community/post/${post.id}`} className="mt-3 block">
        <h3 className="font-display text-lg text-forest-900">{post.title}</h3>
        {!compact && <p className="mt-2 text-sm leading-relaxed text-forest-800">{post.content}</p>}
      </Link>
      {post.type === "tip" && <p className="mt-2 text-xs font-semibold text-amber-800">{c.experience}</p>}
      {post.aiDetection && (
        <p className="mt-2 rounded-xl bg-wheat-50 px-3 py-2 text-xs text-forest-700">
          {c.possible}: {post.aiDetection.label} ({Math.round(post.aiDetection.confidence * 100)}%). {c.verify}
        </p>
      )}
      {post.images?.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {post.images.map((src) => (
            <img key={src} src={src} alt="" className="h-28 rounded-xl object-cover" />
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-forest-500">📍 {post.location?.village} · {post.visibility || "approximate"} · {post.location?.note || "Approximate area"}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {(post.tags || []).map((tag) => (
          <span key={tag} className="text-xs text-forest-600">#{tag}</span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-forest-700">
        <button type="button" onClick={() => onHelpful?.(post.id)} className="inline-flex items-center gap-1">
          <ThumbsUp size={14} /> {post.helpfulCount} {c.helpful}
        </button>
        <Link to={`/community/post/${post.id}`} className="inline-flex items-center gap-1">
          <MessageCircle size={14} /> {post.commentCount} {c.comments}
        </Link>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(window.location.origin + `/community/post/${post.id}`);
          }}
          className="inline-flex items-center gap-1"
        >
          <Share2 size={14} /> {c.shareAction}
        </button>
        <button type="button" onClick={() => onSave?.(post.id)} className="inline-flex items-center gap-1">
          <Bookmark size={14} /> {c.save}
        </button>
        <button type="button" onClick={() => onReport?.(post)} className="inline-flex items-center gap-1">
          <Flag size={14} /> {c.reportAction}
        </button>
      </div>
    </article>
  );
}

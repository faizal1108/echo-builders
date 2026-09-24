import { useState } from "react";
import RoleBadge from "./RoleBadge";
import ExpertBadge from "./ExpertBadge";
import { formatIndiaDateTime } from "../../utils/indiaTime";
import { Flag, MoreHorizontal, ThumbsUp } from "lucide-react";

export default function CommentList({ comments, onHelpful, onReport, onReply }) {
  const [menuId, setMenuId] = useState(null);
  const roots = comments.filter((item) => !item.parentId);
  const childrenOf = (id) => comments.filter((item) => item.parentId === id);

  function renderItem(item, nested) {
    const highlight = item.isExpertAnswer || item.author?.role === "expert" || item.author?.role === "officer";
    return (
      <div key={item.id} className={nested ? "ml-6 mt-3" : ""}>
        <div className={`rounded-2xl border p-4 ${highlight ? "border-forest-300 bg-forest-50/70" : "border-forest-100 bg-white"}`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-forest-900">{item.author?.name}</p>
              <RoleBadge role={item.author?.role} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-forest-500">{formatIndiaDateTime(item.createdAt)}</span>
              <button type="button" onClick={() => setMenuId(menuId === item.id ? null : item.id)} aria-label="Comment menu">
                <MoreHorizontal size={16} className="text-forest-500" />
              </button>
            </div>
          </div>
          {menuId === item.id && (
            <div className="mt-2 rounded-xl border border-forest-100 bg-white p-1 text-xs">
              <button type="button" className="block w-full rounded-lg px-3 py-2 text-left hover:bg-forest-50" onClick={() => onReport?.(item)}>
                Report
              </button>
            </div>
          )}
          <div className="mt-2">
            <ExpertBadge role={item.author?.role} title={item.author?.title} />
          </div>
          {item.isExpertAnswer && (
            <p className="mt-2 text-[11px] text-forest-600">Expert views are guidance, not a confirmed diagnosis.</p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-forest-800">{item.content}</p>
          {item.image ? <img src={item.image} alt="" className="mt-2 max-h-40 rounded-xl" /> : null}
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-forest-700">
            <button type="button" className="inline-flex items-center gap-1" onClick={() => onHelpful?.(item.id)}>
              <ThumbsUp size={12} /> {item.helpfulCount} helpful
            </button>
            <button type="button" onClick={() => onReply?.(item)}>Reply</button>
            <button type="button" className="inline-flex items-center gap-1" onClick={() => onReport?.(item)}>
              <Flag size={12} /> Report
            </button>
          </div>
        </div>
        {childrenOf(item.id).map((child) => renderItem(child, true))}
      </div>
    );
  }

  return <div className="space-y-4">{roots.map((item) => renderItem(item, false))}</div>;
}

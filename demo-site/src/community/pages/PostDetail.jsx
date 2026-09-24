import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import CommentList from "../components/CommentList";
import CommentBox from "../components/CommentBox";
import DiseaseReportCard from "../components/DiseaseReportCard";
import ReportModal from "../components/ReportModal";
import { ct } from "../data/communityI18n";
import {
  addComment,
  blockUser,
  getComments,
  getPost,
  getRelatedPosts,
  hidePost,
  looksUnsafeAdvice,
  markCommentHelpful,
  markHelpful,
  reportComment,
  reportPost,
  toggleSave,
} from "../services/communityService";

export default function PostDetail({ language }) {
  const { id } = useParams();
  const c = ct(language);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [related, setRelated] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);

  async function reload() {
    setPost(await getPost(id));
    setComments(await getComments(id));
  }

  useEffect(() => {
    reload();
  }, [id]);

  useEffect(() => {
    if (post) getRelatedPosts(post).then(setRelated);
  }, [post]);

  if (!post) return <p className="p-6">Post not found.</p>;

  return (
    <div className="space-y-5">
      <Link to="/community" className="text-sm text-forest-600">← {c.title}</Link>
      <PostCard
        post={post}
        c={c}
        onHelpful={() => markHelpful(post.id).then(reload)}
        onSave={() => toggleSave(post.id).then(reload)}
        onReport={(p) => setReportTarget({ kind: "post", post: p })}
        onHide={async (postId) => {
          await hidePost(postId);
          reload();
        }}
        onBlock={async (userId) => {
          await blockUser(userId);
          reload();
        }}
      />
      <DiseaseReportCard detection={post.aiDetection} />
      {looksUnsafeAdvice(post.content) && <p className="rounded-xl bg-amber-50 p-3 text-sm">{c.unsafe}</p>}
      <section className="echo-card p-5">
        <p className="echo-label">{c.comments} / Expert answers</p>
        <div className="mt-4">
          <CommentList
            comments={comments}
            onHelpful={async (commentId) => {
              await markCommentHelpful(commentId);
              setComments(await getComments(id));
            }}
            onReply={setReplyTo}
            onReport={(comment) => setReportTarget({ kind: "comment", comment })}
          />
        </div>
        <CommentBox
          c={c}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
          onSubmit={async (payload) => {
            await addComment({ postId: post.id, ...payload });
            await reload();
          }}
        />
      </section>
      <section>
        <p className="echo-label">Related posts</p>
        <div className="mt-3 space-y-3">
          {related.map((p) => (
            <PostCard key={p.id} post={p} c={c} compact />
          ))}
        </div>
      </section>
      <ReportModal
        open={!!reportTarget}
        onClose={() => setReportTarget(null)}
        onSubmit={(reason) => {
          if (reportTarget?.kind === "comment") reportComment({ commentId: reportTarget.comment.id, reason });
          else if (reportTarget?.post) reportPost({ postId: reportTarget.post.id, reason });
        }}
      />
    </div>
  );
}

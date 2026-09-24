import { useState } from "react";

export default function CommentBox({ onSubmit, c, replyTo, onCancelReply }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  return (
    <form
      className="mt-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit({ content: text.trim(), image, parentId: replyTo?.id || null });
        setText("");
        setImage(null);
        onCancelReply?.();
      }}
    >
      {replyTo && (
        <p className="mb-2 text-xs text-forest-600">
          Replying to {replyTo.author?.name}{" "}
          <button type="button" className="underline" onClick={onCancelReply}>Cancel</button>
        </p>
      )}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Write a reply. Do not post pesticide dosages or personal IDs."
        className="w-full rounded-2xl border border-forest-100 px-3 py-2 text-sm"
      />
      <div className="mt-2 flex items-center justify-between">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.readAsDataURL(file);
          }}
        />
        <button type="submit" className="rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-white">
          {c.comments}
        </button>
      </div>
    </form>
  );
}

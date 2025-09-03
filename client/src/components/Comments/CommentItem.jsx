import { useState } from "react";
import { useAuth } from "../../store/authStore";
import { usePosts } from "../../store/postStore";
import { useComments } from "../../store/commentStore";
import { toast } from "react-toastify";

import { Heart, Trash2, Pencil, MoreVertical, X, Check } from "lucide-react";

const CommentItem = ({ comment }) => {
  const { user, isAuthenticated } = useAuth();
  const { post } = usePosts();
  const { likeComment, deleteComment, updateComment } = useComments();

  const isCommentOwner = user && comment.author?._id === user._id;
  const isPostOwner =
    user && post && (post.author._id === user._id || post.author === user._id);
  const canEdit = isCommentOwner;
  const canDelete = isCommentOwner || isPostOwner;
  const canLike = isAuthenticated;
  const hasLiked =
    user &&
    Array.isArray(comment.likes) &&
    comment.likes.some((l) => (l.user || l) === user._id);

  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const [askDelete, setAskDelete] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateComment(comment._id, { content: editContent });
    setEditing(false);
    toast.success("Comment updated");
  };

  const handleDelete = async () => {
    await deleteComment(comment._id);
    setAskDelete(false);
    toast.success("Comment deleted");
  };

  // Allow Esc to exit editing
  const handleEditKey = (e) => {
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <div className="bg-slate-800/80 rounded-xl mb-3 px-4 py-3 shadow text-white hover:bg-gray-900/80 transition-all duration-150 relative overflow-visible select-text">
      {/* Actions Menu Top Right */}
      {(canEdit || canDelete) && !editing && (
        <div className="absolute top-4 right-4 z-10">
          <button
            className="p-1 rounded-full hover:bg-neutral-700 transition text-neutral-400"
            onClick={() => setShowMenu((s) => !s)}
            aria-label="More"
          >
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 bg-neutral-900 rounded shadow border border-neutral-700 animate-fade-in overflow-hidden">
              {canEdit && (
                <button
                  onClick={() => {
                    setEditing(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-cyan-700/30 text-teal-300"
                >
                  <Pencil size={18} /> Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => {
                    setAskDelete(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 border-t border-neutral-800 hover:bg-pink-700/20 text-pink-400"
                >
                  <Trash2 size={18} /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirm delete modal (simple, no portal) */}
      {askDelete && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
          <div className="bg-neutral-800 rounded-xl px-8 py-6 shadow-lg border border-pink-500 flex flex-col gap-3 items-center animate-fade-in">
            <div className="text-pink-400 font-bold text-lg flex gap-2 items-center">
              <Trash2 /> Delete Comment?
            </div>
            <div className="text-neutral-300 text-sm mb-1">
              This cannot be undone.
            </div>
            <div className="flex gap-3 mt-2">
              <button
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded text-white font-bold flex items-center gap-2"
                onClick={handleDelete}
              >
                <Check size={18} /> Yes, Delete
              </button>
              <button
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white font-semibold flex items-center gap-2"
                onClick={() => setAskDelete(false)}
              >
                <X size={18} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER INFO */}
      <div className="flex items-center gap-3 mb-1">
        <span className="font-bold text-cyan-300 text-sm font-mono">
          {comment.author?.username}
        </span>
        <span className="text-xs text-cyan-400/60">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
        {comment.isEdited && (
          <span className="text-xs text-yellow-400 ml-2">(edited)</span>
        )}
      </div>

      {/* Content or Edit Area */}
      {editing ? (
        <form onSubmit={handleUpdate} className="mb-2 w-full animate-fade-in">
          <textarea
            className="w-full rounded-lg bg-neutral-900 text-white px-3 py-2 border-2 border-teal-400 outline-none mb-1 shadow-lg focus:ring-2 focus:ring-teal-400 transition"
            value={editContent}
            autoFocus
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleEditKey}
            rows={2}
            required
            maxLength={300}
          />
          <div className="flex gap-2 mt-1">
            <button
              type="submit"
              className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white rounded px-3 py-1 font-semibold shadow disabled:opacity-50"
              disabled={editContent.trim().length === 0}
            >
              <Check size={16} /> Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex items-center gap-1 bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1 font-semibold rounded"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="text-[1rem] leading-snug text-gray-200 break-words py-1">
          {comment.content}
        </div>
      )}

      {/* Like button - always at bottom left */}
      <div className="mt-2">
        <button
          className={`flex items-center gap-1 rounded-full px-3 py-1 transition shadow
            ${
              hasLiked
                ? "bg-pink-600 text-white"
                : "bg-neutral-800 text-pink-400 hover:bg-pink-500 hover:text-white"
            }
          `}
          disabled={!canLike}
          onClick={() => likeComment(comment._id)}
          title={hasLiked ? "Unlike" : "Like"}
        >
          <Heart size={18} className={hasLiked ? "fill-white" : ""} />
          <span>{comment.likes?.length || 0}</span>
        </button>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadein 0.19s linear;
        }
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CommentItem;

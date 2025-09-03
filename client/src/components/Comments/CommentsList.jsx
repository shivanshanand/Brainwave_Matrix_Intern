import { useEffect, useState } from "react";
import { useComments } from "../../store/commentStore";
import CommentItem from "./CommentItem";

const COMMENTS_PAGE_SIZE = 30;

const CommentsList = ({ postId }) => {
  const { comments, fetchComments, loading, error, hasMore } = useComments();
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PAGE_SIZE);

  useEffect(() => {
    fetchComments(postId);
    setVisibleCount(COMMENTS_PAGE_SIZE);
  }, [fetchComments, postId]);

  const handleShowMore = () => setVisibleCount((c) => c + COMMENTS_PAGE_SIZE);


  if (loading)
    return (
      <div className="text-cyan-400 animate-pulse py-4">
        Loading comments...
      </div>
    );
  if (error) return <div className="text-pink-500 py-3 font-bold">{error}</div>;

  return (
    <div>
      {comments.length === 0 ? (
        <div className="text-gray-400 py-3 italic">No comments yet.</div>
      ) : (
        <>
          {comments.slice(0, visibleCount).map((c) => (
            <CommentItem key={c._id} comment={c} />
          ))}
          {visibleCount < comments.length && (
            <button
              onClick={handleShowMore}
              className="block mx-auto mt-2 px-8 py-2 rounded-lg text-cyan-300 bg-slate-800 hover:bg-slate-700 font-semibold shadow hover:scale-105 transition"
            >
              Show More Comments ({comments.length - visibleCount} more)
            </button>
          )}
          {visibleCount >= comments.length && comments.length > 150 && (
            <div className="text-gray-500 text-xs text-center mt-2">
              Can't load older comments in UI – use filters to find what you
              need.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentsList;

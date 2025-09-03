import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePosts } from "../../store/postStore";
import PostEditor from "../../pages/PostEditor";

const EditPost = () => {
  const { id } = useParams();
  const { post, fetchPost, loading, error } = usePosts();

  useEffect(() => {
    if (id) fetchPost(id);
  }, [id, fetchPost]);

  if (loading || !post)
    return <div className="p-6 text-cyan-400">Loading post...</div>;
  if (error) return <div className="p-6 text-pink-400">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <PostEditor initialData={post} isEditMode />
    </div>
  );
};

export default EditPost;

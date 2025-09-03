import { useForm } from "react-hook-form";
import { useComments } from "../../store/commentStore";

const CommentForm = ({ postId }) => {
  const { addComment, loading } = useComments();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await addComment({
        content: data.content,
        postId,
      });
      reset();
    } catch (err) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
      <textarea
        {...register("content", { required: true })}
        className="w-full rounded-lg bg-slate-900 text-white px-4 py-3 mb-2 border border-cyan-800/30 focus:border-cyan-400/80 outline-none font-mono transition placeholder:text-cyan-400/40"
        placeholder="Add a comment..."
        rows={3}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-600 px-7 py-2 rounded-full text-sm shadow font-semibold tracking-wide text-white transition-all duration-150 active:scale-95
          disabled:bg-gray-500 disabled:opacity-40"
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
};

export default CommentForm;

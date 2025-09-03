import { useNavigate } from "react-router-dom";

function getSummary(excerpt, content, maxLen = 110) {
  if (excerpt)
    return excerpt.length > maxLen ? excerpt.slice(0, maxLen) + "..." : excerpt;
  if (!content) return "";
  const text =
    typeof content === "string" ? content.replace(/<[^>]+>/g, "") : "";
  return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
}

function getAuthorName(author) {
  if (!author) return "Anonymous";
  if (author.username) return author.username;
  if (author.firstName) return `${author.firstName} ${author.lastName || ""}`;
  return typeof author === "string" ? author : "Anonymous";
}

const BlogCard = ({
  title,
  excerpt,
  content,
  author,
  readTime,
  coverImage,
  slug,
  publishedAt,
  createdAt,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative bg-gradient-to-tr from-neutral-900 to-black border border-neutral-800 rounded-2xl p-6 flex flex-col min-h-[320px] transition-transform duration-200 group hover:scale-[1.024] hover:border-teal-400 cursor-pointer"
      onClick={() => slug && navigate(`/posts/${slug}`)}
    >
      {/* Image */}
      {coverImage ? (
        <img
          src={coverImage}
          alt={title}
          className="w-full h-36 object-cover rounded-xl mb-4"
        />
      ) : (
        <div className="w-full h-36 rounded-xl bg-neutral-800 mb-4 flex items-center justify-center text-neutral-600">
          No Image
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>

      {/* Excerpt/Summary */}
      <p className="text-neutral-300 flex-1">{getSummary(excerpt, content)}</p>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 text-sm text-neutral-400">
        <span className="flex items-center gap-2">
          {author?.avatar ? (
            <img
              src={author.avatar}
              alt={getAuthorName(author)}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : null}
          {getAuthorName(author)}
        </span>
        <span>
          {readTime ? `${readTime} min read` : ""}
          {publishedAt
            ? ` • ${new Date(publishedAt).toLocaleDateString()}`
            : createdAt
            ? ` • ${new Date(createdAt).toLocaleDateString()}`
            : ""}
        </span>
      </div>
    </div>
  );
};

export default BlogCard;

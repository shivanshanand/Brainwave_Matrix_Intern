import { useEffect } from "react";
import BlogCard from "./BlogCard";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../store/postStore";

const FeaturedContentSection = () => {
  const navigate = useNavigate();
  const { posts, loading, error, fetchFeaturedPosts } = usePosts();
  const safePosts = Array.isArray(posts) ? posts : [];

  useEffect(() => {
    fetchFeaturedPosts({ featured: true });
  }, [fetchFeaturedPosts]);

  return (
    <section className="w-full bg-black py-16 px-3">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center">
        Featured Content
      </h2>
      <p className="mt-2 text-lg text-neutral-300 text-center mb-10">
        Discover the most engaging stories from our community
      </p>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
          {safePosts.length === 0 ? (
            <div className="col-span-full text-neutral-400 text-center p-8">
              No featured posts found.
            </div>
          ) : (
            safePosts
              .slice(0, 3)
              .map((post, idx) => (
                <BlogCard
                  key={post._id || idx}
                  {...post}
                  highlighted={idx === 1}
                />
              ))
          )}
        </div>
      )}
      <div className="flex justify-center mt-9">
        <button
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-2 px-6 py-3 bg-teal-400 text-black font-semibold rounded-lg shadow-lg hover:bg-teal-300 focus:outline-none transition-all text-lg"
        >
          View All Blogs <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default FeaturedContentSection;

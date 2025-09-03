import { useEffect } from "react";
import { usePosts } from "../store/postStore";
import PostCard from "../components/Posts/PostCard";
import Navbar from "../components/Common/Navbar";
import SimpleFooter from "../components/Common/SimpleFooter";

const TrendingPosts = () => {
  const { posts, loading, error, fetchTrendingPosts } = usePosts();

  useEffect(() => {
    fetchTrendingPosts();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Navbar />
      <div className="mt-20 min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2 animate-fadeDown">
              Trending Posts
            </h1>
            <p className="text-lg text-neutral-400 animate-fadeDownSmall">
              The most read, shared, and discussed stories this week
            </p>
          </header>

          {error && (
            <div className="text-red-400 text-center mb-8">{error}</div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin h-12 w-12 border-4 border-teal-400 border-t-transparent rounded-full"></div>
            </div>
          )}

          {!loading && !error && (
            <>
              {Array.isArray(posts) && posts.length === 0 ? (
                <div className="text-center text-neutral-500 py-20">
                  <span className="text-3xl mb-4 block">😶‍🌫️</span>
                  <p className="text-xl font-semibold">
                    No trending posts… yet!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeInGrid">
                  {(Array.isArray(posts) ? posts : []).map((post, idx) => (
                    <div
                      key={post._id}
                      className="animate-fadeInUp opacity-0"
                      style={{
                        animationDelay: `${idx * 100}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <PostCard post={post} viewMode="grid" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <style>
          {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp { animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) forwards; }

          @keyframes fadeDown {
            from { opacity: 0; transform: translateY(-16px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fadeDown { animation: fadeDown 0.8s cubic-bezier(.4,0,.2,1) 0.1s forwards; opacity: 0; }
          .animate-fadeDownSmall { animation: fadeDown 0.7s cubic-bezier(.4,0,.2,1) 0.2s forwards; opacity: 0; }

          @keyframes fadeInGrid {
            from {opacity: 0;}
            to { opacity: 1;}
          }
          .animate-fadeInGrid { animation: fadeInGrid 0.6s 0.2s both; }
        `}
        </style>
      </div>
      <SimpleFooter />
    </>
  );
};

export default TrendingPosts;

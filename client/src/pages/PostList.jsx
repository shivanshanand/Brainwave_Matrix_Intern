import { useEffect, useState } from "react";
import { usePosts } from "../store/postStore";
import { useCategories } from "../store/categoryStore";
import PostCard from "../components/Posts/PostCard";
import {
  HiSearch,
  HiViewGrid,
  HiViewList,
  HiChevronLeft,
  HiChevronRight,
  HiDotsHorizontal,
  HiEye,
  HiHeart,
  HiUserGroup,
} from "react-icons/hi";
// import { Dialog } from "@headlessui/react"; // Removed unused import
import Navbar from "../components/Common/Navbar";
import WhoToFollow from "../components/Common/WhoToFollow ";
import WhoToFollowDrawer from "../components/Common/WhoToFollowDrawer";
import SimpleFooter from "../components/Common/SimpleFooter";

const PostList = () => {
  const {
    posts,
    loading,
    error,
    pagination,
    selectedCategories,
    currentFilters,
    fetchPosts,
    toggleCategoryFilter,
    updateFilters,
    clearFilters,
  } = usePosts();
  const [showWhoToFollow, setShowWhoToFollow] = useState(false);

  const {
    parentCategories,
    fetchParentCategories,
    loading: categoriesLoading,
  } = useCategories();

  const safePosts = Array.isArray(posts) ? posts : [];
  const safeParentCategories = Array.isArray(parentCategories)
    ? parentCategories
    : [];
  const safeSelectedCategories = Array.isArray(selectedCategories)
    ? selectedCategories
    : [];

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchParentCategories();
        await fetchPosts({
          page: 1,
          limit: 9,
          sortBy: "createdAt",
          order: "desc",
        });
      } catch (err) {
        console.error("Failed to initialize data:", err);
      }
    };

    initializeData();
  }, [fetchPosts, fetchParentCategories]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== (currentFilters.search || "")) {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle category toggle (add/remove from selection)
  const handleCategoryToggle = async (categorySlug) => {
    try {
      await toggleCategoryFilter(categorySlug);
    } catch (err) {
      console.error("Failed to toggle category filter:", err);
    }
  };

  const handleClearCategories = async () => {
    try {
      await clearFilters();
      setSearchTerm("");
    } catch (err) {
      console.error("Failed to clear filters:", err);
    }
  };

  // Handle search with proper debouncing
  const handleSearch = async (search) => {
    if (isSearching) return;

    setIsSearching(true);
    try {
      await updateFilters({
        search: search.trim(),
        page: 1,
      });
    } catch (err) {
      console.error("Failed to search:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle sort change with proper mapping
  const handleSortChange = async (sortBy) => {
    try {
      let sortConfig = { sortBy, page: 1 };

      // Ensure proper sorting configuration
      switch (sortBy) {
        case "likes":
          sortConfig.order = "desc"; // Most liked first
          break;
        case "views":
          sortConfig.order = "desc"; // Most viewed first
          break;
        case "createdAt":
          sortConfig.order = "desc"; // Newest first
          break;
        case "title":
          sortConfig.order = "asc"; // Alphabetical A-Z
          break;
        case "updatedAt":
          sortConfig.order = "desc"; // Recently updated first
          break;
        default:
          sortConfig.order = "desc";
      }

      await updateFilters(sortConfig);
    } catch (err) {
      console.error("Failed to change sort:", err);
    }
  };

  // Handle pagination
  const handlePageChange = async (page) => {
    try {
      await updateFilters({ page });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Failed to change page:", err);
    }
  };

  // Handle posts per page change
  const handlePostsPerPageChange = async (limit) => {
    try {
      await updateFilters({
        limit: Number(limit),
        page: 1,
      });
    } catch (err) {
      console.error("Failed to change posts per page:", err);
    }
  };

  // Pagination helper functions
  const getPageNumbers = () => {
    if (!pagination) return [];

    const { page, pages } = pagination;
    const pageNumbers = [];

    if (pages <= 5) {
      for (let i = 1; i <= pages; i++) pageNumbers.push(i);
    } else if (page <= 3) {
      pageNumbers.push(1, 2, 3, 4, "...", pages);
    } else if (page >= pages - 2) {
      pageNumbers.push(1, "...", pages - 3, pages - 2, pages - 1, pages);
    } else {
      pageNumbers.push(1, "...", page - 1, page, page + 1, "...", pages);
    }

    return pageNumbers;
  };

  // Enhanced Pagination Component
  const Pagination = () => {
    if (!pagination || pagination.pages <= 1) return null;

    const { page, pages, total, hasNext, hasPrev } = pagination;
    const limit = currentFilters.limit || 9;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);

    return (
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-14 py-6 px-4 bg-neutral-900/95 backdrop-blur rounded-2xl border border-neutral-800 shadow-2xl transition-all">
        {/* Left: results */}
        <div className="text-sm text-neutral-400">
          Showing {startIndex + 1}-{endIndex} of {total} results
        </div>

        {/* Middle: pagination */}
        <div className="flex items-center gap-6">
          {/* Prev button */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={!hasPrev || loading}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-400 font-medium hover:bg-neutral-700 hover:text-white hover:border-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <HiChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-3 px-4">
            {getPageNumbers().map((pageNum, idx) =>
              pageNum === "..." ? (
                <span
                  key={idx}
                  className="w-9 h-9 flex items-center justify-center rounded-md text-neutral-500 font-mono"
                >
                  <HiDotsHorizontal className="w-5 h-5" />
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed ${
                    pageNum === page
                      ? "bg-teal-400 text-black shadow-md shadow-teal-500/20 font-bold ring-2 ring-teal-300"
                      : "bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white hover:border-neutral-600"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          {/* Next button */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasNext || loading}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-400 font-medium hover:bg-neutral-700 hover:text-white hover:border-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <span className="hidden sm:inline">Next</span>
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Posts per page */}
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span>Show:</span>
          <select
            value={currentFilters.limit || 9}
            className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white focus:border-teal-400 focus:outline-none transition-all disabled:opacity-50"
            onChange={(e) => handlePostsPerPageChange(e.target.value)}
            disabled={loading}
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
            <option value={18}>18</option>
          </select>
          <span>per page</span>
        </div>
      </div>
    );
  };

  // Loading skeleton
  const PostSkeleton = () => (
    <div className="group bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-700/50 p-6 animate-pulse shadow-xl">
      <div className="h-48 bg-gradient-to-br from-neutral-700/50 to-neutral-600/50 rounded-xl mb-6"></div>
      <div className="space-y-3">
        <div className="h-6 bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 rounded-lg w-4/5"></div>
        <div className="h-4 bg-gradient-to-r from-neutral-600/50 to-neutral-500/50 rounded-lg w-full"></div>
        <div className="h-4 bg-gradient-to-r from-neutral-600/50 to-neutral-500/50 rounded-lg w-3/4"></div>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <div className="h-4 bg-gradient-to-r from-neutral-600/50 to-neutral-500/50 rounded w-16"></div>
        <div className="h-4 bg-gradient-to-r from-neutral-600/50 to-neutral-500/50 rounded w-16"></div>
      </div>
    </div>
  );

  // Get sort display name
  const getSortDisplayName = (sortBy) => {
    switch (sortBy) {
      case "createdAt":
        return "Newest First";
      case "likes":
        return "Most Liked";
      case "views":
        return "Most Viewed";
      case "title":
        return "Alphabetical";
      case "updatedAt":
        return "Recently Updated";
      default:
        return "Newest First";
    }
  };

  // Loading state
  if (loading && !safePosts.length) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="mt-20 max-w-7xl mx-auto px-4 py-10">
          {/* Loading header */}
          <div className="text-center mb-12">
            <div className="h-16 bg-neutral-700 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-neutral-600 rounded w-128 mx-auto animate-pulse"></div>
          </div>

          {/* Loading search bar */}
          <div className="mb-8">
            <div className="h-12 bg-neutral-800 rounded-xl mb-6 animate-pulse"></div>
            <div className="flex gap-3 mb-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-neutral-800 rounded-full w-20 animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Loading grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Navbar />
        <div className="mt-20 max-w-4xl mx-auto text-center p-12">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiHeart className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-4xl font-bold text-red-400 mb-4">
            Something went wrong
          </h2>
          <p className="text-xl text-neutral-300 mb-8">{error}</p>
          <button
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/30"
            onClick={() => fetchPosts()}
            disabled={loading}
          >
            {loading ? "Retrying..." : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mt-20 min-h-screen bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/50 via-black to-neutral-900/30"></div>

        <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-8">
          {/* HERO HEADER */}
          <header className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Discover Stories That Matter
            </h1>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Explore our collection of insightful articles from talented
              writers around the world
            </p>
          </header>

          {/* SEARCH AND FILTERS */}
          <div className="mb-8">
            {/* Search Bar + Right Controls Row */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <HiSearch
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isSearching
                      ? "text-teal-400 animate-pulse"
                      : "text-neutral-500"
                  }`}
                />
                <input
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 text-lg transition-all disabled:opacity-50"
                  placeholder="Search articles, tags, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-400"></div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <select
                  className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 cursor-pointer transition-all min-w-[140px] disabled:opacity-50"
                  value={currentFilters.sortBy || "createdAt"}
                  onChange={(e) => handleSortChange(e.target.value)}
                  disabled={loading}
                >
                  <option value="createdAt">Newest First</option>
                  <option value="likes">Most Liked</option>
                  <option value="views">Most Viewed</option>
                  <option value="updatedAt">Recently Updated</option>
                  <option value="title">Alphabetical</option>
                </select>

                <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-all ${
                      viewMode === "grid"
                        ? "bg-teal-400 text-black shadow-md"
                        : "text-neutral-500 hover:text-white hover:bg-neutral-800"
                    }`}
                    disabled={loading}
                  >
                    <HiViewGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-all ${
                      viewMode === "list"
                        ? "bg-teal-400 text-black shadow-md"
                        : "text-neutral-500 hover:text-white hover:bg-neutral-800"
                    }`}
                    disabled={loading}
                  >
                    <HiViewList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Category Pills Row - Multiple Selection */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={handleClearCategories}
                disabled={loading}
                className={`px-6 py-2 rounded-full font-medium transition-all disabled:opacity-50 ${
                  selectedCategories.length === 0
                    ? "bg-teal-400 text-black shadow-lg shadow-teal-400/20 ring-2 ring-teal-300"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-700"
                }`}
              >
                All ({selectedCategories.length === 0 ? "Active" : "Clear All"})
              </button>

              {safeParentCategories.map((category) => {
                const isSelected = selectedCategories.includes(category.slug);
                return (
                  <button
                    key={category.slug}
                    onClick={() => handleCategoryToggle(category.slug)}
                    disabled={loading}
                    className={`px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none ${
                      isSelected
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-400/30 ring-2 ring-teal-300"
                        : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-700"
                    }`}
                  >
                    {category.name}
                    {isSelected && (
                      <span className="ml-2 text-xs bg-white/20 rounded-full px-2 py-0.5">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}

              {categoriesLoading && (
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-neutral-800 rounded-full w-20 animate-pulse"
                    ></div>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Active Filters */}
            {(currentFilters.search || selectedCategories.length > 0) && (
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-sm text-neutral-500 font-medium">
                  Active filters:
                </span>

                {currentFilters.search && (
                  <span className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 px-3 py-1 rounded-full text-blue-200 text-sm flex items-center gap-2">
                    <HiSearch className="w-4 h-4" />
                    Search: "{currentFilters.search}"
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        handleSearch("");
                      }}
                      className="text-blue-300 hover:text-white transition-colors text-lg leading-none"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </span>
                )}

                {safeSelectedCategories.map((categorySlug) => {
                  const category = parentCategories.find(
                    (c) => c.slug === categorySlug
                  );
                  return (
                    <span
                      key={categorySlug}
                      className="bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 px-3 py-1 rounded-full text-teal-200 text-sm flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                      {category?.name || categorySlug}
                      <button
                        onClick={() => handleCategoryToggle(categorySlug)}
                        className="text-teal-300 hover:text-white transition-colors text-lg leading-none"
                        disabled={loading}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}

                {selectedCategories.length > 1 && (
                  <button
                    onClick={handleClearCategories}
                    disabled={loading}
                    className="text-xs bg-red-600/20 border border-red-500/30 text-red-200 hover:bg-red-600/30 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
                  >
                    Clear All Categories
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() => setShowWhoToFollow(true)}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-black rounded-full font-bold transition ml-auto disabled:opacity-50"
            >
              <HiUserGroup className="w-5 h-5 mr-2" />
              Who to follow
            </button>
          </div>

          {/* Enhanced Articles Count + Current Sort Info */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-neutral-400 text-sm">
              {pagination ? (
                <>
                  <span className="text-white font-semibold">
                    {pagination.total}
                  </span>{" "}
                  articles found
                  {selectedCategories.length > 0 && (
                    <span className="text-teal-400 ml-2">
                      in {selectedCategories.length} categor
                      {selectedCategories.length === 1 ? "y" : "ies"}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-white font-semibold">
                  {safePosts.length} articles
                </span>
              )}
            </p>

            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span>
                Sorted by:{" "}
                <span className="text-neutral-400 font-medium">
                  {getSortDisplayName(currentFilters.sortBy)}
                </span>
              </span>
              {selectedCategories.length > 0 && (
                <span>
                  Categories:{" "}
                  {selectedCategories
                    .map(
                      (slug) =>
                        parentCategories.find((c) => c.slug === slug)?.name ||
                        slug
                    )
                    .join(", ")}
                </span>
              )}
            </div>
          </div>

          {/* POSTS GRID  */}
          {safePosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-6 border border-neutral-800">
                <HiSearch className="w-12 h-12 text-neutral-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No articles found
              </h3>
              <p className="text-neutral-400 text-center mb-6">
                {currentFilters.search
                  ? `No articles match "${currentFilters.search}"`
                  : selectedCategories.length > 0
                  ? `No articles found in selected categories`
                  : "Be the first to create an article!"}
              </p>

              {(currentFilters.search || selectedCategories.length > 0) && (
                <button
                  onClick={handleClearCategories}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-teal-500/30 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? "Clearing..." : "Clear All Filters"}
                </button>
              )}
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "flex flex-col gap-4"
              }
            >
              {safePosts.map((post, idx) => (
                <div
                  key={post._id}
                  className="animate-fadeInUp opacity-0"
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <PostCard
                    post={post}
                    viewMode={viewMode}
                    index={idx}
                    className={
                      viewMode === "list"
                        ? "hover:transform hover:scale-[1.01] transition-all duration-300"
                        : "h-full hover:transform hover:scale-105 transition-all duration-300"
                    }
                  />
                </div>
              ))}
            </div>
          )}

          <WhoToFollowDrawer
            open={showWhoToFollow}
            onClose={() => setShowWhoToFollow(false)}
          >
            <WhoToFollow />
          </WhoToFollowDrawer>

          {loading && safePosts.length > 0 && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
              <span className="ml-3 text-neutral-400">
                Loading more posts...
              </span>
            </div>
          )}

          <Pagination />
        </div>

        {/* Custom animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out forwards;
          }
        `}</style>
      </div>
      <SimpleFooter />
    </>
  );
};

export default PostList;

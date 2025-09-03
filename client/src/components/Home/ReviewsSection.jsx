import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Sarah",
    role: "Tech Lead at Stripe",
    avatar:
      "https://plus.unsplash.com/premium_photo-1669704098876-2a38eb10e56a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FyYWh8ZW58MHx8MHx8fDA%3D",
    rating: 5,
    review:
      "This platform has completely transformed how our team shares knowledge. The clean interface and powerful features make writing and discovering content a joy.",
    featured: true,
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Senior Developer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "The best blogging platform I've used. The editor is incredible and the community features help me connect with like-minded developers.",
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Content Strategist",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "Amazing platform! The analytics and engagement tools have helped me grow my audience significantly. Highly recommend.",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Startup Founder",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "The networking features are fantastic. I've connected with industry experts and potential collaborators through this platform.",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Designer & Writer",
    avatar:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "Love the modern design and smooth user experience. It's inspiring to write on such a beautiful platform.",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Marketing Director",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "The community aspect is what sets this apart. Great discussions and valuable connections with other creators.",
  },
];

const ReviewsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-neutral-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/10 via-transparent to-cyan-900/10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-full px-6 py-3 border border-teal-500/20 mb-6">
            <Star className="w-6 h-6 text-teal-400 fill-yellow-400" />
            <span className="text-teal-300 font-semibold">
              What creators say
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Loved by{" "}
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              10,000+
            </span>{" "}
            creators
          </h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of writers, developers, and creators who've made our
            platform their home for sharing ideas and building communities.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`group relative bg-gradient-to-br from-neutral-900/80 to-black/80 backdrop-blur-xl rounded-3xl p-8 border border-neutral-800/50 hover:border-teal-400/30 transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-2xl ${
                review.featured
                  ? "lg:col-span-1 lg:row-span-1 border-teal-500/30"
                  : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-neutral-300 leading-relaxed mb-8 group-hover:text-white transition-colors">
                "{review.review}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full border-2 border-teal-400/30 group-hover:border-teal-400 transition-colors"
                />
                <div>
                  <div className="font-semibold text-white group-hover:text-teal-300 transition-colors">
                    {review.name}
                  </div>
                  <div className="text-sm text-neutral-400">{review.role}</div>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

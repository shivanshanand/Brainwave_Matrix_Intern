import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full min-h-[50vh] flex flex-col items-center justify-center pt-28 pb-12 px-4 bg-black text-center relative">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight max-w-3xl mx-auto">
        The Future of{" "}
        <span className="text-teal-400 drop-shadow-lg">Blogging</span>
      </h1>
      <p className="mt-6 text-lg sm:text-xl text-neutral-300 font-medium max-w-2xl mx-auto">
        Experience a next-generation blog platform with cutting-edge design,
        interactive features, and a community-driven approach to content
        creation.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-10 items-center justify-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-400 text-black font-semibold text-lg shadow-lg hover:bg-teal-300 focus:outline-none transition-all group"
        >
          Explore Blogs{" "}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
        </button>
        <button
          onClick={() => navigate("/editor")}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-white font-semibold text-lg hover:bg-neutral-800 focus:outline-none transition-all"
        >
          Start Writing
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

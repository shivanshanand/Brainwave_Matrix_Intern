import { HiHeart } from "react-icons/hi";
import { Twitter, Github, Linkedin, Instagram } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

const SimpleFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <span>© {currentYear} NexBlog. Made with</span>
            <HiHeart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>for creators.</span>
          </div>

          <div className="flex items-center gap-4">
            <a className="w-9 h-9 bg-neutral-900 hover:bg-teal-600 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a className="w-9 h-9 bg-neutral-900 hover:bg-gray-700 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition-all">
              <Github className="w-4 h-4" />
            </a>
            <a className="w-9 h-9 bg-neutral-900 hover:bg-blue-600 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition-all">
              <Linkedin className="w-4 h-4" />
            </a>
            <a className="w-9 h-9 bg-neutral-900 hover:bg-indigo-600 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition-all">
              <FaDiscord className="w-4 h-4" />
            </a>
            <a className="w-9 h-9 bg-neutral-900 hover:bg-pink-600 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition-all">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;

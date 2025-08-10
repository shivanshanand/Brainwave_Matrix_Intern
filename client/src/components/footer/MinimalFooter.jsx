import { Heart, Github, Twitter, Mail, Linkedin } from "lucide-react";

const MinimalFooter = () => {
  return (
    <footer className="mt-16 border-t border-[#26262B] bg-[#0B0B0C]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand Section */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-lg bg-cyan-500 text-black grid place-items-center font-bold text-xs">
              ₹
            </div>
            <span className="text-[#EDEDEF] font-semibold">FinSight</span>
            <span className="text-[#6A6A72] text-sm">•</span>
            <span className="text-[#8A8A92] text-sm">
              Smart Financial Tracking
            </span>
          </div>

          {/* Links Section */}
          <div className="flex items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="mailto:support@finsight.com"
                className="h-8 w-8 rounded-lg bg-[#121214] border border-[#26262B] text-[#8A8A92] hover:text-cyan-400 hover:border-cyan-600 transition-all grid place-items-center"
                title="Contact Support"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/shivanshanand"
                className="h-8 w-8 rounded-lg bg-[#121214] border border-[#26262B] text-[#8A8A92] hover:text-cyan-400 hover:border-cyan-600 transition-all grid place-items-center"
                title="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/shivansh-anand-%F0%9F%93%88-aa48851b8/"
                className="h-8 w-8 rounded-lg bg-[#121214] border border-[#26262B] text-[#8A8A92] hover:text-cyan-400 hover:border-cyan-600 transition-all grid place-items-center"
                title="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 pt-6 border-t border-[#26262B] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-[#8A8A92]">
            <span>© {new Date().getFullYear()} FinSight</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with{" "}
              <Heart className="w-3 h-3 text-rose-400" fill="currentColor" /> in
              Punjab, India
            </span>
          </div>

          <div className="text-xs text-[#6A6A72]">
            v1.0.0 • Last updated: {new Date().toLocaleDateString("en-IN")}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;

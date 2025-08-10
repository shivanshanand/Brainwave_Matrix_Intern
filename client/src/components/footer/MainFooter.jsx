import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  ArrowUp,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewsletterSignup from "../NewsletterSignup ";

const MainFooter = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Transactions", path: "/transactions" },
    { label: "Analytics", path: "/analytics" },
    { label: "Profile", path: "/profile" },
  ];

  const supportLinks = [
    { label: "Help Center" },
    { label: "Contact Us" },
    { label: "Privacy Policy" },
    { label: "Terms of Service" },
  ];

  const features = [
    { label: "AI Insights" },
    { label: "Expense Tracking" },
    { label: "Smart Analytics" },
    { label: "Goal Setting" },
  ];

  return (
    <footer className="bg-[#0B0B0C] border-t border-[#26262B]">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500 text-black grid place-items-center font-bold">
                ₹
              </div>
              <span className="text-2xl font-bold text-[#EDEDEF]">
                FinSight
              </span>
            </div>
            <p className="text-[#B3B3B8] mb-6 leading-relaxed">
              AI-powered expense tracking designed for modern India. Take
              control of your financial future with intelligent insights and
              smart analytics.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-[#8A8A92]">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@finsight.app</span>
              </div>
              <div className="flex items-center gap-3 text-[#8A8A92]">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-[#8A8A92]">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Hoshiarpur, Punjab, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="http://twitter.com/"
                className="h-9 w-9 rounded-lg bg-[#121214] border border-[#26262B] grid place-items-center text-[#8A8A92] hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/shivansh-anand-%F0%9F%93%88-aa48851b8/"
                className="h-9 w-9 rounded-lg bg-[#121214] border border-[#26262B] grid place-items-center text-[#8A8A92] hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/shivanshanand"
                className="h-9 w-9 rounded-lg bg-[#121214] border border-[#26262B] grid place-items-center text-[#8A8A92] hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#EDEDEF] font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-[#8A8A92] hover:text-cyan-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-[#EDEDEF] font-semibold mb-4">Features</h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index}>
                  <button className="text-[#8A8A92] hover:text-cyan-400 transition-colors text-sm">
                    {feature.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[#EDEDEF] font-semibold mb-4">Support</h3>
            <ul className="space-y-3 mb-6">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <button
                    className="text-[#8A8A92] hover:text-cyan-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Newsletter Signup */}
            <NewsletterSignup />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#26262B]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-1 text-[#8A8A92] text-sm">
              <span>© {new Date().getFullYear()} FinSight. Made with</span>
              <Heart className="w-4 h-4 text-rose-400 fill-current" />
              <span>by</span>
              <span className="text-cyan-400 font-semibold">
                Shivansh Anand
              </span>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-[#8A8A92] hover:text-cyan-400 transition-colors text-sm group"
            >
              <span>Back to top</span>
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;

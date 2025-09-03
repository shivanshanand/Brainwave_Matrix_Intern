import {
  HiCode,
  HiGlobeAlt,
  HiHeart,
  HiLightningBolt,
  HiOutlineShieldCheck,
  HiShieldCheck,
  HiSparkles,
  HiTrendingUp,
  HiUser,
} from "react-icons/hi";
import { Twitter, Github, Linkedin, Instagram, PenLine } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const footerSections = {
    product: [
      { name: "Features" },
      { name: "Pricing" },
      { name: "API" },
      { name: "Integrations" },
    ],
    resources: [
      { name: "Documentation" },
      { name: "Guides" },
      { name: "Blog" },
      { name: "Community" },
    ],
    company: [
      { name: "About" },
      { name: "Careers" },
      { name: "Press" },
      { name: "Contact" },
    ],
    legal: [
      { name: "Privacy Policy" },
      { name: "Terms of Service" },
      { name: "Cookie Policy" },
      { name: "GDPR" },
    ],
  };

  const handleSubscribe = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      toast.error("Please enter your email!");
    } else if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!");
    } else {
      toast.success("🎉 Subscribed successfully!");
      setEmail("");
    }
  };

  return (
    <footer className="bg-gradient-to-b from-black to-neutral-950 border-t border-neutral-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <PenLine className="text-black w-5 h-5 font-bold" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">NexBlog</div>
                <div className="text-sm text-teal-400">Next-Gen Writing</div>
              </div>
            </div>
            <p className="text-neutral-300 leading-relaxed mb-8 max-w-md">
              Empowering creators with the most advanced blogging platform.
              Write, connect, and grow your audience with cutting-edge tools and
              features.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a className="w-10 h-10 bg-neutral-800 hover:bg-teal-600 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-200 hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 bg-neutral-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-200 hover:scale-110">
                <Github className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 bg-neutral-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-200 hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 bg-neutral-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-200 hover:scale-110">
                <FaDiscord className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 bg-neutral-800 hover:bg-pink-600 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-200 hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <HiCode className="w-5 h-5 text-teal-400" />
              Product
            </h3>
            <ul className="space-y-4">
              {footerSections.product.map((link) => (
                <li key={link.name}>
                  <a className="text-neutral-400 hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <HiGlobeAlt className="w-5 h-5 text-cyan-400" />
              Resources
            </h3>
            <ul className="space-y-4">
              {footerSections.resources.map((link) => (
                <li key={link.name}>
                  <a className="text-neutral-400 hover:text-cyan-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <HiUser className="w-5 h-5 text-purple-400" />
              Company
            </h3>
            <ul className="space-y-4">
              {footerSections.company.map((link) => (
                <li key={link.name}>
                  <a className="text-neutral-400 hover:text-purple-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <HiOutlineShieldCheck className="w-5 h-5 text-green-400" />
              Legal
            </h3>
            <ul className="space-y-4">
              {footerSections.legal.map((link) => (
                <li key={link.name}>
                  <a className="text-neutral-400 hover:text-green-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-12 border-t border-neutral-800">
          <div className="max-w-md mx-auto text-center lg:max-w-none lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-0 lg:flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                Stay in the loop
              </h3>
              <p className="text-neutral-300">
                Get the latest updates, tips, and exclusive content delivered to
                your inbox.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto lg:mx-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-teal-500/30"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-neutral-400">
              <span>© {currentYear} NexBlog. Made with</span>
              <HiHeart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>for creators worldwide.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <HiTrendingUp className="w-4 h-4 text-green-400" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <HiLightningBolt className="w-4 h-4 text-yellow-400" />
                <span>Ultra Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <HiShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

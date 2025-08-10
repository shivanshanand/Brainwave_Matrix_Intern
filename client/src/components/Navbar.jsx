import { LogOut, User, Plus, Menu, X } from "lucide-react";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";

export default function Navbar({ title = "FinSight" }) {
  const navigate = useNavigate();
  const { user, logout, loading } = useUserStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goToProfile = useCallback(() => {
    navigate("/profile");
    setMobileMenuOpen(false); // close mobile menu if open
  }, [navigate]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121214]/80 backdrop-blur-md border-b border-[#26262B]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Section */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-cyan-500 text-black grid place-items-center font-bold text-sm">
              ₹
            </div>
            <span
              className="text-xl font-bold text-[#EDEDEF] tracking-tight cursor-pointer hover:text-cyan-400 transition-colors"
              onClick={() => navigate("/")}
            >
              {title}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                {/* User Info -> Clickable to profile */}
                <button
                  onClick={goToProfile}
                  className="flex items-center gap-3 pl-4 group"
                  aria-label="Open profile"
                >
                  <div className="hidden sm:block text-right">
                    <p className="text-sm text-[#EDEDEF] font-medium group-hover:text-cyan-300 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-xs text-[#8A8A92]">{user.email}</p>
                  </div>

                  {/* Avatar */}
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 grid place-items-center text-black font-bold shadow-lg ring-0 group-hover:ring-2 group-hover:ring-cyan-400/40 transition">
                    <User className="w-4 h-4" />
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-10 w-10 rounded-xl bg-transparent border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] focus:outline-none focus:ring-2 focus:ring-cyan-300/40 transition-all grid place-items-center"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t border-[#26262B] py-4">
            <div className="space-y-4">
              {/* User Info Mobile -> Clickable to profile */}
              <button
                onClick={goToProfile}
                className="flex items-center gap-3 w-full text-left"
                aria-label="Open profile"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 grid place-items-center text-black font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-[#EDEDEF] font-medium">
                    {user.name}
                  </p>
                  <p className="text-xs text-[#8A8A92]">{user.email}</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

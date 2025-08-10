import { useMemo } from "react";
import { useUserStore } from "../store/userStore";
import { motion } from "framer-motion";
import { LogOut, Mail, User as UserIcon, AtSign } from "lucide-react";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean); // Filter out empty strings

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";

  // For multiple words, take first letter of first word + first letter of last word
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Profile = () => {
  const { user, logout } = useUserStore();

  const initials = useMemo(
    () => getInitials(user?.name || user?.username || ""),
    [user]
  );

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally, redirect handled by store or ProtectedRoute
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-[#0B0B0C] flex items-center justify-center px-4 sm:px-6 py-12">
      {/* Background layers */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[#0B0B0C]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br from-cyan-500/6 via-violet-500/6 to-transparent"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-lg"
      >
        <div className="rounded-2xl bg-[#121214] border border-[#26262B] p-8 sm:p-10 shadow-[0_1px_0_rgba(255,255,255,0.04),0_12px_32px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user?.name || "User"}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border border-[#2B2B31]"
                />
              ) : (
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-white border border-[#2B2B31] grid place-items-center shadow-lg">
                  <span className="text-2xl sm:text-3xl font-bold">
                    {initials}
                  </span>
                </div>
              )}

              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[#121214] border-2 border-[#121214] grid place-items-center">
                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
              </div>
            </div>

            <h1 className="mt-4 text-2xl font-bold text-[#EDEDEF]">
              {user?.name || "User"}
            </h1>
            <p className="mt-1 text-sm text-[#8A8A92]">
              Manage your FinSight account
            </p>
          </div>

          {/* Info */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-[#26262B] bg-[#0F0F11] px-4 py-3">
              <UserIcon className="w-4 h-4 text-[#8A8A92]" />
              <div className="flex-1">
                <div className="text-xs text-[#6A6A72]">Name</div>
                <div className="text-[#EDEDEF]">{user?.name || "—"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#26262B] bg-[#0F0F11] px-4 py-3">
              <AtSign className="w-4 h-4 text-[#8A8A92]" />
              <div className="flex-1">
                <div className="text-xs text-[#6A6A72]">Username</div>
                <div className="text-[#EDEDEF]">
                  {user?.username || user?.name || "—"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#26262B] bg-[#0F0F11] px-4 py-3">
              <Mail className="w-4 h-4 text-[#8A8A92]" />
              <div className="flex-1">
                <div className="text-xs text-[#6A6A72]">Email</div>
                <div className="text-[#EDEDEF]">{user?.email || "—"}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex items-center justify-between gap-3">
            <div className="text-xs text-[#6A6A72]">
              Signed in as{" "}
              <span className="text-[#B3B3B8]">{user?.email || "guest"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/40 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;

import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, PenLine, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../store/authStore";

const Navbar = () => {
  const { username } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!userDropdown) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [userDropdown]);

  const handleNav = (to) => {
    setMenuOpen(false);
    setUserDropdown(false);
    navigate(to);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleWrite = () => {
    setMenuOpen(false);
    if (isAuthenticated) navigate("/editor");
    else navigate("/login");
  };

  const renderAvatar = () =>
    user?.avatar ? (
      <motion.img
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        src={user.avatar}
        alt="profile"
        className="w-8 h-8 rounded-full object-cover cursor-pointer"
      />
    ) : (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <User className="w-7 h-7 text-teal-400" />
      </motion.div>
    );

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="w-full bg-black border-b border-neutral-800 flex items-center justify-between h-16 px-4 sm:px-8 md:px-16 fixed top-0 z-40"
      >
        {/* Logo with bounce */}
        <motion.div
          className="flex items-center gap-2 shrink-0 cursor-pointer"
          onClick={() => handleNav("/home")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <motion.div
            className="bg-teal-400 p-2 rounded-lg flex items-center justify-center"
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <PenLine className="text-black w-5 h-5 font-bold" />
          </motion.div>
          <span className="text-xl sm:text-2xl font-bold text-white tracking-tight select-none">
            NexBlog
          </span>
        </motion.div>

        {/* Desktop Navigation with hover effects */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-base lg:text-lg">
          {["Home", "Blogs", "Trending", "Explore"].map((item, index) => {
            const paths = ["/", "/blogs", "/trending", "/explore"];
            return (
              <motion.button
                key={item}
                onClick={() => handleNav(paths[index])}
                className="text-neutral-200 hover:text-teal-400 transition font-medium px-2 relative"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {item}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4 relative">
          {!isAuthenticated ? (
            <motion.button
              className="flex items-center gap-1 text-white hover:text-teal-400 transition px-2"
              onClick={() => handleNav("/login")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Login</span>
            </motion.button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                className="flex items-center gap-2 rounded-full hover:bg-neutral-900 px-2 py-1 transition group select-none"
                onClick={() => setUserDropdown((v) => !v)}
                aria-label="Open user menu"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {renderAvatar()}
                <span className="font-medium text-neutral-200">
                  {user?.username || "User"}
                </span>
                <motion.div
                  animate={{ rotate: userDropdown ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <ChevronDown className="ml-0.5 w-4 h-4 text-neutral-400 group-hover:text-teal-400 transition" />
                </motion.div>
              </motion.button>

              {/* Enhanced Dropdown */}
              <AnimatePresence>
                {userDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute right-0 top-12 min-w-[170px] bg-neutral-900 text-white rounded-lg shadow-lg border border-neutral-700 flex flex-col py-1 z-50"
                  >
                    <motion.button
                      className="text-left w-full px-4 py-2 hover:bg-neutral-800 transition"
                      onClick={() => navigate(`/users/${user?.username}`)}
                      whileHover={{ x: 4, backgroundColor: "#262626" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      Profile
                    </motion.button>
                    <motion.button
                      className="text-left w-full px-4 py-2 hover:bg-neutral-800 transition text-red-400"
                      onClick={handleLogout}
                      whileHover={{ x: 4, backgroundColor: "#262626" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Enhanced Write Button */}
          <motion.button
            onClick={handleWrite}
            className="ml-2 px-4 py-2 bg-teal-400 text-black font-semibold rounded-lg hover:bg-teal-300 transition shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Write
          </motion.button>
        </div>

        {/* Enhanced Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-md ml-2 focus:outline-none"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Menu className="w-7 h-7 text-neutral-300" />
        </motion.button>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col"
            >
              <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                exit={{ y: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex justify-between items-center px-4 py-4 border-b border-neutral-800"
              >
                <motion.div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleNav("/home")}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-teal-400 p-2 rounded-lg flex items-center justify-center">
                    <PenLine className="text-black w-5 h-5 font-bold" />
                  </div>
                  <span className="text-xl font-bold text-white tracking-tight select-none">
                    NexBlog
                  </span>
                </motion.div>

                <motion.button
                  className="p-2 rounded-md text-neutral-300"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <X className="w-7 h-7" />
                </motion.button>
              </motion.div>

              {/* Animated Mobile Menu Items */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  delay: 0.1,
                }}
                className="flex flex-col gap-8 py-10 px-8 text-lg font-medium"
              >
                {[
                  { label: "Home", path: "/" },
                  { label: "Blogs", path: "/blogs" },
                  { label: "Trending", path: "/trending" },
                ].map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      delay: index * 0.1,
                    }}
                    onClick={() => handleNav(item.path)}
                    className="text-neutral-200 hover:text-teal-400 transition text-left"
                    whileHover={{ x: 10, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.button>
                ))}

                {/* Auth Section */}
                {!isAuthenticated ? (
                  <motion.button
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      delay: 0.4,
                    }}
                    className="flex items-center gap-2 text-white hover:text-teal-400 transition"
                    onClick={() => handleNav("/login")}
                    whileHover={{ x: 10, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-5 h-5" />
                    Login
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      delay: 0.4,
                    }}
                    className="flex flex-col gap-2 pt-4"
                  >
                    <motion.button
                      className="flex items-center gap-2 text-white py-2 hover:text-teal-400 transition"
                      onClick={() => handleNav(`/users/${user?.username}`)}
                      whileHover={{ x: 10, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <User className="w-5 h-5" />
                      {user?.username || "User"}'s Profile
                    </motion.button>
                    <motion.button
                      className="w-full px-4 py-2 text-sm rounded-md bg-neutral-800 hover:bg-neutral-700 text-teal-300 transition"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      Logout
                    </motion.button>
                  </motion.div>
                )}

                {/* Enhanced Mobile Write Button */}
                <motion.button
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    delay: 0.5,
                  }}
                  className="w-full mt-4 px-4 py-2 bg-teal-400 text-black font-semibold rounded-lg hover:bg-teal-300 transition shadow-lg"
                  onClick={handleWrite}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Write
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;

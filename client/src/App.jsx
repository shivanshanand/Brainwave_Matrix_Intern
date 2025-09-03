import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./store/authStore";
import PostList from "./pages/PostList";
import PostDetail from "./components/Posts/PostDetail";
import PostEditor from "./pages/PostEditor";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import Home from "./pages/Home";
import TrendingPosts from "./pages/TrendingPosts";
import UserProfile from "./pages/UserProfile";
import ExplorePeople from "./pages/ExplorePeople";
import EditPost from "./components/Posts/EditPost";
import NotFound from "./components/Comments/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./components/Common/Loading";

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 },
};

const pageTransition = {
  type: "spring",
  stiffness: 160,
  damping: 22,
  bounce: 0.14,
};

const getPageVariants = (pathname) => {
  // Slide up for auth pages
  if (pathname.includes("/login") || pathname.includes("/register")) {
    return {
      initial: { opacity: 0, y: 30 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -30 },
    };
  }

  // Slide from right for post details
  if (pathname.includes("/posts/") && !pathname.includes("/edit")) {
    return {
      initial: { opacity: 0, x: 50 },
      in: { opacity: 1, x: 0 },
      out: { opacity: 0, x: -50 },
    };
  }

  // Scale for editor/create pages
  if (pathname.includes("/editor") || pathname.includes("/edit")) {
    return {
      initial: { opacity: 0, scale: 0.95 },
      in: { opacity: 1, scale: 1 },
      out: { opacity: 0, scale: 1.05 },
    };
  }

  // Default left-right slide
  return pageVariants;
};

const App = () => {
  const { initialize, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <Loading
        variant="branded"
        size="large"
        message="Checking authentication status"
        className="min-h-screen"
      />
    );
  }

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/blogs"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={getPageVariants(location.pathname)}
                transition={pageTransition}
              >
                <PostList />
              </motion.div>
            }
          />
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={getPageVariants(location.pathname)}
                transition={pageTransition}
              >
                <Home />
              </motion.div>
            }
          />
          <Route
            path="/trending"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={getPageVariants(location.pathname)}
                transition={pageTransition}
              >
                <TrendingPosts />
              </motion.div>
            }
          />
          <Route
            path="/login"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={getPageVariants(location.pathname)}
                transition={pageTransition}
              >
                <LoginForm />
              </motion.div>
            }
          />
          <Route
            path="/register"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={getPageVariants(location.pathname)}
                transition={pageTransition}
              >
                <RegisterForm />
              </motion.div>
            }
          />
          <Route
            path="/users/:username"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={getPageVariants(location.pathname)}
                transition={pageTransition}
              >
                <UserProfile />
              </motion.div>
            }
          />

          <Route
            path="/posts/:slug"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={getPageVariants(location.pathname)}
                transition={pageTransition}
              >
                <ProtectedRoute>
                  <PostDetail />
                </ProtectedRoute>
              </motion.div>
            }
          />
          <Route
            path="/explore"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={getPageVariants(location.pathname)}
                transition={pageTransition}
              >
                <ProtectedRoute>
                  <ExplorePeople />
                </ProtectedRoute>
              </motion.div>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={getPageVariants(location.pathname)}
                transition={pageTransition}
              >
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              </motion.div>
            }
          />

          <Route
            path="/editor"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={getPageVariants(location.pathname)}
                transition={pageTransition}
              >
                <ProtectedRoute>
                  <PostEditor />
                </ProtectedRoute>
              </motion.div>
            }
          />

          <Route
            path="*"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <NotFound />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="bg-gray-800 text-white"
        bodyClassName="text-sm"
        style={{ zIndex: 9999 }}
      />
    </>
  );
};

export default App;

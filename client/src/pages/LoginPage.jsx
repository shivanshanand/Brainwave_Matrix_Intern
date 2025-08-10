import React, { useState, useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  UserPlus,
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage = () => {
  const { login, loading, error, user } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  // Real-time validation
  useEffect(() => {
    const errors = {};

    if (touched.email && email) {
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (touched.password && password) {
      if (password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
    }

    setValidationErrors(errors);
  }, [email, password, touched]);

  // On login success
  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.name}! 🚀`, {
        icon: "🪙",
        toastId: "login-success",
      });
      const t = setTimeout(() => {
        navigate(from, { replace: true });
      }, 800);
      return () => clearTimeout(t);
    }
  }, [user, navigate, from]);

  // Show backend error
  useEffect(() => {
    if (error) {
      toast.error(error, {
        icon: "⚠️",
        toastId: "login-error",
      });
    }
  }, [error]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validation
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address.", {
        icon: "📧",
        toastId: "login-email-error",
      });
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.", {
        icon: "🔒",
        toastId: "login-pw-error",
      });
      return;
    }

    login(email, password);
  };

  const isFormValid = emailRegex.test(email) && password.length >= 8;

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-[#0B0B0C] flex items-center justify-center px-4 sm:px-6 py-12">
      {" "}
      {/* Background layers (non-interactive, behind content) */}{" "}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[#0B0B0C]"
      />{" "}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br from-cyan-500/6 via-violet-500/6 to-transparent"
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative w-full max-w-md"
      >
        {/* Login Card */}
        <div className="rounded-2xl bg-[#121214] border border-[#26262B] p-8 shadow-[0_1px_0_rgba(255,255,255,0.04),0_12px_32px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-cyan-500 text-black grid place-items-center font-bold text-lg">
              ₹
            </div>
            <motion.h2
              className="text-2xl font-bold text-[#EDEDEF] mb-2"
              initial={{ letterSpacing: "-0.3em", opacity: 0 }}
              animate={{ letterSpacing: "normal", opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Welcome Back
            </motion.h2>
            <p className="text-[#8A8A92] text-sm">
              Sign in to continue to FinSight
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#B3B3B8]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A6A72]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="your@email.com"
                  className={`w-full h-11 pl-10 pr-10 rounded-xl bg-[#121214] border text-[#EDEDEF] placeholder:text-[#6A6A72] focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.email
                      ? "border-rose-500 focus:ring-rose-300/40 focus:border-rose-500"
                      : touched.email && email && !validationErrors.email
                      ? "border-emerald-500 focus:ring-emerald-300/40 focus:border-emerald-500"
                      : "border-[#2B2B31] focus:ring-cyan-300/40 focus:border-cyan-500"
                  }`}
                  required
                />

                {/* Validation Icons */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {validationErrors.email ? (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  ) : touched.email && email && !validationErrors.email ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : null}
                </div>
              </div>

              {/* Error Message */}
              {validationErrors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#B3B3B8]">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A6A72]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full h-11 pl-10 pr-10 rounded-xl bg-[#121214] border text-[#EDEDEF] placeholder:text-[#6A6A72] focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.password
                      ? "border-rose-500 focus:ring-rose-300/40 focus:border-rose-500"
                      : touched.password &&
                        password &&
                        !validationErrors.password
                      ? "border-emerald-500 focus:ring-emerald-300/40 focus:border-emerald-500"
                      : "border-[#2B2B31] focus:ring-cyan-300/40 focus:border-cyan-500"
                  }`}
                  required
                />

                {/* Show/Hide Password Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6A72] hover:text-[#B3B3B8] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Error Message */}
              {validationErrors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.password}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full h-11 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 active:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 pt-6 border-t border-[#26262B] text-center">
            <p className="text-[#8A8A92] text-sm mb-3">New to FinSight?</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/40 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </Link>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-xs text-[#6A6A72] mt-6">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="text-cyan-400 hover:text-cyan-300">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;

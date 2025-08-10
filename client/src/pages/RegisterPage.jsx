import React, { useState, useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  LogIn,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Shield,
} from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const RegisterPage = () => {
  const { register, loading, error, user } = useUserStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  // Real-time validation
  useEffect(() => {
    const errors = {};

    if (touched.name && name) {
      if (name.trim().length < 3) {
        errors.name = "Name must be at least 3 characters";
      }
    }

    if (touched.email && email) {
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (touched.password && password) {
      if (!passwordRegex.test(password)) {
        errors.password =
          "Password must contain 8+ characters, uppercase, lowercase, number, and special character";
      }
    }

    if (touched.confirmPassword && confirmPassword) {
      if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setValidationErrors(errors);
  }, [name, email, password, confirmPassword, touched]);

  // Success and redirect
  useEffect(() => {
    if (user) {
      toast.success(`Welcome to FinSight, ${user.name}! 🚀`, {
        icon: "💸",
        toastId: "register-success",
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1800);
    }
  }, [user, navigate]);

  // Show backend error
  useEffect(() => {
    if (error) {
      toast.error(error, {
        icon: "⚠️",
        toastId: "register-error",
      });
    }
  }, [error]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validation
    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters.", {
        icon: "🙍‍♂️",
        toastId: "name-invalid",
      });
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address.", {
        icon: "📧",
        toastId: "email-invalid",
      });
      return;
    }
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be 8+ chars, include uppercase, lowercase, number, and special character.",
        {
          icon: "🔒",
          toastId: "pw-invalid",
        }
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        icon: "🔒",
        toastId: "pw-match-invalid",
      });
      return;
    }

    register(name, email, password);
  };

  const isFormValid =
    name.trim().length >= 3 &&
    emailRegex.test(email) &&
    passwordRegex.test(password) &&
    password === confirmPassword;

  // Password strength checker
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;

    if (strength <= 2)
      return { label: "Weak", color: "text-rose-400", bg: "bg-rose-400" };
    if (strength <= 4)
      return { label: "Good", color: "text-yellow-400", bg: "bg-yellow-400" };
    return { label: "Strong", color: "text-emerald-400", bg: "bg-emerald-400" };
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-[#0B0B0C] flex items-center justify-center px-4 sm:px-6 py-14">
      {" "}
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
        {/* Register Card */}
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
              transition={{ delay: 0.35 }}
            >
              Join FinSight
            </motion.h2>
            <p className="text-[#8A8A92] text-sm">
              Unlock{" "}
              <span className="text-cyan-400 font-semibold">
                AI-powered insights
              </span>{" "}
              & effortless finances
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#B3B3B8]">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A6A72]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="Enter your full name"
                  autoFocus
                  className={`w-full h-11 pl-10 pr-10 rounded-xl bg-[#121214] border text-[#EDEDEF] placeholder:text-[#6A6A72] focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.name
                      ? "border-rose-500 focus:ring-rose-300/40 focus:border-rose-500"
                      : touched.name && name && !validationErrors.name
                      ? "border-emerald-500 focus:ring-emerald-300/40 focus:border-emerald-500"
                      : "border-[#2B2B31] focus:ring-cyan-300/40 focus:border-cyan-500"
                  }`}
                  required
                />

                {/* Validation Icons */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {validationErrors.name ? (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  ) : touched.name && name && !validationErrors.name ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : null}
                </div>
              </div>

              {/* Error Message */}
              {validationErrors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.name}
                </motion.p>
              )}
            </div>

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
                  placeholder="Create a strong password"
                  autoComplete="new-password"
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-[#2B2B31] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength?.bg}`}
                      style={{
                        width:
                          password.length >= 8 && passwordRegex.test(password)
                            ? "100%"
                            : password.length >= 6
                            ? "66%"
                            : password.length >= 3
                            ? "33%"
                            : "10%",
                      }}
                    ></div>
                  </div>
                  <span className={`text-xs ${passwordStrength?.color}`}>
                    {passwordStrength?.label}
                  </span>
                </div>
              )}

              {/* Error Message */}
              {validationErrors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-400 flex items-start gap-1"
                >
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{validationErrors.password}</span>
                </motion.p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#B3B3B8]">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A6A72]">
                  <Shield className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur("confirmPassword")}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className={`w-full h-11 pl-10 pr-10 rounded-xl bg-[#121214] border text-[#EDEDEF] placeholder:text-[#6A6A72] focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.confirmPassword
                      ? "border-rose-500 focus:ring-rose-300/40 focus:border-rose-500"
                      : touched.confirmPassword &&
                        confirmPassword &&
                        !validationErrors.confirmPassword
                      ? "border-emerald-500 focus:ring-emerald-300/40 focus:border-emerald-500"
                      : "border-[#2B2B31] focus:ring-cyan-300/40 focus:border-cyan-500"
                  }`}
                  required
                />

                {/* Show/Hide Password Button */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6A72] hover:text-[#B3B3B8] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Error Message */}
              {validationErrors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="text-xs text-[#8A8A92] leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-cyan-400 hover:text-cyan-300">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300">
                Privacy Policy
              </Link>
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-[#26262B] text-center">
            <p className="text-[#8A8A92] text-sm mb-3">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/40 transition-all"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

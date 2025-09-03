import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../store/authStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  HiEye,
  HiEyeOff,
  HiMail,
  HiLockClosed,
  HiExclamationCircle,
  HiCheckCircle,
} from "react-icons/hi";

const LoginForm = () => {
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    watch,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const watchedFields = watch();

  const onSubmit = async (data) => {
    try {
      clearError();
      const loginData = { ...data, rememberMe };
      const result = await login(loginData);

      toast.success(
        `Welcome back, ${result.firstName || result.username}! 🎉`,
        { position: "bottom-right", autoClose: 3000 }
      );

      const redirectTo =
        new URLSearchParams(window.location.search).get("redirect") || "/";
      window.location.href = redirectTo;
    } catch {
      toast.error("Login failed. Please check your credentials.", {
        position: "bottom-right",
        autoClose: 4000,
      });
    }
  };

  const handleInputChange = (fieldName) => {
    if (errors[fieldName]) clearErrors(fieldName);
    if (error) clearError();
  };

  const validationRules = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Please enter a valid email address",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    },
  };

  const FormInput = ({
    name,
    type = "text",
    placeholder,
    icon: Icon,
    showPasswordToggle = false,
  }) => {
    const hasError = errors[name];
    const isDirty = dirtyFields[name];
    const hasValue = watchedFields[name]?.length > 0;
    const isFieldValid = !hasError && isDirty && hasValue;

    return (
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon
              className={`h-5 w-5 ${
                hasError
                  ? "text-pink-400"
                  : isFieldValid
                  ? "text-teal-400"
                  : "text-cyan-400/50"
              }`}
            />
          </div>

          <input
            {...register(name, validationRules[name])}
            type={showPasswordToggle && showPassword ? "text" : type}
            placeholder={placeholder}
            onChange={() => handleInputChange(name)}
            className={`
              w-full pl-10 pr-12 py-3 bg-slate-900 border rounded-xl text-cyan-100 placeholder:text-cyan-400/50
              focus:outline-none transition
              ${
                hasError
                  ? "border-pink-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                  : isFieldValid
                  ? "border-teal-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  : "border-cyan-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-600/20"
              }
            `}
          />

          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              tabIndex={-1}
            >
              {showPassword ? (
                <HiEyeOff className="h-5 w-5 text-cyan-400/50 hover:text-cyan-200" />
              ) : (
                <HiEye className="h-5 w-5 text-cyan-400/50 hover:text-cyan-200" />
              )}
            </button>
          )}
          {!showPasswordToggle && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {hasError && (
                <HiExclamationCircle className="h-5 w-5 text-pink-400" />
              )}
              {isFieldValid && (
                <HiCheckCircle className="h-5 w-5 text-teal-400" />
              )}
            </div>
          )}
        </div>
        {hasError && (
          <p className="mt-1 text-sm text-pink-400 flex items-center gap-1">
            <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
            {hasError.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-slate-900">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow">
            Welcome Back
          </h2>
          <p className="mt-2 text-cyan-300/80">
            Sign in to your account to continue
          </p>
        </div>

        {/* Auth Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-2xl shadow-2xl bg-slate-900/80 border border-cyan-700 py-8 px-5 md:px-8"
        >
          {/* Global Error */}
          {error && (
            <div className="mb-6 p-4 bg-pink-400/10 border border-pink-400/20 rounded-xl flex items-center gap-3">
              <HiExclamationCircle className="h-6 w-6 text-pink-400 flex-shrink-0" />
              <div>
                <p className="text-pink-400 font-bold">Login Failed</p>
                <p className="text-pink-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-cyan-200 mb-2"
            >
              Email Address
            </label>
            <FormInput
              name="email"
              type="email"
              placeholder="Enter your email"
              icon={HiMail}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-cyan-200 mb-2"
            >
              Password
            </label>
            <FormInput
              name="password"
              type="password"
              placeholder="Enter your password"
              icon={HiLockClosed}
              showPasswordToggle={true}
            />
          </div>

          {/* Remember Me / Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-teal-500 bg-slate-800 border-cyan-700 rounded focus:ring-teal-500"
              />
              <span className="ml-2 text-sm text-cyan-200">Remember me</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !isValid}
            className={`
              w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow text-white font-bold text-lg transition-all duration-200
              ${
                loading || !isValid
                  ? "bg-cyan-900/80 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 hover:scale-[1.02] active:scale-[0.98]"
              }
            `}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <HiLockClosed className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Register + Back Links */}
        <div className="text-center space-y-2">
          <p className="text-cyan-300/90">
            Don't have an account?&nbsp;
            <button
              type="button"
              onClick={() => (window.location.href = "/register")}
              className="text-teal-400 hover:text-teal-200 underline font-medium transition"
            >
              Create one here
            </button>
          </p>
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="text-cyan-500 hover:text-cyan-300 text-sm mt-2 transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

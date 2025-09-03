import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../store/authStore";
import { toast } from "react-toastify";
import {
  HiEye,
  HiEyeOff,
  HiMail,
  HiLockClosed,
  HiUser,
  HiUserCircle,
  HiExclamationCircle,
  HiCheckCircle,
  HiShieldCheck,
  HiX,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const { register: signup, loading, error, clearError } = useAuth();
  const { isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    watch,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); 
    }
  }, [isAuthenticated, navigate]);

  const watchedFields = watch();
  const password = watch("password");

  // Password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "", bgColor: "" };
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    score = Object.values(checks).filter(Boolean).length;
    if (score <= 1)
      return {
        score,
        label: "Weak",
        color: "text-pink-400",
        bgColor: "bg-pink-500",
      };
    if (score <= 3)
      return {
        score,
        label: "Fair",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500",
      };
    if (score <= 4)
      return {
        score,
        label: "Good",
        color: "text-blue-400",
        bgColor: "bg-blue-500",
      };
    return {
      score,
      label: "Strong",
      color: "text-teal-400",
      bgColor: "bg-teal-500",
    };
  };
  const passwordStrength = calculatePasswordStrength(password);

  // Unified input
  const FormInput = ({
    name,
    type = "text",
    placeholder,
    icon: Icon,
    showPasswordToggle = false,
    showPasswordStrength = false,
  }) => {
    const hasError = errors[name];
    const isDirty = dirtyFields[name];
    const hasValue = watchedFields[name]?.length > 0;
    const isValid = !hasError && isDirty && hasValue;

    return (
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon
              className={`h-5 w-5 ${
                hasError
                  ? "text-pink-400"
                  : isValid
                  ? "text-teal-300"
                  : "text-cyan-400/60"
              }`}
            />
          </div>
          <input
            {...register(name, validationRules[name])}
            type={
              showPasswordToggle &&
              (name === "password" ? showPassword : showConfirmPassword)
                ? "text"
                : type
            }
            placeholder={placeholder}
            onChange={() => handleInputChange(name)}
            className={`
              w-full pl-10 pr-12 py-3 bg-slate-900 border rounded-xl text-cyan-100 placeholder:text-cyan-400/50
              focus:outline-none transition
              ${
                hasError
                  ? "border-pink-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                  : isValid
                  ? "border-teal-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  : "border-cyan-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-600/20"
              }
            `}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() =>
                name === "password"
                  ? setShowPassword((s) => !s)
                  : setShowConfirmPassword((s) => !s)
              }
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              tabIndex={-1}
            >
              {(name === "password" ? showPassword : showConfirmPassword) ? (
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
              {isValid && <HiCheckCircle className="h-5 w-5 text-teal-400" />}
            </div>
          )}
        </div>
        {/* Password strength bar */}
        {showPasswordStrength && hasValue && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-cyan-200/70">
                Password strength:
              </span>
              <span className={`text-sm font-bold ${passwordStrength.color}`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.bgColor}`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mt-1">
              <PwCheck done={password?.length >= 8} label="8+ chars" />
              <PwCheck
                done={/[A-Z]/.test(password) && /[a-z]/.test(password)}
                label="Upper & lower"
              />
              <PwCheck done={/\d/.test(password)} label="Numbers" />
              <PwCheck
                done={/[!@#$%^&*(),.?":{}|<>]/.test(password)}
                label="Special chars"
              />
            </div>
          </div>
        )}
        {hasError && (
          <p className="text-sm text-pink-400 flex items-center gap-1">
            <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
            {hasError.message}
          </p>
        )}
      </div>
    );
  };

  function PwCheck({ done, label }) {
    return (
      <div
        className={`flex items-center gap-1 ${
          done ? "text-teal-400" : "text-cyan-400/50"
        }`}
      >
        {done ? (
          <HiCheckCircle className="w-3 h-3" />
        ) : (
          <HiX className="w-3 h-3" />
        )}
        {label}
      </div>
    );
  }

  // Validation rules & helpers
  const handleInputChange = (fieldName) => {
    if (errors[fieldName]) clearErrors(fieldName);
    if (error) clearError();
  };
  const validationRules = {
    username: {
      required: "Username is required",
      minLength: { value: 3, message: "At least 3 characters" },
      maxLength: { value: 30, message: "Less than 30 characters" },
      pattern: {
        value: /^[a-zA-Z0-9_]+$/,
        message: "Only letters, numbers, underscores",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Enter a valid email",
      },
    },
    password: {
      required: "Password is required",
      minLength: { value: 6, message: "At least 6 characters" },
      validate: {
        strength: (value) => {
          if (calculatePasswordStrength(value).score < 2) {
            return "Password is too weak. Add more complexity.";
          }
          return true;
        },
      },
    },
    confirmPassword: {
      required: "Please confirm your password",
      validate: {
        match: (value) => value === password || "Passwords do not match",
      },
    },
    firstName: {
      required: "First name is required",
      minLength: { value: 2, message: "At least 2 characters" },
      pattern: { value: /^[a-zA-Z\s]+$/, message: "Letters only" },
    },
    lastName: {
      required: "Last name is required",
      minLength: { value: 2, message: "At least 2 characters" },
      pattern: { value: /^[a-zA-Z\s]+$/, message: "Letters only" },
    },
  };

  const onSubmit = async (data) => {
    if (!acceptTerms) {
      toast.error("Please accept the Terms of Service to continue.", {
        position: "bottom-right",
        autoClose: 3500,
      });
      return;
    }
    try {
      clearError();
      const { confirmPassword, ...registrationData } = data;
      const result = await signup(registrationData);
      toast.success(`Welcome to our community, ${result.firstName}! 🎉`, {
        position: "bottom-right",
        autoClose: 4000,
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch {
      toast.error("Registration failed. Please try again.", {
        position: "bottom-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-black via-gray-900 to-slate-900">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center mb-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow">
            Create Account
          </h2>
          <p className="mt-2 text-cyan-300/80">
            Join our community and start sharing your stories
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-2xl shadow-2xl bg-slate-900/80 border border-cyan-700 py-8 px-5 md:px-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-pink-400/10 border border-pink-400/20 rounded-xl flex items-center gap-3">
              <HiExclamationCircle className="h-6 w-6 text-pink-400 flex-shrink-0" />
              <div>
                <p className="text-pink-400 font-bold">Registration Failed</p>
                <p className="text-pink-300 text-sm">{error}</p>
              </div>
            </div>
          )}
          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-200 mb-2">
                First Name
              </label>
              <FormInput
                name="firstName"
                placeholder="Your first name"
                icon={HiUser}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-200 mb-2">
                Last Name
              </label>
              <FormInput
                name="lastName"
                placeholder="Your last name"
                icon={HiUser}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">
              Username
            </label>
            <FormInput
              name="username"
              placeholder="Choose a unique username"
              icon={HiUserCircle}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">
              Email Address
            </label>
            <FormInput
              name="email"
              type="email"
              placeholder="Enter your email"
              icon={HiMail}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">
              Password
            </label>
            <FormInput
              name="password"
              type="password"
              placeholder="Create a strong password"
              icon={HiLockClosed}
              showPasswordToggle={true}
              showPasswordStrength={true}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">
              Confirm Password
            </label>
            <FormInput
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              icon={HiShieldCheck}
              showPasswordToggle={true}
            />
          </div>
          {/* Terms */}
          <div className="flex items-start">
            <input
              id="accept-terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 text-teal-500 bg-slate-800 border-cyan-700 rounded focus:ring-teal-500"
            />
            <label
              htmlFor="accept-terms"
              className="ml-3 text-sm text-cyan-200"
            >
              I agree to the&nbsp;
              <button
                type="button"
                className="text-teal-400 hover:text-teal-200 underline"
                tabIndex={-1}
                onClick={() =>
                  toast.info("Terms of Service coming soon!", {
                    position: "bottom-right",
                    autoClose: 2000,
                  })
                }
              >
                Terms of Service
              </button>
              {" and "}
              <button
                type="button"
                className="text-teal-400 hover:text-teal-200 underline"
                tabIndex={-1}
                onClick={() =>
                  toast.info("Privacy Policy coming soon!", {
                    position: "bottom-right",
                    autoClose: 2000,
                  })
                }
              >
                Privacy Policy
              </button>
            </label>
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !isValid || !acceptTerms}
            className={`
              w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow text-white font-bold text-lg transition-all duration-200
              ${
                loading || !isValid || !acceptTerms
                  ? "bg-cyan-900/80 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 hover:scale-[1.02] active:scale-[0.98]"
              }
            `}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <HiUserCircle className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>
        {/* Links */}
        <div className="text-center space-y-2">
          <p className="text-cyan-300/90">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => (window.location.href = "/login")}
              className="text-teal-400 hover:text-teal-200 underline font-medium transition"
            >
              Sign in here
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

export default RegisterForm;

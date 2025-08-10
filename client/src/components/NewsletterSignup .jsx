import { useState } from "react";
import { toast } from "react-toastify";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Email validation regex
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = async () => {
    // Validation
    if (!email.trim()) {
      toast.error("Please enter your email address", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with your actual newsletter subscription logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("🎉 Successfully subscribed to our newsletter!", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setEmail(""); // Clear email input
    } catch (error) {
      toast.error("Subscription failed. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubscribe();
    }
  };

  return (
    <div>
      <h4 className="text-[#EDEDEF] font-medium mb-3 text-sm">Stay Updated</h4>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1 h-9 px-3 rounded-lg bg-[#121214] border border-[#2B2B31] text-[#EDEDEF] text-sm placeholder:text-[#6A6A72] focus:outline-none focus:ring-2 focus:ring-cyan-300/40 focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        />
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="h-9 px-3 rounded-lg bg-cyan-500 text-black font-medium text-sm hover:bg-cyan-400 disabled:bg-cyan-600 disabled:cursor-not-allowed transition-colors relative"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Subscribing...</span>
            </div>
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
    </div>
  );
};

export default NewsletterSignup;

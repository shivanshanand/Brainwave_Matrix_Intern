import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Star,
  ChevronDown,
  DollarSign,
  PieChart,
  Bell,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import MainFooter from "../components/footer/MainFooter";

const Welcome = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Expenses Tracked", value: "₹2.5Cr+", icon: DollarSign },
    { label: "Money Saved", value: "₹45L+", icon: TrendingUp },
    { label: "User Rating", value: "4.9★", icon: Star },
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Insights",
      description:
        "Get intelligent spending recommendations and automated categorization",
    },
    {
      icon: PieChart,
      title: "Smart Analytics",
      description:
        "Visual reports and trends to understand your spending patterns",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description:
        "Your financial data is encrypted and protected with industry standards",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Get alerts for budget limits, unusual spending, and bill reminders",
    },
    {
      icon: Smartphone,
      title: "Cross-Platform",
      description: "Access your expenses anywhere - web, mobile, or desktop",
    },
    {
      icon: TrendingUp,
      title: "Goal Tracking",
      description:
        "Set and achieve your financial goals with personalized insights",
    },
  ];

  const reviews = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      review:
        "FinSight helped me save ₹30,000 in just 3 months by showing where my money was going. The AI insights are spot-on!",
      rating: 5,
    },
    {
      name: "Rahul Verma",
      location: "Bangalore",
      review:
        "Best expense tracker I've used. The dark theme is easy on the eyes and the analytics are incredibly detailed.",
      rating: 5,
    },
    {
      name: "Anjali Patel",
      location: "Delhi",
      review:
        "Finally, an expense tracker that understands Indian spending patterns. The categorization is perfect!",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Is my financial data secure?",
      answer:
        "Yes, we use bank-level encryption and never store your banking credentials. Your data is encrypted both in transit and at rest.",
    },
    {
      question: "Can I use this for business expenses?",
      answer:
        "Absolutely! FinSight supports both personal and business expense tracking with separate categories and reporting.",
    },
    {
      question: "Does it work with Indian banks?",
      answer:
        "Yes, we support all major Indian banks and payment methods including UPI, credit cards, and digital wallets.",
    },
    {
      question: "Is there a mobile app?",
      answer:
        "Currently, we offer a web-based platform that works perfectly on mobile browsers. A dedicated mobile app is coming soon!",
    },
    {
      question: "How does the AI categorization work?",
      answer:
        "Our AI analyzes your transaction descriptions, merchant names, and spending patterns to automatically categorize expenses with 95% accuracy.",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#0B0B0C]">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-violet-500/5 to-transparent"></div>

          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-32">
            <div className="text-center">
              {/* Badge */}
              <div className="mx-auto mb-6 w-fit">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#26262B] bg-[#121214] text-[#B3B3B8] text-sm">
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
                  AI-Powered Expense Tracking
                </span>
              </div>

              {/* Main heading */}
              <h1 className="text-5xl sm:text-7xl font-bold text-[#EDEDEF] mb-6 leading-tight">
                Take Control of Your
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  Financial Future
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-[#B3B3B8] mb-8 max-w-2xl mx-auto leading-relaxed">
                Track expenses, analyze spending patterns, and make smarter
                financial decisions with AI-powered insights designed for modern
                India.
              </p>

              {/* Creator credit */}
              <p className="text-sm text-[#8A8A92] mb-10">
                Built with ❤️ by{" "}
                <span className="text-cyan-400 font-semibold">
                  Shivansh Anand
                </span>
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="h-12 px-8 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-all inline-flex items-center justify-center"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("features")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="h-12 px-8 rounded-xl border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] focus:outline-none focus:ring-2 focus:ring-cyan-300/40 transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-[#26262B]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-[#121214] border border-[#26262B] grid place-items-center">
                    <stat.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-bold text-[#EDEDEF] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#8A8A92]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#EDEDEF] mb-4">
                Why Choose FinSight?
              </h2>
              <p className="text-xl text-[#B3B3B8] max-w-2xl mx-auto">
                Everything you need to take control of your finances in one
                intelligent platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-[#121214] border border-[#26262B] p-6 hover:border-[#2F2F36] transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-[#1E1E22] grid place-items-center mb-4">
                    <feature.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#EDEDEF] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#B3B3B8] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-20 bg-[#121214]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#EDEDEF] mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-xl text-[#B3B3B8]">
                See what our users are saying about their experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-[#0B0B0C] border border-[#26262B] p-6"
                >
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-[#EDEDEF] mb-4 leading-relaxed">
                    "{review.review}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 grid place-items-center text-black font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#EDEDEF]">
                        {review.name}
                      </div>
                      <div className="text-xs text-[#8A8A92]">
                        {review.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#EDEDEF] mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-[#B3B3B8]">
                Everything you need to know about FinSight
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-[#121214] border border-[#26262B] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#17171A] transition-colors"
                  >
                    <span className="text-[#EDEDEF] font-semibold">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#8A8A92] transition-transform ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 border-t border-[#26262B]">
                      <p className="text-[#B3B3B8] pt-4 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <MainFooter />
    </>
  );
};

export default Welcome;

import { useState } from "react";
import { HiChevronDown, HiQuestionMarkCircle } from "react-icons/hi";
import { toast } from "react-toastify";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const faqs = [
    {
      id: 1,
      question: "How do I get started with the platform?",
      answer:
        "Getting started is simple! Just sign up for a free account, customize your profile, and you can immediately start writing your first article using our intuitive editor. We also provide onboarding guides to help you make the most of all features.",
    },
    {
      id: 2,
      question: "Is the platform free to use?",
      answer:
        "Yes! We offer a generous free tier that includes unlimited articles, basic analytics, and community features. We also have premium plans with advanced analytics, priority support, and additional customization options for professional creators.",
    },
    {
      id: 3,
      question: "Can I import my existing content?",
      answer: "Not yet. Will soon be launching this feature. Stay tuned!",
    },
    {
      id: 4,
      question: "How does the community and networking work?",
      answer:
        "Our platform includes follow systems, commenting and article reactions. You can discover creators in your niche, engage with their content, and build meaningful professional relationships. We also host virtual events and writing challenges.",
    },
    {
      id: 5,
      question: "What kind of analytics do you provide?",
      answer:
        "We provide comprehensive analytics including view counts, engagement metrics, reader demographics, and reading time. Premium users get advanced insights like conversion tracking, A/B testing for headlines, and detailed audience analysis.",
    },
    {
      id: 6,
      question: "Can I monetize my content?",
      answer:
        "Not yet! But will offer multiple monetization options including reader subscriptions, one-time tips, sponsored content tools, and affiliate link integration. You keep 90% of subscription revenue with just a 10% platform fee.",
    },
    {
      id: 7,
      question: "Is my content safe and backed up?",
      answer:
        "Security is our top priority. All content is automatically backed up across multiple data centers, encrypted at rest and in transit. You can also export your data at any time. We maintain 99.9% uptime with enterprise-grade infrastructure.",
    },
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const handleContactSupport = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("❌ Please enter a valid email address.");
      return;
    }
    if (message.trim().length < 10) {
      toast.error("✍️ Please enter at least 10 characters in your message.");
      return;
    }

    // 🔥 Here you would actually send the data to your backend / API
    toast.success("📨 Support request sent! We'll contact you soon.");
    setEmail("");
    setMessage("");
  };

  return (
    <section className="py-20 bg-gradient-to-b from-neutral-950 via-black to-neutral-950 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full px-6 py-3 border border-purple-500/20 mb-6">
            <HiQuestionMarkCircle className="w-6 h-6 text-purple-400" />
            <span className="text-purple-300 font-semibold">
              Got questions?
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our platform, features, and
            how to get the most out of your writing experience.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-gradient-to-br from-neutral-900/50 to-black/50 backdrop-blur-xl rounded-2xl border border-neutral-800/50 overflow-hidden transition-all duration-300 hover:border-purple-500/30"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-neutral-800/20 transition-all duration-200"
                onClick={() => toggleFAQ(faq.id)}
              >
                <h3 className="text-lg font-semibold text-white pr-8">
                  {faq.question}
                </h3>
                <div
                  className={`transform transition-transform duration-200 ${
                    openFAQ === faq.id ? "rotate-180" : ""
                  }`}
                >
                  <HiChevronDown className="w-6 h-6 text-purple-400" />
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  openFAQ === faq.id
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="px-8 pb-6">
                  <div className="border-t border-neutral-800/50 pt-6">
                    <p className="text-neutral-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-neutral-900/80 to-black/80 backdrop-blur-xl rounded-3xl p-8 border border-neutral-800/50 max-w-lg mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-neutral-300 mb-6">
              Our support team is here to help you succeed on our platform.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full mb-4 px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              rows={4}
              className="w-full mb-4 px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
            />
            <button
              onClick={handleContactSupport}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

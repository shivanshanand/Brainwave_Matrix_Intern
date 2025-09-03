import FAQSection from "../components/Home/FAQSection";
import FeaturedContentSection from "../components/Home/FeaturedContentSection";
import Footer from "../components/Home/Footer";
import HeroSection from "../components/Home/HeroSection";
import Navbar from "../components/Common/Navbar";
import ReviewsSection from "../components/Home/ReviewsSection";
import StatsSection from "../components/Home/StatsSection";

const Home = () => (
  <>
    <Navbar />
    <HeroSection />
    <StatsSection />
    <FeaturedContentSection />
    <ReviewsSection />
    <FAQSection />
    <Footer />
  </>
);

export default Home;

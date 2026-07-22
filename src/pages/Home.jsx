import MainLayout from "../layout/MainLayout"
import HeroSectionV2 from "../components/HeroSectionV2";
import AboutSection from "../components/AboutSection"
import ParallaxQuote from "../components/ParallaxQuote";
import FlowSection from "../components/FlowSection";
import ThemesSection from "../components/ThemesSection";
import JournalSection from "../components/JournalSection";
import QuoteSection from "../components/QuoteSection";
import FounderSection from "../components/FounderSection";

import GallerySection from "../components/GallerySection";
import Footer from "../components/Footer";
import JournalShowcase from "../components/JournalShowcase";
import TestimonialsSection from "../components/TestimonialsSection";
import ShowReviews from "../components/reviews/ShowReviews";
const Home = () => {
  return (
<>
    <MainLayout/>
     
    <HeroSectionV2/>
    <GallerySection />
    <AboutSection />
    <FlowSection />
    <ParallaxQuote />
    <ThemesSection />
    <QuoteSection />
    <JournalSection />
    <FounderSection />
    <ShowReviews />
    <TestimonialsSection />
    <JournalShowcase />
    <Footer />
    </>
  )
}

export default Home
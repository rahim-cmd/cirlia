import { motion } from "framer-motion"
import MainLayout from "../layout/MainLayout"
import HeroSectionV2 from "../components/HeroSectionV2";
import Container from "../components/Container"
import AboutSection from "../components/AboutSection"
import FlowSection from "../components/FlowSection";
import ThemesSection from "../components/ThemesSection";
import JournalSection from "../components/JournalSection";
import QuoteSection from "../components/QuoteSection";
import FounderSection from "../components/FounderSection";
import NewsletterSection from "../components/NewsletterSection";
import Footer from "../components/Footer";
const Home = () => {
  return (
<>
    <MainLayout/>

  <HeroSectionV2/>
    <AboutSection />
    <FlowSection />
    <ThemesSection />
    <QuoteSection />

<JournalSection />
<FounderSection />

<NewsletterSection />

<Footer />
    </>
  )
}

export default Home
import MainLayout from "../layout/MainLayout";

import AboutHero from "../components/about/AboutHero";
import WhyCirclia from "../components/about/WhyCirclia";
import FounderStory from "../components/about/FounderStory";
import Footer from "../components/Footer";
import ValuesSection from "../components/about/ValuesSection";
import VisionSection from "../components/about/VisionSection";
import FinalCTA from "../components/about/FinalCTA";

const AboutPage = () => {
  return (
    <MainLayout>

      <AboutHero />

      <WhyCirclia />

      <FounderStory />
      <ValuesSection/>
<VisionSection/>
< FinalCTA/>
        <Footer/>
    </MainLayout>
  );
};

export default AboutPage;
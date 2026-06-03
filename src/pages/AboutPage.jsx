import MainLayout from "../layout/MainLayout";

import AboutHero from "../components/about/AboutHero";
import WhyCirclia from "../components/about/WhyCirclia";
import FounderStory from "../components/about/FounderStory";
import Footer from "../components/Footer";

const AboutPage = () => {
  return (
    <MainLayout>

      <AboutHero />

      <WhyCirclia />

      <FounderStory />

        <Footer/>
    </MainLayout>
  );
};

export default AboutPage;
import MainLayout from "../layout/MainLayout";
import JournalHero from "../components/journal/JournalHero";
import JournalPreview from "../components/journal/JournalPreview";
import JournalBenefits from "../components/journal/JournalBenefits";
import JournalCTA from "../components/journal/JournalCTA";
import Footer from "../components/Footer";

const JournalPage = () => {
  return (
    <MainLayout>

      <JournalHero />

      <JournalPreview />

      <JournalBenefits />

      <JournalCTA />
    <Footer/>
    </MainLayout>
  );
};

export default JournalPage;
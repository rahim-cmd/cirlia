import MainLayout from "../layout/MainLayout";
import JournalHero from "../components/journal/JournalHero";
import JournalPreview from "../components/journal/JournalPreview";
import JournalBenefits from "../components/journal/JournalBenefits";
import JournalShowcase from "../components/JournalShowcase";
import Footer from "../components/Footer";

const JournalPage = () => {
  return (
    <MainLayout>

      <JournalHero />

      <JournalPreview />

      <JournalBenefits />

      <JournalShowcase />
    <Footer/>
    </MainLayout>
  );
};

export default JournalPage;
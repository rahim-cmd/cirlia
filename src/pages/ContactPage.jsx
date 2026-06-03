import MainLayout from "../layout/MainLayout";

import ContactHero from "../components/contact/ContactHero";
import ContactFormSection from "../components/contact/ContactFormSection";
import ContactFAQ from "../components/contact/ContactFAQ";
import Footer from "../components/Footer";

const ContactPage = () => {
  return (
    <MainLayout>

      <ContactHero />

      <ContactFormSection />

      <ContactFAQ />
    < Footer/>
    </MainLayout>
  );
};

export default ContactPage;
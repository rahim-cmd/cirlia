import { useEffect } from "react"
import Lenis from "lenis"
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import JournalPage from "./pages/JournalPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import ScrollToTop from "./components/ScrollToTop";
import { usePopup } from "./context/PopupContext";
import JournalPopup from "./components/JournalPopup";


function App() {

  const { openPopup } = usePopup();

useEffect(() => {
  const timer = setTimeout(() => {
    openPopup();
  }, 3000);

  return () => clearTimeout(timer);
}, []);

  useEffect(() => {

    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

  }, [])

  return (
     
    <>
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/about"
        element={<AboutPage />}
      />

      <Route
  path="/journal"
  element={<JournalPage />}
/>
<Route
  path="/contact"
  element={<ContactPage />}
/>

  <Route
  path="/privacy-policy"
  element={<PrivacyPolicyPage />}
/>

<Route
  path="/terms-and-conditions"
  element={<TermsPage />}
/>
    </Routes>
<JournalPopup />
    </>
  )
}

export default App
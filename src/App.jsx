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
function App() {

  useEffect(() => {

    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

  }, [])

  return (
     
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
  )
}

export default App
import { useEffect } from "react"
import Lenis from "lenis"
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";

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

    </Routes>
  )
}

export default App
import { useEffect } from "react"
import Lenis from "lenis"

import Home from "./pages/Home"

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
    <Home />
  )
}

export default App
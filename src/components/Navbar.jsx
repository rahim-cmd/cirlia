import { motion } from "framer-motion"

const Navbar = () => {
  return (

    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="fixed top-0 left-0 w-full z-50"
    >

      <div className="max-w-7xl mx-auto px-6 py-6">

        <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-full px-8 py-4 flex items-center justify-between shadow-lg">

          <h1
            className="text-2xl tracking-[4px]"
            style={{
              fontFamily: 'Cormorant Garamond, serif'
            }}
          >
            Circlia
          </h1>

          <div className="hidden md:flex items-center gap-10 text-sm tracking-wide">

            <a href="#" className="hover:opacity-60 transition">
              Home
            </a>

            <a href="#" className="hover:opacity-60 transition">
              About
            </a>

            <a href="#" className="hover:opacity-60 transition">
              Journal
            </a>

          </div>

          <button
            className="px-6 py-3 rounded-full text-white text-sm"
            style={{
              backgroundColor: 'var(--color-sage)'
            }}
          >
            Join Circle
          </button>

        </div>

      </div>

    </motion.nav>

  )
}

export default Navbar
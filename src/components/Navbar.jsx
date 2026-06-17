import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import Button from "./Button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* NAVBAR */}

      <header
      
         className="
  fixed
  top-5
  
  left-1/2
  -translate-x-1/2
  z-50
  w-[95%]
  max-w-7xl
  "
      >
        <div
          className="
          rounded-full
          px-6
          lg:px-8
          py-4
          transition-all
          duration-500
          
          "
          style={{
            backdropFilter: "blur(25px)",
            background: scrolled
              ? "rgba(255,255,255,.70)"
              : "rgba(255,255,255,.35)",

            border: "1px solid rgba(255,255,255,.40)",

            boxShadow: scrolled
              ? "0 12px 40px rgba(0,0,0,.10)"
              : "0 8px 30px rgba(0,0,0,.06)",
            
          }}
        >
          <div
            className="
            flex
            items-center
            justify-between
            "
          >
            {/* LOGO */}

            <Logo />

            {/* DESKTOP */}

            <nav

            
              className="
              hidden
              lg:flex
              items-center
              gap-10
              
              "
            >
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/journal">Journal</Link>
              <Link to="/contact">Contact</Link>
            </nav>

            <div
              className="
              hidden
              lg:block
              "
            >
              <Button>
                <Link to="/contact">Join A Circle</Link>
              </Button>
            </div>

            {/* MOBILE MENU */}

            <button onClick={() => setOpen(true)} className="lg:hidden">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
            fixed
            inset-0
            z-[99]
            "
            style={{
              backdropFilter: "blur(30px)",
              background: "rgba(248,243,238,.95)",
            }}
          >
            {/* CLOSE */}

            <div
              className="
              flex
              justify-end
              p-8
              
              "
            >
              <button onClick={() => setOpen(false)}>
                <X size={32} />
              </button>
            </div>

            {/* MENU LINKS */}

            <div
              className="
              h-full
              flex
              flex-col
              items-center
              justify-center
              gap-8
              -mt-20
              "
            >
              <Link to="/">Home</Link>

              <Link to="/about">About</Link>

              <Link to="/Journal">Journal</Link>

              <Link to="/contact">Contact</Link>

              <div className="mt-6">
                <Button>
                  <Link to="/contact">Join A Circle</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

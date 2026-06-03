import { Link } from "react-router-dom";
import Container from "./Container";
import Logo from "./Logo";
const Footer = () => {
  return (
    <footer className="py-20 text-white"   style={{ background: "var(--color-sage)" }}>

      <Container>

        <div className="border-t border-white/10 pt-16">

          <div className="text-center">

            <h2
              className="text-5xl mb-6"
              style={{
                fontFamily:
                  "Cormorant Garamond, serif"
              }}
            >
              <Logo/>
              Circlia
            </h2>

            <p className="opacity-70">
              A space for women to connect
            </p>

            <div className="flex justify-center gap-10 mt-10">

              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/journal">Journal</Link>
              <Link to="/contact">Contact</Link>

            </div>

          </div>

        </div>

      </Container>

    </footer>
  );
};

export default Footer;
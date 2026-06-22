import { Link } from "react-router-dom";
import Container from "./Container";

const Footer = () => {
  return (
    <footer
      className="py-20 text-white"
      style={{ background: "var(--color-sage)" }}
    >
      <Container>
        <div className="border-t border-white/10 pt-16">
          <div className="text-center">
            <h2
              className="text-5xl mb-6"
              style={{
                fontFamily: "Cormorant Garamond, serif",
              }}
            >
              Circlia
            </h2>

            <p className="opacity-70">A space for women to connect</p>

            <div
              className="
  flex
  flex-wrap
  justify-center
  gap-x-8
  gap-y-4
  mt-10
  px-4
  "
            >
              <Link to="/" className="hover:opacity-70 transition">
                Home
              </Link>

              <Link to="/about" className="hover:opacity-70 transition">
                About
              </Link>

              <Link to="/journal" className="hover:opacity-70 transition">
                Journal
              </Link>

              <Link to="/contact" className="hover:opacity-70 transition">
                Contact
              </Link>

              <Link
                to="/privacy-policy"
                className="hover:opacity-70 transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-and-conditions"
                className="hover:opacity-70 transition"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
           <div className="text-center m-10 text-md">
            ZOOM TIMES 'FRIDAYS' 7-8:30pm - UK TIME <br/>
            <div className="m-5 p-3">
            Write us :-<Link to="mailto:hello.circlia@gmail.com
">hello.circlia@gmail.com</Link>   or Whatsapp Call:-<Link to="tel:+44 7732737703 ">+44 7732737703 </Link>       </div>
          </div>
          <div className="text-center m-10 text-sm">
            Copyright 2026. Design & Developed by Cirlcia.uk
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

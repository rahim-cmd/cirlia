import Container from "./Container";

const Footer = () => {
  return (
    <footer className="py-20 text-white"   style={{ background: "var(--color-sage)" }}>

      <Container>

        <div className="border-t border-black/10 pt-16">

          <div className="text-center">

            <h2
              className="text-5xl mb-6"
              style={{
                fontFamily:
                  "Cormorant Garamond, serif"
              }}
            >
              Circlia
            </h2>

            <p className="opacity-70">
              A space for women to connect
            </p>

            <div className="flex justify-center gap-10 mt-10">

              <a href="#">Home</a>
              <a href="#">About</a>
              <a href="#">Journal</a>

            </div>

          </div>

        </div>

      </Container>

    </footer>
  );
};

export default Footer;
import Container from "./Container";

const QuoteSection = () => {
  return (

    <section className="py-40">

      <Container>

        <div className="max-w-5xl mx-auto text-center">

          <h2
            className="text-5xl md:text-8xl leading-tight"
            style={{
              fontFamily:
                "Cormorant Garamond, serif"
            }}
          >

            The intention is
            <br />

            not self-improvement,
            <br />

            but presence,
            <br />

            creativity &
            connection.

          </h2>

        </div>

      </Container>

    </section>

  );
};

export default QuoteSection;
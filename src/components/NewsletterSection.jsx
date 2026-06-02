import Container from "./Container";

const NewsletterSection = () => {
  return (
    <section className="py-40">

      <Container>

        <div
          className="rounded-[50px] p-12 md:p-20 text-center"
          style={{
            background:
              "rgba(255,255,255,.35)",
            backdropFilter: "blur(20px)",
            border:
              "1px solid rgba(255,255,255,.3)"
          }}
        >

          <p
            className="uppercase tracking-[6px] text-sm mb-4"
            style={{
              color: "var(--color-sage)"
            }}
          >
            A Gift For Mothers
          </p>

          <h2
            className="text-5xl md:text-7xl mb-8"
            style={{
              fontFamily:
                "Cormorant Garamond, serif"
            }}
          >
            Receive The
            <br />
            Gifted Journal
          </h2>

          <p className="max-w-3xl mx-auto leading-10 opacity-80 mb-10">

            Receive a hand-painted prenatal reflection
            journal created as a gentle offering for
            women moving through pregnancy.

          </p>

          <div className="max-w-xl mx-auto flex flex-col md:flex-row gap-4">

            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 rounded-full outline-white"
            />

            <button
              className="px-8 py-4 rounded-full text-white"
              style={{
                backgroundColor:
                  "var(--color-sage)"
              }}
            >
              Receive Journal
            </button>

          </div>

        </div>

      </Container>

    </section>
  );
};

export default NewsletterSection;
import Button from "../Button";

const JournalCTA = () => {
  return (
    <section className="pb-32">

      <div className="max-w-4xl mx-auto px-6">

        <div
          className="
          bg-white/70
          backdrop-blur-xl
          rounded-[40px]
          p-12
          shadow-xl
          text-center
          "
        >

          <h2
            className="
            text-5xl
            mb-6
            "
            style={{
              fontFamily:
                "Cormorant Garamond, serif"
            }}
          >
            Receive Your Journal
          </h2>

          <p
            className="
            mb-8
            opacity-80
            "
          >
            Enter your email and receive
            your complimentary copy.
          </p>

          <input
            type="email"
            placeholder="Your Email Address"
            className="
            w-full
            p-5
            rounded-full
            border
            mb-5
            "
          />

          <Button>
            Receive Journal
          </Button>

        </div>

      </div>

    </section>
  );
};

export default JournalCTA;
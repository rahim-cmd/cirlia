import { Link } from "react-router-dom";
import Button from "../Button";

const FinalCTA = () => {
  return (
    <section className="pb-32">

      <div className="max-w-5xl mx-auto px-6">

        <div
          className="
          bg-white/70
          backdrop-blur-xl
          rounded-[50px]
          p-16
          text-center
          shadow-xl
          "
        >

          <h2
            className="
            text-5xl
            md:text-7xl
            mb-8
            "
            style={{
              fontFamily: "Cormorant Garamond, serif"
            }}
          >
            Ready To Begin?
          </h2>

          <p
            className="
            text-lg
            leading-8
            max-w-2xl
            mx-auto
            mb-10
            opacity-80
            "
          >
            Start with our complimentary reflection journal
            or get in touch to learn more about future circles.
          </p>

          <div className="flex flex-wrap justify-center gap-5">

            <Button>
              Receive Journal
            </Button>

            <Link
              to="/contact"
              className="
              px-8
              py-4
              rounded-full
              border
              border-[#8B6B5C]
              "
            >
              Contact Us
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
};

export default FinalCTA;
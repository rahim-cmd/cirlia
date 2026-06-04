import { motion } from "framer-motion";
import Button from "../Button";

const ContactFormSection = () => {
  return (
    <section className="pb-32">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* IMAGE */}

          <motion.div
            whileHover={{
              y: -10
            }}
          >
            <img
              src="/images/contact.jpg"
              alt="Founder"
              className="
              w-full
              rounded-[40px]
              shadow-2xl
              "
            />
          </motion.div>

          {/* FORM */}

          <div
            className="
            bg-white/70
            backdrop-blur-xl
            rounded-[40px]
            p-10
            shadow-xl
            "
          >

            <h2
              className="
              text-4xl
              mb-8
              "
              style={{
                fontFamily:
                  "Cormorant Garamond, serif"
              }}
            >
              Send A Message
            </h2>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Your Name"
                className="
                w-full
                p-5
                rounded-full
                border
                "
              />

              <input
                type="email"
                placeholder="Your Email"
                className="
                w-full
                p-5
                rounded-full
                border
                "
              />

              <textarea
                rows="6"
                placeholder="Your Message"
                className="
                w-full
                p-5
                rounded-[25px]
                border
                "
              />

              <Button>
                Send Message
              </Button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default ContactFormSection;
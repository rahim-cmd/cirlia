import { motion } from "framer-motion";

const GallerySection = () => {
  return (
    <section className="py-40 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-24">

          <p
            className="uppercase tracking-[8px] text-sm mb-4"
            style={{
              color: "var(--color-brown)"
            }}
          >
            Moments Of Connection
          </p>

          <h2
            className="text-5xl md:text-7xl"
            style={{
              fontFamily: "Cormorant Garamond, serif"
            }}
          >
            Gathering Through
            <br />
            Reflection & Presence
          </h2>

        </div>

        <div className="grid lg:grid-cols-12 gap-8">

          <motion.div
            whileHover={{ y: -15 }}
            className="
            lg:col-span-5
            overflow-hidden
            rounded-[40px]
            "
          >
            <img
              src="/images/gallery1.jpg"
              className="
              w-full
              h-[650px]
              object-cover
              transition-all
              duration-700
              hover:scale-110
              "
            />
          </motion.div>

          <div className="lg:col-span-7 grid gap-8">

            <motion.div
              whileHover={{ y: -15 }}
              className="
              overflow-hidden
              rounded-[40px]
              "
            >
              <img
                src="/images/gallery2.png"
                className="
                w-full
                h-[300px]
                object-cover
                transition-all
                duration-700
                hover:scale-110
                "
              />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">

              <motion.div
                whileHover={{ y: -15 }}
                className="
                overflow-hidden
                rounded-[40px]
                "
              >
                <img
                  src="/images/med.jpg"
                  className="
                  w-full
                  h-[320px]
                  object-cover
                  transition-all
                  duration-700
                  hover:scale-110
                  "
                />
              </motion.div>

              <motion.div
                whileHover={{ y: -15 }}
                className="
                overflow-hidden
                rounded-[40px]
                "
              >
                <img
                  src="/images/gallery4.jpg"
                  className="
                  w-full
                  h-[320px]
                  object-cover
                  transition-all
                  duration-700
                  hover:scale-110
                  "
                />
              </motion.div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default GallerySection;
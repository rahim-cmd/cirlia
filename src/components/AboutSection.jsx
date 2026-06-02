import { motion } from "framer-motion"
import Container from "./Container"
const AboutSection = () => {
  return (
<>
    
    <section className="py-40 relative overflow-hidden">

      {/* Floating Blur */}

      <div className="absolute left-[-100px] top-[20%] w-[300px] h-[300px] rounded-full bg-[#D8B4A0]/20 blur-3xl"></div>

      <Container>

        <div className="grid md:grid-cols-2 gap-20 items-center">

          {/* Left Side */}

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >

            <p
              className="uppercase tracking-[6px] text-sm mb-6"
              style={{
                color: 'var(--color-sage)'
              }}
            >
              About Circlia
            </p>

            <h2
              className="text-5xl md:text-7xl leading-tight mb-10"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                color: 'var(--color-textDark)'
              }}
            >
              A reflective
              <br />
              creative space
              <br />
              for women
            </h2>

          </motion.div>

          {/* Right Side */}

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >

            <p
              className="text-lg leading-10 mb-8"
              style={{
                color: 'rgba(75,64,58,0.8)'
              }}
            >

              Circlia is a reflective space for women
              to slow down, gather, and reconnect
              through visual meditation, journaling,
              and shared reflection.

            </p>

            <p
              className="text-lg leading-10"
              style={{
                color: 'rgba(75,64,58,0.8)'
              }}
            >

              Each circle is designed as a gentle inward
              journey combining guided visual meditations,
              themed journaling prompts, optional sharing,
              and grounding practices.

            </p>

          </motion.div>

        </div>

      </Container>

    </section>
  </>  

  )
}

export default AboutSection
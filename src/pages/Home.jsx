import { motion } from "framer-motion"
import MainLayout from "../layout/MainLayout"
import Container from "../components/Container"
import AboutSection from "../components/AboutSection"
import FlowSection from "../components/FlowSection";
import ThemesSection from "../components/ThemesSection";
import JournalSection from "../components/JournalSection";
import QuoteSection from "../components/QuoteSection";
import FounderSection from "../components/FounderSection";
import NewsletterSection from "../components/NewsletterSection";
import Footer from "../components/Footer";
const Home = () => {
  return (
<>
    <MainLayout>

      <section className="min-h-screen flex items-center relative overflow-hidden">

        {/* Floating Element */}

        <motion.div
          animate={{
            y: [0, -20, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 6
          }}
          className="absolute top-[20%] left-[10%] w-32 h-32 rounded-full border border-white/30 backdrop-blur-xl"
        />

        <Container className="pt-40 pb-20 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="max-w-5xl"
          >

            <p
              className="uppercase tracking-[8px] text-sm mb-8"
              style={{
                color: 'var(--color-sage)'
              }}
            >
              A Reflective Space
            </p>

            <h1
              className="text-6xl md:text-8xl leading-[0.95] mb-10"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                color: 'var(--color-textDark)'
              }}
            >

              A space
              <br />

              for women
              <br />

              to connect

            </h1>

            <p
              className="max-w-2xl text-lg md:text-xl leading-10"
              style={{
                color: 'rgba(75,64,58,0.8)'
              }}
            >

              Visual meditation, reflective journaling,
              and women’s circles designed to create
              space for inner connection, creativity,
              and shared presence.

            </p>

            <div className="mt-14 flex flex-col md:flex-row gap-5">

              <button
                className="px-8 py-4 rounded-full text-white hover:scale-105 transition-all duration-500"
                style={{
                  backgroundColor: 'var(--color-sage)'
                }}
              >
                Join a Circle
              </button>

              <button
                className="px-8 py-4 rounded-full border hover:bg-white/40 transition-all duration-500"
                style={{
                  borderColor: 'rgba(75,64,58,0.2)'
                }}
              >
                Receive Free Journal
              </button>

            </div>

          </motion.div>

        </Container>

      </section>

    </MainLayout>
    <AboutSection />
    <FlowSection />
    <ThemesSection />
    <QuoteSection />

<JournalSection />
<FounderSection />

<NewsletterSection />

<Footer />
    </>
  )
}

export default Home
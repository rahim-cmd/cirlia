import Footer from "../components/Footer";
import MainLayout from "../layout/MainLayout";

const PrivacyPolicyPage = () => {
  return (
    <MainLayout>

      <section className="pt-52 pb-24 text-center">
        <div className="max-w-4xl mx-auto px-6">

          <p className="uppercase tracking-[8px] text-sm mb-6 text-[#8B6B5C]">
            Legal
          </p>

          <h1
            className="text-6xl md:text-8xl"
            style={{
              fontFamily: "Cormorant Garamond, serif"
            }}
          >
            Privacy Policy
          </h1>

        </div>
      </section>

      <section className="pb-32">

        <div
          className="
          max-w-5xl
          mx-auto
          px-6
          "
        >

          <div
            className="
            bg-white/70
            backdrop-blur-xl
            rounded-[40px]
            p-10
            shadow-xl
            space-y-10
            "
          >

            <div>
              <h2 className="text-3xl mb-4">
                Information We Collect
              </h2>

              <p className="opacity-80 leading-8">
                We may collect your name, email address
                and any information voluntarily submitted
                through forms on this website.
              </p>
            </div>

            <div>
              <h2 className="text-3xl mb-4">
                How We Use Information
              </h2>

              <p className="opacity-80 leading-8">
                Information may be used to deliver the
                Reflection Journal, respond to inquiries,
                provide updates and improve our services.
              </p>
            </div>

            <div>
              <h2 className="text-3xl mb-4">
                Data Protection
              </h2>

              <p className="opacity-80 leading-8">
                We take reasonable measures to protect
                personal information and maintain its
                confidentiality.
              </p>
            </div>

            <div>
              <h2 className="text-3xl mb-4">
                Third Parties
              </h2>

              <p className="opacity-80 leading-8">
                We do not sell, rent or share personal
                information with third parties for
                marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="text-3xl mb-4">
                Contact
              </h2>

              <p className="opacity-80 leading-8">
                For privacy-related questions,
                please use our contact page.
              </p>
            </div>

          </div>

        </div>

      </section>
< Footer/>
    </MainLayout>
  );
};

export default PrivacyPolicyPage;
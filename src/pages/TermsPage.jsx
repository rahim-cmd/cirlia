import MainLayout from "../layout/MainLayout";

const TermsPage = () => {
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
            Terms &
            <br />
            Conditions
          </h1>

        </div>

      </section>

      <section className="pb-32">

        <div className="max-w-5xl mx-auto px-6">

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
                Acceptance Of Terms
              </h2>

              <p className="opacity-80 leading-8">
                By accessing this website,
                you agree to these terms and conditions.
              </p>
            </div>

            <div>
              <h2 className="text-3xl mb-4">
                Website Content
              </h2>

              <p className="opacity-80 leading-8">
                All content is provided for informational
                and educational purposes only.
              </p>
            </div>

            <div>
              <h2 className="text-3xl mb-4">
                Journal Usage
              </h2>

              <p className="opacity-80 leading-8">
                The Reflection Journal is intended for
                personal, non-commercial use.
              </p>
            </div>

            <div>
              <h2 className="text-3xl mb-4">
                Intellectual Property
              </h2>

              <p className="opacity-80 leading-8">
                Content, branding and materials on this
                website remain the property of Circlia.
              </p>
            </div>

            <div>
              <h2 className="text-3xl mb-4">
                Future Services
              </h2>

              <p className="opacity-80 leading-8">
                Additional services, events or offerings
                may be introduced in the future and may
                be subject to separate terms.
              </p>
            </div>

          </div>

        </div>

      </section>

    </MainLayout>
  );
};

export default TermsPage;
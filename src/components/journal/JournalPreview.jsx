const JournalPreview = () => {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          <div>

            <div
              className="
              bg-[#FBF6F2]
              border
              border-[#E8DDD5]
              rounded-[40px]
              h-[650px]
              flex
              items-center
              justify-center
              shadow-xl
              "
            >

              <div className="text-center">

                <p className="uppercase tracking-[6px] mb-4">
                  Circlia
                </p>

                <h2
                  className="text-6xl"
                  style={{
                    fontFamily:
                      "Cormorant Garamond, serif"
                  }}
                >
                  Reflection
                  <br />
                  Journal
                </h2>

              </div>

            </div>

          </div>

          <div>

            <h2
              className="
              text-5xl
              mb-8
              "
              style={{
                fontFamily:
                  "Cormorant Garamond, serif"
              }}
            >
              What's Inside?
            </h2>

            <div className="space-y-6 text-lg">

              <p>✦ Guided reflection prompts</p>

              <p>✦ Self-discovery exercises</p>

              <p>✦ Creative journaling pages</p>

              <p>✦ Mindfulness practices</p>

              <p>✦ Space for personal insights</p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default JournalPreview;
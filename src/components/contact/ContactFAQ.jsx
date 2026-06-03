const ContactFAQ = () => {
  return (
    <section className="pb-32">

      <div className="max-w-4xl mx-auto px-6">

        <h2
          className="
          text-center
          text-5xl
          mb-16
          "
          style={{
            fontFamily:
              "Cormorant Garamond, serif"
          }}
        >
          Frequently Asked Questions
        </h2>

        <div className="space-y-10">

          <div>
            <h3 className="text-2xl mb-3">
              Is the journal free?
            </h3>

            <p className="opacity-80">
              Yes, the Reflection Journal is currently offered as a complimentary resource.
            </p>
          </div>

          <div>
            <h3 className="text-2xl mb-3">
              Are circles available now?
            </h3>

            <p className="opacity-80">
              Circles are currently in development. Contact us if you'd like updates.
            </p>
          </div>

          <div>
            <h3 className="text-2xl mb-3">
              How do I receive the journal?
            </h3>

            <p className="opacity-80">
              Simply provide your email address and the journal will be sent to you.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default ContactFAQ;
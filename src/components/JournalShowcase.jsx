import { useState } from "react";
import JournalPreviewModal from "./JournalFlipBook";
import { usePopup } from "../context/PopupContext";

const JournalShowcase = () => {
  const [open, setOpen] = useState(false);

  const { openPopup } = usePopup();

  return (
    <>
      <section className="py-40">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Left */}

            <div>

              <p
                className="
                uppercase
                tracking-[8px]
                text-sm
                mb-5
                "
              >
                Reflection Journal
              </p>

              <h2
                className="
                text-5xl
                md:text-7xl
                mb-8
                "
                style={{
                  fontFamily:
                    "Cormorant Garamond, serif",
                }}
              >
                Explore
                <br />
                The Journal
              </h2>

              <p
                className="
                text-lg
                opacity-80
                mb-10
                "
              >
                Preview a few pages from our
                beautifully hand painted prenatal
                reflection journal.
              </p>

              <button
                onClick={() => setOpen(true)}
                className="
                px-10
                py-5
                rounded-full
                text-white
                "
                style={{
                  background:
                    "var(--color-sage)",
                }}
              >
                Preview Pages
              </button>

            </div>

            {/* Right */}

            <div>

              <img
                src="/journal/page1.png"
                alt=""
                className="
                rounded-[40px]
                shadow-2xl
                "
              />

            </div>

          </div>

        </div>

      </section>

      <JournalPreviewModal
        open={open}
        onClose={() => setOpen(false)}
        openPopup={openPopup}
      />
    </>
  );
};

export default JournalShowcase;
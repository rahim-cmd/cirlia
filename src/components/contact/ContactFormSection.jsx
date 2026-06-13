import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../Button";
import { sendContactRequest } from "../../utils/email";

const ContactFormSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await sendContactRequest({
        lead_type: "Join Circle Request",
        user_name: form.name,
        user_email: form.email,
        message: form.message,
      });

      alert(
        "Thank you. Your message has been sent successfully."
      );

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* IMAGE */}

          <motion.div
            whileHover={{
              y: -10,
            }}
          >
            <h3
              className="
              text-xl
              py-3
              text-center
              text-white
              rounded-[25px]
              mb-2
              "
              style={{
                background:
                  "var(--color-sage)",
              }}
            >
              Zoom Times ‘Fridays 7:00–8:30pm UK Time’
            </h3>

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
                  "Cormorant Garamond, serif",
              }}
            >
              Send A Message
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <input
                type="text"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
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
                required
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
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
                required
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message:
                      e.target.value,
                  })
                }
                className="
                w-full
                p-5
                rounded-[25px]
                border
                "
              />

              <Button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Sending..."
                  : "Send Message"}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
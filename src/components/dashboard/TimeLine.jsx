import { CheckCircle2, Clock3, CalendarDays, Video } from "lucide-react";

const stepsByStatus = {
  NO_BOOKING: [
    { icon: CalendarDays, title: "Booking Submitted", active: false },
    { icon: Clock3, title: "Approval Pending", active: false },
    { icon: Video, title: "Join Circle", active: false },
    { icon: CheckCircle2, title: "Circle Completed", active: false },
  ],
  PENDING: [
    { icon: CalendarDays, title: "Booking Submitted", active: true },
    { icon: Clock3, title: "Approval Pending", active: true },
    { icon: Video, title: "Join Circle", active: false },
    { icon: CheckCircle2, title: "Circle Completed", active: false },
  ],
  APPROVED: [
    { icon: CalendarDays, title: "Booking Submitted", active: true },
    { icon: Clock3, title: "Approval Pending", active: true },
    { icon: Video, title: "Join Circle", active: true },
    { icon: CheckCircle2, title: "Circle Completed", active: false },
  ],
  COMPLETED: [
    { icon: CalendarDays, title: "Booking Submitted", active: true },
    { icon: Clock3, title: "Approval Pending", active: true },
    { icon: Video, title: "Join Circle", active: true },
    { icon: CheckCircle2, title: "Circle Completed", active: true },
  ],
};

export default function TimeLine({ status = "NO_BOOKING" }) {
  const steps = stepsByStatus[status.toUpperCase()] || stepsByStatus.NO_BOOKING;

  return (
    <section className="my-10 rounded-[35px] bg-white p-8 shadow-lg lg:p-10">
      <h2
        className="mb-10 text-4xl"
        style={{ fontFamily: "Cormorant Garamond, serif" }}
      >
        Your journey
      </h2>

      <div className="grid gap-6 md:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div key={`${step.title}-${index}`} className="text-center">
              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                  step.active
                    ? "bg-[#7A8E7B] text-white"
                    : "bg-[#F5F1EE] text-gray-500"
                }`}
              >
                <Icon size={32} />
              </div>

              <h3 className="mt-5 font-semibold">{step.title}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}

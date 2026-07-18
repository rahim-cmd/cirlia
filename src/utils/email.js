import emailjs from "@emailjs/browser";

const SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID;

const PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const JOURNAL_TEMPLATE =
  import.meta.env.VITE_EMAILJS_JOURNAL_TEMPLATE;

const CONTACT_TEMPLATE =
  import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE;

const BOOKING_TEMPLATE =
  import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE;

export const sendJournalRequest = (data) => {
  return emailjs.send(
    SERVICE_ID,
    JOURNAL_TEMPLATE,
    data,
    PUBLIC_KEY
  );
};

const sanitizeBookingEmailPayload = (data = {}) => {
  const payload = { ...data };

  delete payload.zoom_link;
  delete payload.zoomLink;
  delete payload.join_url;
  delete payload.joinUrl;
  delete payload.meeting_link;
  delete payload.meetingLink;
  delete payload.zoom_start_url;
  delete payload.zoomStartUrl;

  return payload;
};

export const sendBookingConfirmation = (data) => {
  if (!SERVICE_ID || !PUBLIC_KEY) {
    return Promise.resolve();
  }

  const template = BOOKING_TEMPLATE || CONTACT_TEMPLATE || JOURNAL_TEMPLATE;

  if (!template) {
    return Promise.resolve();
  }

  return emailjs.send(SERVICE_ID, template, sanitizeBookingEmailPayload(data), PUBLIC_KEY);
};
export const sendContactRequest = (data) => {
  return emailjs.send(
    SERVICE_ID,
    CONTACT_TEMPLATE,
    data,
    PUBLIC_KEY
  );
};
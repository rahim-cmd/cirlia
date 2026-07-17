const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

export const formatDisplayDate = (value) => {
  if (!value) {
    return "TBD";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
};

export const formatDisplayTime = (value) => {
  if (!value) {
    return "TBD";
  }

  const date = new Date(`1970-01-01T${value}`);
  return Number.isNaN(date.getTime()) ? value : timeFormatter.format(date);
};

export const formatTimeRange = (startTime, endTime) => {
  if (!startTime && !endTime) {
    return "TBD";
  }

  return `${formatDisplayTime(startTime)} - ${formatDisplayTime(endTime)}`;
};

export const humanizeStatus = (status) => {
  const normalized = String(status || "pending").toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};
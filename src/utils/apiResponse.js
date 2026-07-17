export const extractList = (payload) => {
  const candidates = [
    payload?.data,
    payload?.items,
    payload?.circles,
    payload?.users,
    payload?.bookings,
    payload,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
};

export const extractItem = (payload) => {
  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  return payload;
};

export const getValidationErrors = (error) => {
  return Array.isArray(error?.payload?.errors) ? error.payload.errors : [];
};

export const getFieldErrors = (error) => {
  return getValidationErrors(error).reduce((accumulator, item) => {
    if (item?.field) {
      accumulator[item.field] = item.message || "Invalid value.";
    }

    return accumulator;
  }, {});
};

export const formatApiError = (error, fallback = "Something went wrong.") => {
  const validationMessage = getValidationErrors(error)
    .map((item) => item?.message)
    .filter(Boolean)
    .join(" ");

  return validationMessage || error?.payload?.message || error?.message || fallback;
};
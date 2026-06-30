/**
 * Turn an Axios/Laravel error into a single user-facing message.
 *
 * Laravel returns 422 validation errors as { message, errors: { field: [msg] } }
 * and other failures as { message }. We surface the most specific message we can
 * find so the user knows what actually went wrong, falling back to a generic one.
 */
export function extractApiError(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;

  if (data?.errors) {
    const messages = Object.values(data.errors)
      .flat()
      .filter(Boolean);
    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  if (data?.message) {
    return data.message;
  }

  if (!error?.response) {
    return "Cannot reach the server. Check your connection and that the backend is running.";
  }

  return fallback;
}

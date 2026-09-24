export async function fetchWithTimeout(url, options = {}, timeoutMs = 22000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeout = new Error("Request timed out");
      timeout.code = "TIMEOUT";
      throw timeout;
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export function httpErrorMessage(status) {
  if (status === 401 || status === 403) return "Authentication failed";
  if (status === 404) return "Endpoint not found";
  if (status === 429) return "Rate limited. Please try again shortly.";
  if (status >= 500) return "Remote service unavailable";
  return `HTTP ${status}`;
}

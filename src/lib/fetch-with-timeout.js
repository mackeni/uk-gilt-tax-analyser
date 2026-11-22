// Cloudflare Workers' fetch doesn't support a `timeout` option (the WHATWG
// Fetch spec has no such field) — an AbortController is the only way to
// bound a fetch call. This helper centralizes that pattern.
export async function fetchWithTimeout(url, timeoutMs, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

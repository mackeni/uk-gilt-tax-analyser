// Cloudflare Workers' fetch doesn't support a `timeout` option (the WHATWG
// Fetch spec has no such field) — an AbortController is the only way to
// bound a fetch call. This helper centralizes that pattern.
//
// fetch() resolves as soon as headers arrive, so the timer must also cover
// reading the body: pass a `consume` callback (e.g. readText/readJson) and
// it runs before the timer is cleared. An abort mid-body rejects it.
export async function fetchWithTimeout(url, timeoutMs, options = {}, consume = response => response) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return await consume(response);
  } finally {
    clearTimeout(timeoutId);
  }
}

// Read the body only for successful responses; returns { ok, status, body }.
export const readText = async response => ({
  ok: response.ok,
  status: response.status,
  body: response.ok ? await response.text() : null
});

export const readJson = async response => ({
  ok: response.ok,
  status: response.status,
  body: response.ok ? await response.json() : null
});

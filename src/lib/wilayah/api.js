// Helper wilayah administrasi Indonesia.
// Fetch lewat Next.js Route Handler (proxy) supaya tidak kena CORS dari wilayah.id.
// Data wilayah dibatasi ke Kabupaten Tangerang di sisi server.

export const KAB_TANGERANG_CODE = "36.03";
export const KAB_TANGERANG_NAME = "Kabupaten Tangerang";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Wilayah proxy error ${res.status}: ${detail}`);
  }
  const json = await res.json();
  return json.data || [];
}

export async function getDistricts() {
  return fetchJson("/api/wilayah/districts");
}

export async function getVillages(districtCode) {
  if (!districtCode) return [];
  return fetchJson(`/api/wilayah/villages?district=${encodeURIComponent(districtCode)}`);
}

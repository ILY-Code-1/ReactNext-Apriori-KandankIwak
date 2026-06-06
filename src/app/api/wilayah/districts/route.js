const KAB_CODE = "36.03"; // Kabupaten Tangerang
const UPSTREAM = `https://wilayah.id/api/districts/${KAB_CODE}.json`;

export const revalidate = 86400; // cache 1 hari di sisi Next.js

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, { next: { revalidate: 86400 } });
    if (!res.ok) {
      return Response.json(
        { error: `Upstream error: ${res.status}` },
        { status: 502 },
      );
    }
    const json = await res.json();
    const list = Array.isArray(json) ? json : json.data || [];
    return Response.json(
      { data: list.map((d) => ({ code: d.code, name: d.name })) },
      {
        headers: {
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch (err) {
    return Response.json(
      { error: err?.message || "Gagal hubungi wilayah.id" },
      { status: 500 },
    );
  }
}

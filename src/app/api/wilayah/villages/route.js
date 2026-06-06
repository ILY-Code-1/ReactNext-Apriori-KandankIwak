export const revalidate = 86400;

const DISTRICT_CODE_PATTERN = /^[0-9]{2}\.[0-9]{2}\.[0-9]{2}$/;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const district = (searchParams.get("district") || "").trim();

  if (!DISTRICT_CODE_PATTERN.test(district)) {
    return Response.json(
      { error: "Kode kecamatan tidak valid." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `https://wilayah.id/api/villages/${district}.json`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) {
      return Response.json(
        { error: `Upstream error: ${res.status}` },
        { status: 502 },
      );
    }
    const json = await res.json();
    const list = Array.isArray(json) ? json : json.data || [];
    return Response.json(
      { data: list.map((v) => ({ code: v.code, name: v.name })) },
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

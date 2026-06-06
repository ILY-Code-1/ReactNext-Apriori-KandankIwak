import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import Wave from "@/components/ui/Wave";

const SHOP_LINKS = ["Ikan Segar", "Olahan", "Bumbu", "Paket Hemat"];
const HELP_LINKS = ["Cara Pesan", "Pengiriman", "Hubungi Kami", "FAQ"];

export default function StoreFooter() {
  return (
    <footer style={{ marginTop: 40, background: "var(--navy-900)", color: "#cfd2ec" }}>
      <Wave color="var(--navy-900)" height={50} />
      <div
        className="wrap"
        style={{
          padding: "10px 28px 44px",
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr 1fr 1.4fr",
          gap: 32,
        }}
      >
        <div className="col gap-12">
          <Logo height={40} mono />
          <p style={{ fontSize: 13.5, lineHeight: 1.6, maxWidth: 280, color: "#a9adcf", margin: 0 }}>
            Budidaya & penjualan ikan nila segar langsung dari kolam. Segar, sehat, dan terpercaya untuk dapur Anda.
          </p>
        </div>
        <div className="col gap-10">
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 13.5 }}>Belanja</span>
          {SHOP_LINKS.map((x) => (
            <Link key={x} href="/products" style={{ fontSize: 13.5, color: "#a9adcf" }}>
              {x}
            </Link>
          ))}
        </div>
        <div className="col gap-10">
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 13.5 }}>Bantuan</span>
          {HELP_LINKS.map((x) => (
            <a key={x} style={{ fontSize: 13.5, color: "#a9adcf" }}>
              {x}
            </a>
          ))}
        </div>
        <div className="col gap-12">
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 13.5 }}>Pesan langsung</span>
          <button type="button" className="btn btn-sky" style={{ alignSelf: "flex-start" }}>
            <Icon name="wa" size={18} /> Chat WhatsApp
          </button>
          <span style={{ fontSize: 12.5, color: "#8e92b8" }}>Jl. Kolam Asri No. 12, Sukabumi</span>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div
          className="wrap row"
          style={{ padding: "16px 28px", fontSize: 12.5, color: "#8e92b8" }}
        >
          <span>© 2026 Kandank Iwak. Semua hak dilindungi.</span>
          <div className="spacer" />
          <span>Ditenagai analisis Apriori untuk rekomendasi cerdas</span>
        </div>
      </div>
    </footer>
  );
}

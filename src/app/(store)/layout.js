import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";

export default function StoreLayout({ children }) {
  return (
    <div className="col" style={{ minHeight: "100vh" }}>
      <StoreHeader />
      <div style={{ flex: 1 }}>{children}</div>
      <StoreFooter />
    </div>
  );
}

export default function Logo({ height = 34, mono = false }) {
  return (
    <img
      src="/kandank-iwak-logo.png"
      alt="Kandank Iwak"
      style={{
        height,
        width: "auto",
        filter: mono ? "brightness(0) invert(1)" : "none",
      }}
    />
  );
}

import Image from "next/image";

export default function Logo({ height = 34, mono = false }) {
  return (
    <Image
      src="/kandank-iwak-logo.png"
      alt="Kandank Iwak"
      width={120}
      height={height}
      style={{
        height,
        width: "auto",
        filter: mono ? "brightness(0) invert(1)" : "none",
      }}
      priority
    />
  );
}

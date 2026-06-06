export default function Wave({ color = "#fff", flip = false, height = 60 }) {
  return (
    <svg
      className="wave"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      style={{ height, transform: flip ? "scaleY(-1)" : "none" }}
    >
      <path
        fill={color}
        d="M0 60 C 240 110 480 110 720 70 C 960 30 1200 30 1440 70 L1440 120 L0 120 Z"
      />
    </svg>
  );
}

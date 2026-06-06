export default function RequiredLabel({ children }) {
  return (
    <span>
      {children}{" "}
      <span style={{ color: "var(--red)", fontWeight: 700 }} aria-hidden="true">
        *
      </span>
      <span className="sr-only"> (wajib diisi)</span>
    </span>
  );
}

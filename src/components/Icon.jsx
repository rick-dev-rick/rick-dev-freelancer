/** Vector icons avoid platform-specific emoji rendering on iOS. */
export default function Icon({ name = "arrow", className = "" }) {
  const paths = {
    arrow: "M5 19 19 5M5 5h14v14",
    horizontal: "M3 12h18M7 8l-4 4 4 4m10-8 4 4-4 4",
    download: "M12 3v13m-5-5 5 5 5-5M5 20h14",
    sparkle: "M12 3v18M3 12h18M6 6l12 12M6 18 18 6",
  };
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}

interface LogoProps {
  variant?: "primary" | "knockout" | "mark";
  className?: string;
}

/** DashComigo orbit mark — circle + signal dot */
function Mark({ stroke, dot }: { stroke: string; dot: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 108 108"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="54" cy="54" r="34" stroke={stroke} strokeWidth="10" fill="none" />
      <circle cx="90" cy="54" r="12" fill={dot} />
    </svg>
  );
}

/** Full lockup: orbit mark + wordmark */
export function Logo({ variant = "primary", className = "" }: LogoProps) {
  const isKnockout = variant === "knockout";
  const textColor = isKnockout ? "#F4EFE6" : "#0E3B2E";
  const strokeColor = isKnockout ? "#F4EFE6" : "#0E3B2E";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Mark stroke={strokeColor} dot="#7FD19F" />
      <span
        style={{
          fontFamily: "Geist, Inter, Helvetica, Arial, sans-serif",
          fontWeight: 600,
          fontSize: "1.25rem",
          letterSpacing: "-0.03em",
          color: textColor,
          lineHeight: 1,
        }}
      >
        Dashcomigo
      </span>
    </span>
  );
}

/** Icon-only mark for collapsed sidebar / favicon contexts */
export function LogoMark({ variant = "primary", size = 32, className = "" }: { variant?: "primary" | "knockout"; size?: number; className?: string }) {
  const strokeColor = variant === "knockout" ? "#F4EFE6" : "#0E3B2E";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 108 108"
      fill="none"
      className={className}
      aria-label="DashComigo"
    >
      <circle cx="54" cy="54" r="34" stroke={strokeColor} strokeWidth="10" fill="none" />
      <circle cx="90" cy="54" r="12" fill="#7FD19F" />
    </svg>
  );
}

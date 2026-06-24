interface NisaLogoProps {
  className?: string;
  color?: string;
}

export function NisaLogo({ className, color = "#C9A030" }: NisaLogoProps) {
  return (
    <svg
      viewBox="0 0 300 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Nisa&Co"
      role="img"
    >
      {/*
        Coat silhouette scaled to fit a 58×76 box (left portion of the 300×80 viewBox).
        Original design: 160 wide × 180 tall → scale: x×0.363+1, y×0.422+2
      */}

      {/* Coat outer path */}
      <path
        fill={color}
        d="
          M 20 4
          L 8 14
          C 2 19, 0 28, 2 34
          L 8 37
          C 6 48, 5 58, 4 67
          L 3 74
          C 2 77, 4 79, 8 79
          L 53 79
          C 57 79, 59 77, 58 74
          L 57 67
          C 56 58, 54 48, 52 37
          L 59 34
          C 61 28, 59 19, 53 14
          L 41 4
          L 30 31
          Z
        "
      />

      {/* V-neck white cutout */}
      <path fill="white" d="M 20 4 L 30 31 L 41 4 Z" />

      {/* Diamond gem */}
      <path fill={color} d="M 30 26 L 35 31 L 30 36 L 25 31 Z" />
      {/* Gem inner sparkle */}
      <path fill="rgba(255,255,255,0.45)" d="M 30 28 L 33 31 L 30 34 L 27 31 Z" />

      {/* Thin divider between coat and text */}
      <line
        x1="67"
        y1="14"
        x2="67"
        y2="66"
        stroke={color}
        strokeWidth="0.9"
        strokeOpacity="0.35"
      />

      {/*
        "Nisa & Co" in Dancing Script.
        font-size 56 in an 80-unit-tall viewBox → ~70% of height.
        At h-12 (48px): text renders ~33px — clearly readable.
        At h-14 (56px): ~39px.
      */}
      <text
        x="76"
        y="63"
        fontFamily="var(--font-dancing), 'Dancing Script', Georgia, serif"
        fontSize="56"
        fill={color}
      >
        Nisa &amp; Co
      </text>
    </svg>
  );
}

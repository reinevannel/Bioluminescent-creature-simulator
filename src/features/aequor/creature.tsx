/**
 * Pila aequor, drawn as one SVG so colour, glow and morphology stay in sync
 * with the variant. Stroke uses currentColor, which follows `--glow`.
 */

import { useId, useMemo } from "react";
import type { Variant } from "./model";

interface CreatureProps {
  variant: Variant;
  mutations: number;
  size?: number;
  /** Decorative copies (archive cards, timeline) should not be named twice. */
  labelled?: boolean;
  label?: string;
}

export function Creature({
  variant,
  mutations,
  size = 250,
  labelled = true,
  label = "Pila aequor specimen",
}: CreatureProps) {
  const uid = useId().replace(/:/g, "");
  const tentCount = variant === "mutated" ? 10 : variant === "rare" ? 6 : variant === "evolved" ? 8 : 7;

  const tentacles = useMemo(() => {
    const center = 140;
    const originY = 192;
    const spread = variant === "mutated" ? 88 : variant === "rare" ? 50 : 70;
    return Array.from({ length: tentCount }, (_, index) => {
      const t = tentCount > 1 ? index / (tentCount - 1) : 0.5;
      const startX = center - spread / 2 + t * spread;
      const drift = (t - 0.5) * 28;
      const length = 60 + (index % 3) * 14;
      return { startX, startY: originY, endX: startX + drift * 0.5, endY: originY + length, index };
    });
  }, [tentCount, variant]);

  const body = {
    standard:
      "M115 82 C125 66 155 66 165 82 C186 97 192 132 186 162 C180 182 165 192 140 194 C115 192 100 182 94 162 C88 132 94 97 115 82Z",
    mutated:
      "M118 76 C130 58 152 60 166 76 C186 92 202 120 200 152 C198 175 184 196 163 198 C152 200 146 204 140 202 C134 204 128 200 117 198 C96 196 80 175 78 152 C76 120 88 90 118 76Z",
    evolved:
      "M110 78 C120 56 160 56 170 78 C194 100 200 140 192 170 C184 192 165 202 140 204 C115 202 96 192 88 170 C80 140 86 100 110 78Z",
    rare: "M126 68 C133 52 147 52 154 68 C170 92 177 130 175 164 C173 188 162 202 140 204 C118 202 107 188 105 164 C103 130 110 92 126 68Z",
  }[variant];

  const spots: Array<[number, number]> = [
    [122, 150],
    [158, 150],
    [133, 164],
    [147, 164],
    [140, 177],
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 280 280"
      className="overflow-visible text-glow"
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      aria-label={labelled ? label : undefined}
    >
      <defs>
        <radialGradient id={`body-${uid}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1e4a5c" />
          <stop offset="55%" stopColor="var(--body)" />
          <stop offset="100%" stopColor="#050e18" />
        </radialGradient>
        <radialGradient id={`halo-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="65%" stopColor="currentColor" stopOpacity="0.04" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <filter id={`soft-${uid}`}>
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`eye-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="140" cy="145" r="130" fill={`url(#halo-${uid})`} />

      {tentacles.map((tentacle) => {
        const mid = (tentCount - 1) / 2;
        const weight = Math.abs(tentacle.index - mid) < 1.5 ? 2 : 1.5;
        const opacity = 0.35 + (1 - Math.abs(tentacle.index / Math.max(tentCount - 1, 1) - 0.5)) * 0.3;
        const path = `M${tentacle.startX} ${tentacle.startY} C${tentacle.startX + (tentacle.endX - tentacle.startX) * 0.3} ${tentacle.startY + 22} ${tentacle.endX - (tentacle.endX - tentacle.startX) * 0.2} ${tentacle.endY - 18} ${tentacle.endX} ${tentacle.endY}`;
        return (
          <g key={tentacle.index}>
            <path
              d={path}
              stroke="currentColor"
              strokeWidth={weight}
              fill="none"
              strokeOpacity={opacity}
              strokeLinecap="round"
              filter={`url(#soft-${uid})`}
            />
            <circle cx={tentacle.endX} cy={tentacle.endY} r="2.5" fill="currentColor" opacity="0.7" />
          </g>
        );
      })}

      <path
        d={body}
        fill={`url(#body-${uid})`}
        stroke="currentColor"
        strokeWidth={variant === "rare" ? 2.5 : 1.8}
        strokeOpacity="0.5"
      />
      <ellipse cx="140" cy="132" rx="30" ry="25" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.18" />
      <ellipse cx="140" cy="128" rx="16" ry="12" fill="currentColor" fillOpacity="0.07" />

      {spots.map(([x, y], index) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="currentColor" opacity={0.28 + index * 0.04} />
      ))}

      {(variant === "mutated" || variant === "rare") && (
        <>
          <circle cx="115" cy="136" r="3.5" fill="currentColor" opacity="0.4" />
          <circle cx="165" cy="136" r="3.5" fill="currentColor" opacity="0.4" />
        </>
      )}

      {variant === "mutated" && (
        <>
          <path d="M120 80 L114 60 L123 78" fill="currentColor" opacity="0.55" />
          <path d="M162 82 L169 62 L160 80" fill="currentColor" opacity="0.55" />
          <path d="M95 138 L74 134 L94 142" fill="currentColor" opacity="0.4" />
          <path d="M185 138 L206 134 L186 142" fill="currentColor" opacity="0.4" />
        </>
      )}

      {variant === "evolved" &&
        [120, 130, 140, 150, 160].map((x, index) => (
          <line
            key={x}
            x1={x}
            y1={80}
            x2={x + (index - 2) * 4}
            y2={60 - (index % 2) * 6}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.55"
            strokeLinecap="round"
          />
        ))}

      {variant === "rare" && (
        <>
          <polygon points="140,95 150,112 140,129 130,112" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="140" cy="112" r="5" fill="currentColor" opacity="0.22" />
        </>
      )}

      <circle cx="127" cy="114" r="7" fill="currentColor" opacity="0.95" filter={`url(#eye-${uid})`} />
      <circle cx="153" cy="114" r="7" fill="currentColor" opacity="0.95" filter={`url(#eye-${uid})`} />
      <circle cx="127" cy="114" r="3.5" fill="white" opacity="0.95" />
      <circle cx="153" cy="114" r="3.5" fill="white" opacity="0.95" />
      <circle cx="127" cy="114" r="1.5" fill="#060e1a" />
      <circle cx="153" cy="114" r="1.5" fill="#060e1a" />
      <ellipse cx="126" cy="94" rx="20" ry="10" fill="white" opacity="0.07" transform="rotate(-15 126 94)" />

      {mutations >= 3 && (
        <text
          x="140"
          y="248"
          textAnchor="middle"
          fontSize="9"
          fill="currentColor"
          opacity="0.55"
          fontFamily="ui-monospace, monospace"
        >
          ×{mutations} MUT
        </text>
      )}
    </svg>
  );
}

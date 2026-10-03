import React from 'react';

interface BisotunLogoProps {
  className?: string;
  size?: number;
}

/**
 * Bisotun Ancient-Modern Fusion Emblem:
 * Inspired by the historic Bisotun rock relief & Old Persian cuneiform script (خط میخی کتیبه بیستون)
 * synthesized seamlessly with digital circuit traces and binary 0/1 bits.
 * Contains NO English letters.
 */
export const BisotunLogo: React.FC<BisotunLogoProps> = ({ className = '', size = 36 }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-accent via-accent-2 to-indigo-950 text-white shadow-[0_0_16px_rgba(30,58,138,0.4)] overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      title="نشان هویتی سامانه بیستون: تلفیق خط میخی کتیبه باستانی با صفر و یک هوش مصنوعی"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1.5"
      >
        {/* Subtle background circuitry lines */}
        <path
          d="M6 14H14V22"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M42 34H34V26"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Binary code indicators (0 and 1) in stylized micro-font */}
        <text
          x="7"
          y="38"
          fill="rgba(255,255,255,0.45)"
          fontSize="5"
          fontFamily="monospace"
          fontWeight="bold"
        >
          01
        </text>
        <text
          x="33"
          y="13"
          fill="rgba(255,255,255,0.45)"
          fontSize="5"
          fontFamily="monospace"
          fontWeight="bold"
        >
          10
        </text>

        {/* Central Ancient Cuneiform Motif (گُوه‌های خط میخی کتیبه هخامنشی بیستون) */}
        {/* Horizontal cuneiform wedge 1 */}
        <path
          d="M12 18L17 15V21L12 18Z"
          fill="currentColor"
          className="text-amber-300 drop-shadow-[0_0_4px_rgba(252,211,77,0.5)]"
        />
        <rect x="17" y="17" width="18" height="2" rx="1" fill="currentColor" className="text-white" />
        <circle cx="36" cy="18" r="1.5" fill="#38bdf8" />

        {/* Central majestic vertical cuneiform wedge */}
        <path
          d="M24 10L27 15H21L24 10Z"
          fill="currentColor"
          className="text-amber-300 drop-shadow-[0_0_4px_rgba(252,211,77,0.5)]"
        />
        <rect x="23" y="15" width="2" height="20" rx="1" fill="currentColor" className="text-white" />
        <circle cx="24" cy="36" r="1.5" fill="#34d399" />

        {/* Horizontal cuneiform wedge 2 (lower level) */}
        <path
          d="M36 29L31 26V32L36 29Z"
          fill="currentColor"
          className="text-amber-300 drop-shadow-[0_0_4px_rgba(252,211,77,0.5)]"
        />
        <rect x="13" y="28" width="18" height="2" rx="1" fill="currentColor" className="text-white" />
        <circle cx="12" cy="29" r="1.5" fill="#818cf8" />

        {/* Corner angled cuneiform wedge (corner wedge of Bisotun script) */}
        <path
          d="M15 32L19 32L17 35L15 32Z"
          fill="currentColor"
          className="text-amber-400"
        />
        <path
          d="M33 16L29 16L31 13L33 16Z"
          fill="currentColor"
          className="text-amber-400"
        />
      </svg>
    </div>
  );
};

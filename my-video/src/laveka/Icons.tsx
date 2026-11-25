import React from "react";

type IconProps = { size?: number; color?: string };

const Svg: React.FC<React.PropsWithChildren<IconProps>> = ({
  size = 64,
  color = "white",
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke={color}
    strokeWidth={2.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const DropIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M24 6c6 8 12 15 12 22a12 12 0 0 1-24 0c0-7 6-14 12-22z" />
    <path d="M19 30a5 5 0 0 0 5 5" />
  </Svg>
);

export const SparkleIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M20 8l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
    <path d="M35 28l1.6 4.4L41 34l-4.4 1.6L35 40l-1.6-4.4L29 34l4.4-1.6z" />
  </Svg>
);

export const ShieldIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M24 5l15 6v11c0 10-7 17-15 21-8-4-15-11-15-21V11z" />
    <path d="M17 24l5 5 9-10" />
  </Svg>
);

export const FaceIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="24" cy="24" r="17" />
    <path d="M17 21c1.5 1.5 3.5 1.5 5 0M26 21c1.5 1.5 3.5 1.5 5 0" />
    <path d="M19 31c3 2.5 7 2.5 10 0" />
  </Svg>
);

export const WavesIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M7 17c4-4 7-4 11 0s7 4 11 0 7-4 11 0" />
    <path d="M7 25c4-4 7-4 11 0s7 4 11 0 7-4 11 0" />
    <path d="M7 33c4-4 7-4 11 0s7 4 11 0 7-4 11 0" />
  </Svg>
);

export const MoleculeIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="24" cy="24" r="5" />
    <circle cx="11" cy="12" r="4" />
    <circle cx="37" cy="12" r="4" />
    <circle cx="11" cy="37" r="4" />
    <circle cx="37" cy="37" r="4" />
    <path d="M14 15l6 5M34 15l-6 5M14 34l6-6M34 34l-6-6" />
  </Svg>
);

export const LeafIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M10 38C10 20 22 9 39 9c0 17-11 29-29 29z" />
    <path d="M10 38l17-17" />
  </Svg>
);

export const DotsIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    {[12, 24, 36].flatMap((x) =>
      [12, 24, 36].map((y) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" />
      )),
    )}
  </Svg>
);

export const PoreIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6 30h12c2 0 3-2 3-4V14M42 30H30c-2 0-3-2-3-4V14" />
    <path d="M24 8v4M17 8l2 3M31 8l-2 3" />
    <path d="M6 38h36" />
  </Svg>
);

export const SunIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="24" cy="24" r="8" />
    <path d="M24 5v5M24 38v5M5 24h5M38 24h5M10.5 10.5l3.5 3.5M34 34l3.5 3.5M10.5 37.5l3.5-3.5M34 14l3.5-3.5" />
  </Svg>
);

export const MoonIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M36 30A15 15 0 0 1 18 12a15 15 0 1 0 18 18z" />
  </Svg>
);

export const LiftIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M14 40V12M14 12l-7 7M14 12l7 7" />
    <path d="M34 40V12M34 12l-7 7M34 12l7 7" />
  </Svg>
);

export const BandageIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect
      x="6"
      y="17"
      width="36"
      height="14"
      rx="7"
      transform="rotate(-45 24 24)"
    />
    <path d="M21 21h.01M27 21h.01M21 27h.01M27 27h.01" strokeWidth={3.5} />
  </Svg>
);

export const PhoneIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M15 6h-5a3 3 0 0 0-3 3c0 18 14 32 32 32a3 3 0 0 0 3-3v-5l-9-4-4 4c-5-2-10-7-12-12l4-4z" />
  </Svg>
);

export const HeartIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M24 40C10 31 6 24 6 17a9 9 0 0 1 18-2 9 9 0 0 1 18 2c0 7-4 14-18 23z" />
    <path d="M24 30v-8M20 26h8" />
  </Svg>
);

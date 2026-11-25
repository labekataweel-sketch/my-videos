import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "../fonts";
import {
  DotsIcon,
  DropIcon,
  FaceIcon,
  LeafIcon,
  MoleculeIcon,
  MoonIcon,
  PoreIcon,
  ShieldIcon,
  SparkleIcon,
  SunIcon,
  WavesIcon,
} from "./Icons";
import { colors, goldGradient } from "./theme";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 0→1 spring that starts `delay` frames into the scene. */
const useEnter = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

const rtl = { direction: "rtl" as const };

// ---------------------------------------------------------------- shared

/** Soft cream ground with slowly drifting light circles. */
const CreamBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 80% 10%, #ffffff 0%, ${colors.cream} 45%, #ebe5d8 100%)`,
      }}
    >
      {new Array(9).fill(0).map((_, i) => {
        const size = 120 + random(`s${i}`) * 260;
        const x = random(`x${i}`) * 1080;
        const y = random(`y${i}`) * 1920 - frame * (0.3 + random(`v${i}`) * 0.5);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background:
                i % 3 === 0
                  ? "radial-gradient(circle, rgba(169,220,212,0.45), rgba(169,220,212,0) 70%)"
                  : "radial-gradient(circle, rgba(236,208,138,0.30), rgba(236,208,138,0) 70%)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Heading: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        ...rtl,
        fontFamily,
        fontWeight: 800,
        fontSize: 92,
        color: colors.tealDeep,
        textAlign: "center",
        lineHeight: 1.2,
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      {children}
    </div>
  );
};

const GoldRule: React.FC<{ delay?: number; width?: number }> = ({
  delay = 0,
  width = 360,
}) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        width: width * p,
        height: 6,
        borderRadius: 3,
        background: goldGradient,
        margin: "0 auto",
      }}
    />
  );
};

const Logo: React.FC<{ width: number; style?: React.CSSProperties }> = ({
  width,
  style,
}) => (
  <Img
    src={staticFile("laveka/logo-official.png")}
    style={{ width, height: "auto", ...style }}
  />
);

// ---------------------------------------------------------------- 1 intro

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useEnter(5);
  const words = ["ترطيب", "تجديد", "حماية"];
  const shine = interpolate(frame, [20, 70], [-20, 120], clamp);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${colors.teal} 0%, ${colors.tealDeep} 60%, #062e2d 100%)`,
        justifyContent: "center",
        alignItems: "center",
        gap: 60,
        fontFamily,
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          opacity: logo,
          transform: `scale(${0.85 + logo * 0.15})`,
          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.35))",
        }}
      >
        <Logo width={820} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            WebkitMaskImage: `url(${staticFile("laveka/logo-official.png")})`,
            maskImage: `url(${staticFile("laveka/logo-official.png")})`,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            background: `linear-gradient(100deg, transparent ${shine - 15}%, rgba(255,250,225,0.85) ${shine}%, transparent ${shine + 15}%)`,
          }}
        />
      </div>
      <GoldRule delay={20} width={420} />
      <div
        style={{
          ...rtl,
          display: "flex",
          gap: 48,
          fontSize: 76,
          fontWeight: 700,
          color: colors.cream,
        }}
      >
        {words.map((w, i) => (
          <Word key={w} delay={30 + i * 10}>
            {w}
          </Word>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Word: React.FC<{ children: React.ReactNode; delay: number }> = ({
  children,
  delay,
}) => {
  const p = useEnter(delay);
  return (
    <span
      style={{
        display: "inline-block",
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      {children}
    </span>
  );
};

// ---------------------------------------------------------------- 2 product

export const ProductScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const jar = useEnter(8, 18);
  const pill = useEnter(22);
  const tagline = useEnter(45);
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.07]);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <CreamBackground />
      <AbsoluteFill
        style={{ alignItems: "center", paddingTop: 170, gap: 28 }}
      >
        <Heading>كريم ترطيب عميق</Heading>
        <div
          style={{
            ...rtl,
            opacity: pill,
            transform: `scale(${0.8 + pill * 0.2})`,
            background: colors.teal,
            color: colors.white,
            fontSize: 54,
            fontWeight: 700,
            padding: "10px 56px 16px",
            borderRadius: 60,
          }}
        >
          لجميع أنواع البشرة
        </div>
        <div
          style={{
            marginTop: 30,
            width: 760,
            height: 1030,
            opacity: jar,
            transform: `translateY(${(1 - jar) * 140}px) scale(${zoom})`,
            WebkitMaskImage:
              "radial-gradient(ellipse 50% 50% at 52% 50%, black 72%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 50% 50% at 52% 50%, black 72%, transparent 100%)",
          }}
        >
          <Img
            src={staticFile("laveka/jar.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 150,
        }}
      >
        <div
          style={{
            ...rtl,
            fontSize: 52,
            fontWeight: 600,
            color: colors.ink,
            textAlign: "center",
            opacity: tagline,
            transform: `translateY(${(1 - tagline) * 30}px)`,
          }}
        >
          بشرة أكثر صحة، إشراقاً وحيوية
          <br />
          <span style={{ color: colors.teal, fontWeight: 800 }}>كل يوم!</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 3 benefits

const benefits: { text: string; Icon: React.FC<{ size?: number }> }[] = [
  { text: "ترطيب عميق يدوم طويلاً", Icon: DropIcon },
  { text: "يهدئ الاحمرار والتهيج", Icon: SparkleIcon },
  { text: "يعزز حاجز البشرة ويحميها", Icon: ShieldIcon },
  { text: "يوحد لون البشرة ويمنحها إشراقاً طبيعياً", Icon: FaceIcon },
  { text: "يقلل الخطوط الدقيقة وعلامات التعب", Icon: WavesIcon },
  { text: "يحفز تجديد الخلايا ويعزز إنتاج الكولاجين", Icon: MoleculeIcon },
];

const BenefitRow: React.FC<{
  text: string;
  Icon: React.FC<{ size?: number }>;
  delay: number;
}> = ({ text, Icon, delay }) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        ...rtl,
        display: "flex",
        alignItems: "center",
        gap: 34,
        background: "rgba(255,255,255,0.92)",
        borderRadius: 120,
        padding: "22px 26px",
        boxShadow: "0 14px 36px rgba(12,79,77,0.12)",
        opacity: p,
        transform: `translateX(${(1 - p) * 160}px)`,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          flexShrink: 0,
          borderRadius: "50%",
          background: colors.teal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={66} />
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: colors.ink,
          lineHeight: 1.35,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const BenefitsScene: React.FC = () => (
  <AbsoluteFill style={{ fontFamily }}>
    <CreamBackground />
    <AbsoluteFill
      style={{
        padding: "150px 70px",
        gap: 30,
        justifyContent: "center",
      }}
    >
      <Heading>لماذا كريم لافيكا؟</Heading>
      <GoldRule delay={8} />
      <div style={{ height: 20 }} />
      {benefits.map((b, i) => (
        <BenefitRow key={b.text} text={b.text} Icon={b.Icon} delay={14 + i * 12} />
      ))}
    </AbsoluteFill>
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 4 ingredients

const ingredients = [
  {
    name: "Hyaluronic Acid",
    desc: "يرطب بعمق ويحافظ على نعومة البشرة",
    from: "#bfe3ff",
    to: "#2f86d6",
    mark: "HA",
  },
  {
    name: "Vitamin E",
    desc: "مضاد أكسدة يحمي البشرة ويمنحها الحيوية",
    from: "#fff0b3",
    to: "#e0a419",
    mark: "E",
  },
  {
    name: "Brightening Extract",
    desc: "يفتّح البشرة ويوحد لونها",
    from: "#d7f2c8",
    to: "#4f9a3a",
    mark: "",
  },
  {
    name: "Stem Cells",
    desc: "تجديد الخلايا وتحفيز إنتاج الكولاجين",
    from: "#cfe6ff",
    to: "#3c78c9",
    mark: "SC",
  },
  {
    name: "Niacinamide",
    desc: "ينظم الدهون ويقلل التصبغات",
    from: "#ffe7b0",
    to: "#e08a12",
    mark: "B3",
  },
];

const IngredientRow: React.FC<(typeof ingredients)[number] & { delay: number }> = ({
  name,
  desc,
  from,
  to,
  mark,
  delay,
}) => {
  const p = useEnter(delay, 14);
  const fade = useEnter(delay);
  return (
    <div
      style={{
        ...rtl,
        display: "flex",
        alignItems: "center",
        gap: 36,
        opacity: fade,
      }}
    >
      <div
        style={{
          width: 150,
          height: 150,
          flexShrink: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${from} 22%, ${to} 72%)`,
          textShadow: "0 2px 8px rgba(0,0,0,0.35)",
          boxShadow: `0 12px 30px ${to}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: colors.white,
          fontSize: 54,
          fontWeight: 800,
          transform: `scale(${p})`,
        }}
      >
        {mark ? mark : <LeafIcon size={78} />}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div
          dir="ltr"
          style={{
            fontSize: 50,
            fontWeight: 800,
            color: colors.tealDeep,
            textAlign: "right",
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 42, color: colors.muted, fontWeight: 600 }}>
          {desc}
        </div>
      </div>
    </div>
  );
};

export const IngredientsScene: React.FC = () => (
  <AbsoluteFill style={{ fontFamily }}>
    <CreamBackground />
    <AbsoluteFill
      style={{ padding: "150px 80px", gap: 44, justifyContent: "center" }}
    >
      <Heading>المكونات الفعّالة</Heading>
      <GoldRule delay={8} />
      <div style={{ height: 10 }} />
      {ingredients.map((ing, i) => (
        <IngredientRow key={ing.name} {...ing} delay={14 + i * 14} />
      ))}
    </AbsoluteFill>
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 5 skin types + usage

const skinTypes: { label: string; Icon: React.FC<{ size?: number; color?: string }> }[] = [
  { label: "جافة", Icon: DropIcon },
  { label: "دهنية", Icon: PoreIcon },
  { label: "مختلطة", Icon: DotsIcon },
  { label: "حساسة", Icon: LeafIcon },
];

const SkinType: React.FC<{
  label: string;
  Icon: React.FC<{ size?: number; color?: string }>;
  delay: number;
}> = ({ label, Icon, delay }) => {
  const p = useEnter(delay, 12);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        transform: `scale(${p})`,
      }}
    >
      <div
        style={{
          width: 190,
          height: 190,
          borderRadius: "50%",
          border: `5px solid ${colors.teal}`,
          background: colors.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={96} color={colors.teal} />
      </div>
      <div style={{ fontSize: 50, fontWeight: 800, color: colors.tealDeep }}>
        {label}
      </div>
    </div>
  );
};

export const SkinTypesScene: React.FC = () => {
  const card = useEnter(55);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <CreamBackground />
      <AbsoluteFill
        style={{
          padding: "150px 70px",
          gap: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Heading>
          مناسب لجميع
          <br />
          أنواع البشرة
        </Heading>
        <GoldRule delay={8} />
        <div
          style={{
            ...rtl,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 20,
          }}
        >
          {skinTypes.map((s, i) => (
            <SkinType key={s.label} {...s} delay={14 + i * 8} />
          ))}
        </div>
        <div
          style={{
            ...rtl,
            marginTop: 50,
            width: "100%",
            background: colors.tealDeep,
            color: colors.cream,
            borderRadius: 48,
            padding: "46px 56px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            opacity: card,
            transform: `translateY(${(1 - card) * 60}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <SunIcon size={70} color={colors.goldLight} />
            <MoonIcon size={62} color={colors.goldLight} />
            <div style={{ fontSize: 56, fontWeight: 800 }}>طريقة الاستخدام</div>
          </div>
          <div style={{ fontSize: 46, lineHeight: 1.5, fontWeight: 600 }}>
            يُستخدم صباحاً ومساءً على بشرة نظيفة لأفضل النتائج.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 6 specialist

export const SpecialistScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1.04, 1.16]);
  const label = useEnter(15);
  const name = useEnter(28);
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: colors.tealDeep }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("laveka/specialist.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "58% 50%",
            transform: `scale(${zoom})`,
            transformOrigin: "58% 30%",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,46,45,0) 42%, rgba(6,46,45,0.9) 62%, rgba(6,46,45,1) 71%)",
        }}
      />
      <AbsoluteFill
        style={{
          ...rtl,
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 190,
          gap: 14,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: colors.goldLight,
            opacity: label,
            transform: `translateY(${(1 - label) * 30}px)`,
          }}
        >
          بإشراف أخصائية التجميل اللاجراحي
        </div>
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            color: colors.white,
            opacity: name,
            transform: `translateY(${(1 - name) * 30}px)`,
          }}
        >
          لبقة الطويل
        </div>
        <GoldRule delay={38} width={300} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 7 offer + CTA

export type OfferProps = {
  price: string;
  oldPrice: string;
  cta: string;
  contact: string;
};

export const OfferScene: React.FC<OfferProps> = ({
  price,
  oldPrice,
  cta,
  contact,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const photo = useEnter(0);
  const old = useEnter(14);
  const strike = interpolate(frame, [26, 38], [0, 100], clamp);
  const priceIn = spring({ frame: frame - 36, fps, config: { damping: 10, mass: 0.8 } });
  const button = useEnter(58);
  const pulse = 1 + Math.max(0, Math.sin((frame - 70) / 7)) * 0.04 * (frame > 70 ? 1 : 0);
  const tagline = useEnter(75);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <CreamBackground />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 820,
          overflow: "hidden",
          opacity: photo,
          WebkitMaskImage: "linear-gradient(180deg, black 70%, transparent 100%)",
          maskImage: "linear-gradient(180deg, black 70%, transparent 100%)",
        }}
      >
        <Img
          src={staticFile("laveka/face.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "60% 50%",
            transform: `scale(${1.1 - photo * 0.06})`,
          }}
        />
      </div>
      <AbsoluteFill
        style={{
          ...rtl,
          alignItems: "center",
          paddingTop: 800,
          gap: 18,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            color: colors.tealDeep,
            opacity: old,
          }}
        >
          عرض خاص لفترة محدودة
        </div>
        <div
          dir="ltr"
          style={{
            position: "relative",
            fontSize: 70,
            fontWeight: 700,
            color: colors.muted,
            opacity: old,
          }}
        >
          ₪{oldPrice}
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "52%",
              height: 7,
              width: `calc(${strike}% + 20px)`,
              background: "#c0392b",
              borderRadius: 4,
              transform: "rotate(-6deg)",
            }}
          />
        </div>
        <div
          dir="ltr"
          style={{
            fontSize: 190,
            fontWeight: 900,
            lineHeight: 1.05,
            color: colors.white,
            background: colors.tealDeep,
            borderRadius: 60,
            padding: "6px 70px 26px",
            boxShadow: "0 24px 60px rgba(12,79,77,0.35)",
            transform: `scale(${priceIn})`,
          }}
        >
          ₪{price}
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 72,
            fontWeight: 800,
            color: colors.tealDeep,
            background: goldGradient,
            borderRadius: 80,
            padding: "14px 110px 26px",
            opacity: button,
            transform: `translateY(${(1 - button) * 50}px) scale(${pulse})`,
            boxShadow: "0 16px 40px rgba(167,122,38,0.35)",
          }}
        >
          {cta}
        </div>
        {contact ? (
          <div
            dir="ltr"
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: colors.ink,
              opacity: button,
            }}
          >
            {contact}
          </div>
        ) : null}
        <div
          style={{
            marginTop: 30,
            fontSize: 44,
            fontWeight: 600,
            color: colors.ink,
            opacity: tagline,
          }}
        >
          بشرة مرطبة، أكثر شباباً وإشراقاً
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 60,
          opacity: tagline,
        }}
      >
        <Logo width={300} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Composition,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Cairo (SIL Open Font License) is bundled in public/fonts so renders
// don't depend on reaching Google Fonts. Both files are variable fonts
// covering weights 200–1000.
const fontFamily = "Cairo";
loadFont({
  family: fontFamily,
  url: staticFile("fonts/Cairo-arabic.woff2"),
  weight: "200 1000",
  unicodeRange:
    "U+0600-06FF, U+0750-077F, U+0870-08FF, U+200C-200E, U+FB50-FDFF, U+FE70-FEFC",
});
loadFont({
  family: fontFamily,
  url: staticFile("fonts/Cairo-latin.woff2"),
  weight: "200 1000",
  unicodeRange: "U+0000-00FF, U+2000-206F, U+FEFF, U+FFFD",
});

type Props = {
  title: string;
  subtitle: string;
};

const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  return {};
};

export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={150}
      fps={30}
      width={1280}
      height={720}
      defaultProps={{
        title: "مرحباً بك في Remotion",
        subtitle: "أول فيديو مصنوع بالكود",
      }}
      calculateMetadata={calculateMetadata}
    />
  );
};

export const MyComponent: React.FC<Props> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const words = title.split(" ");

  const subtitleOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barWidth = interpolate(frame, [0, durationInFrames - 1], [0, 100]);

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0b1d3a 0%, #1f4e8c 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
        color: "white",
        opacity: fadeOut,
      }}
    >
      <div
        dir="rtl"
        lang="ar"
        style={{ fontSize: 88, fontWeight: 700, textAlign: "center" }}
      >
        {words.map((word, i) => {
          const progress = spring({
            frame: frame - i * 8,
            fps,
            config: { damping: 200 },
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginInline: 14,
                opacity: progress,
                transform: `translateY(${(1 - progress) * 40}px)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontSize: 44,
          marginTop: 24,
          opacity: subtitleOpacity,
          color: "#9fd3ff",
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          height: 10,
          width: `${barWidth}%`,
          background: "#4fc3f7",
        }}
      />
    </AbsoluteFill>
  );
};

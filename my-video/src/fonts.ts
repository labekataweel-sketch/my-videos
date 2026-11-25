import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Cairo (SIL Open Font License) is bundled in public/fonts so renders
// don't depend on reaching Google Fonts. The files are variable fonts
// covering weights 200–1000.
export const fontFamily = "Cairo";

const faces = [
  {
    file: "fonts/Cairo-arabic.woff2",
    unicodeRange:
      "U+0600-06FF, U+0750-077F, U+0870-08FF, U+200C-200E, U+FB50-FDFF, U+FE70-FEFC",
  },
  {
    file: "fonts/Cairo-latin.woff2",
    unicodeRange: "U+0000-00FF, U+2000-206F, U+FEFF, U+FFFD",
  },
  {
    // Includes the shekel sign (U+20AA).
    file: "fonts/Cairo-latin-ext.woff2",
    unicodeRange: "U+0100-02BA, U+02BD-02C5, U+20A0-20AB, U+20AD-20C4, U+A720-A7FF",
  },
];

for (const face of faces) {
  loadFont({
    family: fontFamily,
    url: staticFile(face.file),
    weight: "200 1000",
    unicodeRange: face.unicodeRange,
  });
}

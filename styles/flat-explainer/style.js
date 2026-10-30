// Flat Explainer — light paper ground, flat vector fills, navy ink, chunky
// offset shadows and confetti decor. Original direction inspired by the mood of
// a flat explainer reference illustration; no assets copied.
export const STYLE = {
  id: "flat-explainer",
  name: "Flat Explainer",
  colors: {
    paper: "#F3F4F8",
    paper2: "#E4E8F0",
    ink: "#15263B",
    ink2: "#22385A",
    white: "#FFFFFF",
    red: "#FF5858",
    redDeep: "#D63E3E",
    blue: "#0B92E5",
    blueDeep: "#0A6FB0",
    yellow: "#FFD20A",
    green: "#3DBE8B",
    greenDeep: "#2A9468",
    pink: "#F59AAA",
    purple: "#9B7BF7",
    skin: "#F7B1A1",
    skin2: "#C98463",
    hair: "#15263B",
    hair2: "#8A6A55",
    screen: "#EAF6FF",
  },
  // Scene grounds: text colour, marker colour behind emphasised words, card
  // fill, confetti palette.
  grounds: {
    paper: { bg: "paper", fg: "ink", muted: "#5D6B80", mark: "yellow", markFg: "ink", accent: "red", confetti: ["red", "blue", "yellow", "purple"] },
    ink: { bg: "ink", fg: "white", muted: "#A9B6C9", mark: "yellow", markFg: "ink", accent: "yellow", confetti: ["yellow", "blue", "pink", "green"] },
    red: { bg: "red", fg: "white", muted: "#FFE1E1", mark: "ink", markFg: "white", accent: "yellow", confetti: ["yellow", "ink", "white"] },
    blue: { bg: "blue", fg: "white", muted: "#D6EEFF", mark: "yellow", markFg: "ink", accent: "yellow", confetti: ["yellow", "white", "ink"] },
    yellow: { bg: "yellow", fg: "ink", muted: "#5A4A00", mark: "red", markFg: "white", accent: "red", confetti: ["red", "ink", "white"] },
    green: { bg: "green", fg: "ink", muted: "#11402D", mark: "white", markFg: "ink", accent: "ink", confetti: ["yellow", "ink", "white"] },
  },
  fonts: {
    display: { family: "Poppins", weight: 800 },
    body: { family: "Poppins", weight: 600 },
    mono: { family: "JetBrains Mono", weight: 700 },
  },
  shape: { radius: 32, radiusSmall: 18, stroke: 6, shadow: "12px 12px 0" },
  rhythm: { sceneMin: 2.5, sceneMax: 11, sceneHardMax: 15, overlap: 0.6, lead: 0.12 },
  transitions: ["whip", "zoom", "iris", "rise", "flood", "cut"],
  forbid: ["photorealism", "neon-glow", "tiny-ui-text", "unmotivated-gradients", "hex-in-scenes"],
};

export default STYLE;

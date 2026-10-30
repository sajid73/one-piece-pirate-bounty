export interface PhotoConfig {
  dataUrl: string | null;
  offsetX: number;
  offsetY: number;
  zoom: number;
  rotation: number;
}

export interface PosterConfig {
  photo: PhotoConfig;
  name: string;
  epithet: string;
  bounty: string;
  bountyPrefix: string;
  headerFont: string;
  nameFont: string;
  bodyFont: string;
  paperColor: string;
  paperTexture: "smooth" | "rough" | "aged" | "burnt";
  textureIntensity: number;
  borderStyle: "none" | "simple" | "ornate" | "double";
  borderColor: string;
  textColor: string;
  accentColor: string;
  showMarine: boolean;
  showCornerOrnaments: boolean;
  deadOrAlive: string;
}

export const POSTER_WIDTH = 600;
export const POSTER_HEIGHT = 850;

export const FONT_OPTIONS = [
  { label: "Pirata One", value: "Pirata One" },
  { label: "Cinzel", value: "Cinzel" },
  { label: "IM Fell English", value: "IM Fell English" },
  { label: "Special Elite", value: "Special Elite" },
  { label: "Almendra", value: "Almendra" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
];

export const PAPER_PRESETS = [
  { label: "Aged Ivory", color: "#f5e6c8" },
  { label: "Dark Parchment", color: "#e8d5a8" },
  { label: "Warm Sepia", color: "#d4b896" },
  { label: "Bleached", color: "#f0ead6" },
  { label: "Coffee Stained", color: "#c4a875" },
  { label: "Smoke Damaged", color: "#b8a898" },
];

export const DEFAULT_CONFIG: PosterConfig = {
  photo: { dataUrl: null, offsetX: 0, offsetY: 0, zoom: 1, rotation: 0 },
  name: "YOUR NAME",
  epithet: "",
  bounty: "3,000,000,000",
  bountyPrefix: "$",
  headerFont: "Pirata One",
  nameFont: "Cinzel",
  bodyFont: "IM Fell English",
  paperColor: "#f5e6c8",
  paperTexture: "aged",
  textureIntensity: 0.5,
  borderStyle: "none",
  borderColor: "#3d2b1f",
  textColor: "#2b1810",
  accentColor: "#8b0000",
  showMarine: true,
  showCornerOrnaments: false,
  deadOrAlive: "DEAD OR ALIVE",
};

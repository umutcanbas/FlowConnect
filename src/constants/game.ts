import { Dimensions } from "react-native";
import { Levels } from "../types/game";

// Game Constants
export const GRID_SIZE = 5;
export const SCREEN_WIDTH = Dimensions.get("window").width;
export const CELL_SIZE = (SCREEN_WIDTH - 60) / GRID_SIZE;

// Level Definitions
export const LEVELS: Levels = {
  level1: {
    dots: [
      { color: "red", start: [0, 0], end: [0, 2] },     // Üst sıra, kısa yol
      { color: "blue", start: [4, 0], end: [4, 2] },   // Alt sıra, kısa yol
      { color: "green", start: [2, 4], end: [2, 2] },  // Sağdan ortaya kısa yol
    ],
  },
  level2: {
    dots: [
      { color: "red", start: [0, 0], end: [2, 0] },     // Sol kenar aşağı
      { color: "blue", start: [0, 4], end: [2, 4] },   // Sağ kenar aşağı
      { color: "green", start: [4, 1], end: [4, 3] },  // Alt kenar kısa
    ],
  },
  level3: {
    dots: [
      { color: "red", start: [0, 0], end: [2, 2] },     // Sol üstten merkeze çapraz
      { color: "blue", start: [0, 4], end: [4, 0] },   // Sağ üstten sol alta çapraz
      { color: "green", start: [4, 2], end: [4, 4] },  // Alt kenarda kısa yatay
    ],
  },
  level4: {
    dots: [
      { color: "red", start: [0, 0], end: [0, 4] },     // Üst sırada yatay
      { color: "blue", start: [4, 0], end: [4, 4] },   // Alt sırada yatay
      { color: "green", start: [1, 2], end: [3, 2] },  // Ortada dikey kısa
    ],
  },
  level5: {
    dots: [
      { color: "red", start: [0, 0], end: [2, 0] },     // Sol kenarda kısa dikey
      { color: "blue", start: [0, 4], end: [2, 4] },   // Sağ kenarda kısa dikey
      { color: "green", start: [4, 1], end: [4, 3] },  // Alt kenarda kısa yatay
    ],
  },
};

// Game Colors
export const GAME_COLORS = {
  BACKGROUND: "#1a1a1a",
  GRID_BACKGROUND: "#2a2a2a",
  CELL_BACKGROUND: "#3a3a3a",
  CELL_BORDER: "#4a4a4a",
  CELL_TEXT: "#888",
  INFO_TEXT: "#aaa",
  CURRENT_PATH: "#ffffff",
  DOT_BORDER: "#fff",
} as const;

// Path Visual Settings
export const PATH_STYLES = {
  COMPLETED: {
    strokeWidth: "6",
    strokeOpacity: "0.7",
  },
  CURRENT: {
    strokeWidth: "5",
    strokeOpacity: "1.0",
  },
  INCOMPLETE: {
    strokeWidth: "4",
    strokeOpacity: "0.5",
    strokeDasharray: "6,3",
  },
} as const;
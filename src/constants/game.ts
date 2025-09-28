import { Dimensions } from "react-native";
import { Levels } from "../types/game";

export const GRID_SIZE = 5;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const IS_SMALL_SCREEN = SCREEN_WIDTH <= 375 || SCREEN_HEIGHT <= 667;

const HORIZONTAL_PADDING = IS_SMALL_SCREEN ? 20 : 40;
const VERTICAL_RESERVE = IS_SMALL_SCREEN ? 200 : 180;

const AVAILABLE_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING;
const AVAILABLE_HEIGHT = SCREEN_HEIGHT - VERTICAL_RESERVE;

const MAX_GRID_SIZE = IS_SMALL_SCREEN ? 280 : 350;
const CALCULATED_SIZE = Math.min(AVAILABLE_WIDTH, AVAILABLE_HEIGHT, MAX_GRID_SIZE);

export const CELL_SIZE = Math.floor(CALCULATED_SIZE / GRID_SIZE);
export const BOARD_SIZE = CELL_SIZE * GRID_SIZE;

export const LEVELS: Levels = {
  level1: {
    dots: [
      { color: "red", start: [0, 0], end: [0, 2] },
      { color: "blue", start: [4, 0], end: [4, 2] },
      { color: "green", start: [2, 4], end: [2, 2] },
    ],
  },
  level2: {
    dots: [
      { color: "red", start: [0, 0], end: [2, 0] },
      { color: "blue", start: [0, 4], end: [2, 4] },
      { color: "green", start: [4, 1], end: [4, 3] },
    ],
  },
  level3: {
    dots: [
      { color: "red", start: [0, 0], end: [2, 2] },
      { color: "blue", start: [0, 4], end: [4, 0] },
      { color: "green", start: [4, 2], end: [4, 4] },
    ],
  },
  level4: {
    dots: [
      { color: "red", start: [0, 0], end: [0, 4] },
      { color: "blue", start: [4, 0], end: [4, 4] },
      { color: "green", start: [1, 2], end: [3, 2] },
    ],
  },
  level5: {
    dots: [
      { color: "red", start: [0, 0], end: [2, 0] },
      { color: "blue", start: [0, 4], end: [2, 4] },
      { color: "green", start: [4, 1], end: [4, 3] },
    ],
  },
};

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
export const COLORS = {
  BACKGROUND: "#1a1a1a",
  GRID_BACKGROUND: "#2a2a2a",
  CELL_BACKGROUND: "transparent",

  GRID_BORDER: "#555",
  CELL_BORDER: "#444",
  DOT_BORDER: "#fff",

  PRIMARY_TEXT: "#ffffff",
  SECONDARY_TEXT: "#aaa",
  DISABLED_TEXT: "#999",

  BUTTON: {
    UNDO: "#4a90e2",
    RESET: "#e74c3c",
    NEXT_LEVEL: "#4caf50",
    DISABLED: "#666",

    TEXT: "#fff",
    TEXT_DISABLED: "#999",

    SUCCESS_BACKGROUND: "#2d5a27",
    SUCCESS_BORDER: "#4caf50",
    SUCCESS_TEXT: "#4caf50",
  },

  CURRENT_PATH: "#ffffff",
  PATH_STROKE: "0.7",
  INCOMPLETE_PATH_STROKE: "0.5",

  GAME: {
    RED: "red",
    BLUE: "blue",
    GREEN: "green",
    YELLOW: "yellow",
    PURPLE: "purple",
    ORANGE: "orange",
  },
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

export type ColorKeys = keyof typeof COLORS;

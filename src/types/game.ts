export interface Dot {
  color: string;
  start: [number, number];
  end: [number, number];
}

export interface LevelData {
  dots: Dot[];
}

export interface Levels {
  [key: string]: LevelData;
}

export type GridCell = string | number;
export type Grid = GridCell[][];

export interface StartDot {
  row: number;
  col: number;
  color: string;
}

export interface PathCollection {
  [color: string]: [number, number][];
}

export interface LevelHeaderProps {
  currentLevel: string;
  levelIndex: number;
  totalLevels: number;
}

export interface GameControlsProps {
  onUndo: () => void;
  canUndo: boolean;
  onReset: () => void;
  isLevelComplete: boolean;
  onNextLevel: () => void;
  isLastLevel: boolean;
}

export interface GameBoardProps {
  grid: Grid;
  paths: {
    [color: string]: { row: number; col: number }[];
  };
  onGestureEvent: any;
  onHandlerStateChange: any;
  gridSize: number;
  cellSize: number;
}

import { useState } from "react";
import { State } from "react-native-gesture-handler";
import { Grid, LevelData, StartDot, PathCollection, Dot } from "../types/game";
import { GRID_SIZE, CELL_SIZE, LEVELS } from "../constants/game";

export function useGameLogic() {
  const [currentLevel, setCurrentLevel] = useState<string>("level1");
  const [levelData, setLevelData] = useState<LevelData>(LEVELS[currentLevel]);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);

  const generateGridFromLevel = (levelData: LevelData): Grid => {
    const grid: Grid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));

    levelData.dots.forEach((dot: Dot) => {
      const [startRow, startCol] = dot.start;
      const [endRow, endCol] = dot.end;

      grid[startRow][startCol] = dot.color;
      grid[endRow][endCol] = dot.color;
    });

    return grid;
  };

  const [grid, setGrid] = useState<Grid>(() =>
    generateGridFromLevel(levelData)
  );

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);
  const [startDot, setStartDot] = useState<StartDot | null>(null);
  const [completedPaths, setCompletedPaths] = useState<PathCollection>({});
  const [incompletePaths, setIncompletePaths] = useState<PathCollection>({});

  const isAdjacentCell = (
    from: [number, number],
    to: [number, number]
  ): boolean => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const isValidPosition = (row: number, col: number): boolean => {
    return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;
  };

  const isValidMove = (newRow: number, newCol: number): boolean => {
    if (!startDot || currentPath.length === 0) return false;

    const lastPosition = currentPath[currentPath.length - 1];

    if (
      !isValidPosition(newRow, newCol) ||
      !isAdjacentCell(lastPosition, [newRow, newCol])
    ) {
      return false;
    }

    const cellValue = grid[newRow][newCol];

    const isInCompletedPath = Object.entries(completedPaths).some(
      ([color, path]) => {
        if (color === startDot.color) return false;
        return path.some(([r, c]) => r === newRow && c === newCol);
      }
    );

    if (isInCompletedPath) {
      return false;
    }

    const isInOtherIncompletePath = Object.entries(incompletePaths).some(
      ([color, path]) => {
        if (color === startDot.color) return false;
        return path.some(([r, c]) => r === newRow && c === newCol);
      }
    );

    if (isInOtherIncompletePath) {
      return false;
    }

    if (cellValue !== 0) {
      if (cellValue === startDot.color) {
        const targetDot = levelData.dots.find(
          (dot) => dot.color === startDot.color
        );
        if (targetDot) {
          const [startRowTarget, startColTarget] = targetDot.start;
          const [endRow, endCol] = targetDot.end;

          const isStartDot =
            startRowTarget === newRow && startColTarget === newCol;
          const isEndDot = endRow === newRow && endCol === newCol;

          if (isStartDot || isEndDot) {
            return true;
          }
        }
      }
      return false;
    }

    return true;
  };

  const checkPathCompletion = (
    path: [number, number][],
    color: string
  ): boolean => {
    if (path.length < 2) return false;

    const targetDot = levelData.dots.find((dot) => dot.color === color);
    if (!targetDot) return false;

    const [startRow, startCol] = targetDot.start;
    const [endRow, endCol] = targetDot.end;
    const firstPosition = path[0];
    const lastPosition = path[path.length - 1];

    const startsAtStart =
      firstPosition[0] === startRow && firstPosition[1] === startCol;
    const endsAtEnd = lastPosition[0] === endRow && lastPosition[1] === endCol;
    const startsAtEnd =
      firstPosition[0] === endRow && firstPosition[1] === endCol;
    const endsAtStart =
      lastPosition[0] === startRow && lastPosition[1] === startCol;

    const isComplete =
      (startsAtStart && endsAtEnd) || (startsAtEnd && endsAtStart);

    return isComplete;
  };

  const completeConnection = (path: [number, number][], color: string) => {
    setCompletedPaths((prev) => ({
      ...prev,
      [color]: [...path],
    }));

    setIncompletePaths((prev) => {
      const newIncompletePaths = { ...prev };
      delete newIncompletePaths[color];
      return newIncompletePaths;
    });

    const totalDots = levelData.dots.length;
    const completedCount = Object.keys(completedPaths).length + 1;

    if (completedCount === totalDots) {
      setIsLevelComplete(true);
    }
  };

  const resetLevel = () => {
    setCompletedPaths({});
    setIncompletePaths({});
    setCurrentPath([]);
    setIsDragging(false);
    setStartDot(null);
    setIsLevelComplete(false);
    setGrid(generateGridFromLevel(levelData));
  };

  const undoLastConnection = () => {
    const completedColors = Object.keys(completedPaths);
    const incompleteColors = Object.keys(incompletePaths);

    if (incompleteColors.length > 0) {
      const lastIncompleteColor = incompleteColors[incompleteColors.length - 1];
      const newIncompletePaths = { ...incompletePaths };
      delete newIncompletePaths[lastIncompleteColor];
      setIncompletePaths(newIncompletePaths);
    } else if (completedColors.length > 0) {
      const lastCompletedColor = completedColors[completedColors.length - 1];
      const newCompletedPaths = { ...completedPaths };
      delete newCompletedPaths[lastCompletedColor];
      setCompletedPaths(newCompletedPaths);
    }

    setCurrentPath([]);
    setIsDragging(false);
    setStartDot(null);

    setIsLevelComplete(false);
  };

  const nextLevel = () => {
    const levelNumbers = Object.keys(LEVELS).sort();
    const currentIndex = levelNumbers.indexOf(currentLevel);

    if (currentIndex < levelNumbers.length - 1) {
      const nextLevelName = levelNumbers[currentIndex + 1];
      setCurrentLevel(nextLevelName);
      setLevelData(LEVELS[nextLevelName]);

      setCompletedPaths({});
      setIncompletePaths({});
      setCurrentPath([]);
      setIsDragging(false);
      setStartDot(null);
      setIsLevelComplete(false);
      setGrid(generateGridFromLevel(LEVELS[nextLevelName]));
    } else {
    }
  };

  const getGridCoordinatesFromPan = (
    x: number,
    y: number
  ): [number, number] | null => {
    const BOARD_PADDING = 10;

    const adjustedX = x - BOARD_PADDING;
    const adjustedY = y - BOARD_PADDING;

    const col = Math.floor(adjustedX / (CELL_SIZE + 2));
    const row = Math.floor(adjustedY / (CELL_SIZE + 2));

    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      return [row, col];
    }

    return null;
  };

  const onPanGestureEvent = (event: any) => {
    if (!isDragging || !startDot) return;

    const { x, y } = event.nativeEvent;
    const coordinates = getGridCoordinatesFromPan(x, y);

    if (coordinates) {
      const [row, col] = coordinates;

      const targetIndex = currentPath.findIndex(
        ([r, c]) => r === row && c === col
      );

      if (targetIndex >= 0 && targetIndex < currentPath.length - 1) {
        const newPath = currentPath.slice(0, targetIndex + 1);
        setCurrentPath(newPath);
        return;
      }

      if (isValidMove(row, col)) {
        const lastPosition = currentPath[currentPath.length - 1];

        if (lastPosition[0] === row && lastPosition[1] === col) {
          return;
        }

        const isAlreadyInPath = currentPath.some(
          ([r, c]) => r === row && c === col
        );

        if (!isAlreadyInPath) {
          const newPath: [number, number][] = [
            ...currentPath,
            [row, col] as [number, number],
          ];
          setCurrentPath(newPath);

          if (checkPathCompletion(newPath, startDot.color)) {
            completeConnection(newPath, startDot.color);
            setIsDragging(false);
            setStartDot(null);
            setCurrentPath([]);
            return;
          }
        } else {
        }
      }
    }
  };

  const onPanHandlerStateChange = (event: any) => {
    const { state, x, y } = event.nativeEvent;

    if (state === State.BEGAN) {
      const coordinates = getGridCoordinatesFromPan(x, y);
      if (!coordinates) return;

      const [row, col] = coordinates;
      const cellValue = grid[row][col];

      if (cellValue !== 0) {
        const color = cellValue as string;

        if (completedPaths[color]) {
          return;
        }

        setIsDragging(true);
        setStartDot({ row, col, color });

        const existingIncompletePath = incompletePaths[color];
        if (existingIncompletePath) {
          const pathStart = existingIncompletePath[0];
          const pathEnd =
            existingIncompletePath[existingIncompletePath.length - 1];

          if (pathStart[0] === row && pathStart[1] === col) {
            setCurrentPath([...existingIncompletePath.reverse()]);
          } else if (pathEnd[0] === row && pathEnd[1] === col) {
            setCurrentPath([...existingIncompletePath]);
          } else {
            setCurrentPath([[row, col]]);
          }

          const newIncompletePaths = { ...incompletePaths };
          delete newIncompletePaths[color];
          setIncompletePaths(newIncompletePaths);
        } else {
          setCurrentPath([[row, col]]);
        }
      } else {
        const incompletePath = Object.entries(incompletePaths).find(
          ([color, path]) => {
            const pathEnd = path[path.length - 1];
            return pathEnd[0] === row && pathEnd[1] === col;
          }
        );

        if (incompletePath) {
          const [color, path] = incompletePath;

          if (completedPaths[color]) {
            return;
          }

          setIsDragging(true);
          setStartDot({ row: path[0][0], col: path[0][1], color });
          setCurrentPath([...path]);

          const newIncompletePaths = { ...incompletePaths };
          delete newIncompletePaths[color];
          setIncompletePaths(newIncompletePaths);
        }
      }
    } else if (state === State.END || state === State.CANCELLED) {
      if (isDragging && startDot && currentPath.length > 1) {
        if (checkPathCompletion(currentPath, startDot.color)) {
          completeConnection(currentPath, startDot.color);
          setCurrentPath([]);
        } else {
          setIncompletePaths((prev) => ({
            ...prev,
            [startDot.color]: [...currentPath],
          }));
          setCurrentPath([]);
        }
      } else if (isDragging && currentPath.length <= 1) {
        setCurrentPath([]);
      }
      setIsDragging(false);
      setStartDot(null);
    }
  };

  return {
    currentLevel,
    isLevelComplete,
    grid,
    currentPath,
    completedPaths,
    incompletePaths,
    resetLevel,
    undoLastConnection,
    nextLevel,
    onPanGestureEvent,
    onPanHandlerStateChange,
  };
}

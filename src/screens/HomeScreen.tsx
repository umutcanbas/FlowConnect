import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
interface Dot {
  color: string;
  start: [number, number];
  end: [number, number];
}

interface LevelData {
  dots: Dot[];
}

interface Levels {
  [key: string]: LevelData;
}

type GridCell = string | number;
type Grid = GridCell[][];

const GRID_SIZE = 5;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CELL_SIZE = (SCREEN_WIDTH - 60) / GRID_SIZE;

export default function HomeScreen(): React.JSX.Element {
  // Level data
  const levels: Levels = {
    level1: {
      dots: [
        { color: "red", start: [0, 0], end: [2, 2] },
        { color: "blue", start: [1, 4], end: [3, 1] },
      ],
    },
    level2: {
      dots: [
        { color: "red", start: [0, 1], end: [4, 3] },
        { color: "blue", start: [2, 0], end: [1, 4] },
        { color: "green", start: [3, 2], end: [0, 4] },
      ],
    },
  };

  // Level states
  const [currentLevel, setCurrentLevel] = useState<string>("level1");
  const [levelData, setLevelData] = useState<LevelData>(levels[currentLevel]);

  // Grid generator
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

  // Render functions
  const renderCell = (
    rowIndex: number,
    colIndex: number
  ): React.JSX.Element => {
    const cellValue = grid[rowIndex][colIndex];
    const isColoredDot = cellValue !== 0;

    return (
      <View
        key={`${rowIndex}-${colIndex}`}
        style={[styles.cell, { width: CELL_SIZE, height: CELL_SIZE }]}
      >
        {isColoredDot ? (
          <View
            style={[styles.dot, { backgroundColor: cellValue as string }]}
          />
        ) : (
          <Text style={styles.cellText}>
            {rowIndex},{colIndex}
          </Text>
        )}
      </View>
    );
  };

  const renderGrid = (): React.JSX.Element[] => {
    return grid.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Flow Connect</Text>
      <Text style={styles.levelText}>{currentLevel.toUpperCase()}</Text>

      <View style={styles.gameBoard}>{renderGrid()}</View>

      <Text style={styles.info}>
        Grid Size: {GRID_SIZE}x{GRID_SIZE}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  levelText: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 20,
  },
  gameBoard: {
    backgroundColor: "#2a2a2a",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    backgroundColor: "#3a3a3a",
    margin: 1,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4a4a4a",
  },
  cellText: {
    color: "#888",
    fontSize: 10,
    textAlign: "center",
  },
  info: {
    marginTop: 20,
    color: "#aaa",
    fontSize: 14,
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
});

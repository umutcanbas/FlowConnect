import React from "react";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LevelHeader from "../components/game/LevelHeader";
import GameControls from "../components/game/GameControls";
import GameBoard from "../components/game/GameBoard";

import { useGameLogic } from "../hooks/useGameLogic";

import { GRID_SIZE, CELL_SIZE, LEVELS } from "../constants/game";

export default function HomeScreen(): React.JSX.Element {
  const gameLogic = useGameLogic();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <LevelHeader
          currentLevel={gameLogic.currentLevel}
          levelIndex={Object.keys(LEVELS).indexOf(gameLogic.currentLevel)}
          totalLevels={Object.keys(LEVELS).length}
        />

        <GameBoard
          grid={gameLogic.grid}
          paths={{
            ...Object.fromEntries(
              Object.entries(gameLogic.completedPaths).map(([color, path]) => [
                color,
                path.map(([row, col]) => ({ row, col })),
              ])
            ),
            ...Object.fromEntries(
              Object.entries(gameLogic.incompletePaths).map(([color, path]) => [
                `incomplete-${color}`,
                path.map(([row, col]) => ({ row, col })),
              ])
            ),
            ...(gameLogic.currentPath.length > 0 && {
              current: gameLogic.currentPath.map(([row, col]) => ({
                row,
                col,
              })),
            }),
          }}
          onGestureEvent={gameLogic.onPanGestureEvent}
          onHandlerStateChange={gameLogic.onPanHandlerStateChange}
          gridSize={GRID_SIZE}
          cellSize={CELL_SIZE + 2}
        />

        <GameControls
          onUndo={gameLogic.undoLastConnection}
          canUndo={
            Object.keys(gameLogic.completedPaths).length > 0 ||
            Object.keys(gameLogic.incompletePaths).length > 0
          }
          onReset={gameLogic.resetLevel}
          isLevelComplete={gameLogic.isLevelComplete}
          onNextLevel={gameLogic.nextLevel}
          isLastLevel={
            Object.keys(LEVELS).indexOf(gameLogic.currentLevel) ===
            Object.keys(LEVELS).length - 1
          }
        />

        <Text style={styles.info}>
          Grid Size: {GRID_SIZE}x{GRID_SIZE}
        </Text>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    paddingTop: 20,
  },
  info: {
    marginTop: 20,
    color: "#aaa",
    fontSize: 14,
  },
});

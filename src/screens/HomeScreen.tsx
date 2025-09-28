import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LevelHeader from "../components/game/LevelHeader";
import GameControls from "../components/game/GameControls";
import GameBoard from "../components/game/GameBoard";

import { useGameLogic } from "../hooks/useGameLogic";

import { GRID_SIZE, CELL_SIZE, LEVELS } from "../constants/game";

export default function HomeScreen(): React.JSX.Element {
  const gameLogic = useGameLogic();

  const transformPath = (path: [number, number][]) =>
    path.map(([row, col]) => ({ row, col }));

  const levelKeys = Object.keys(LEVELS);
  const currentLevelIndex = levelKeys.indexOf(gameLogic.currentLevel);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <LevelHeader
          currentLevel={gameLogic.currentLevel}
          levelIndex={currentLevelIndex}
          totalLevels={levelKeys.length}
        />

        <GameBoard
          grid={gameLogic.grid}
          paths={{
            ...Object.fromEntries(
              Object.entries(gameLogic.completedPaths).map(([color, path]) => [
                color,
                transformPath(path),
              ])
            ),
            ...Object.fromEntries(
              Object.entries(gameLogic.incompletePaths).map(([color, path]) => [
                `incomplete-${color}`,
                transformPath(path),
              ])
            ),
            ...(gameLogic.currentPath.length > 0 && {
              current: transformPath(gameLogic.currentPath),
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
          isLastLevel={currentLevelIndex === levelKeys.length - 1}
        />
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
    paddingBottom: 30,
  },
});

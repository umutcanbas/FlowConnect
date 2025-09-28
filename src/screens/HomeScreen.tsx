import React from "react";
import { StyleSheet, Dimensions } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import LevelHeader from "../components/game/LevelHeader";
import GameControls from "../components/game/GameControls";
import GameBoard from "../components/game/GameBoard";

import { useGameLogic } from "../hooks/useGameLogic";

import { GRID_SIZE, CELL_SIZE, LEVELS } from "../constants/game";
import { COLORS } from "../constants/colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const IS_SMALL_SCREEN = SCREEN_HEIGHT <= 667;

const HomeScreen: React.FC = () => {
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
          cellSize={CELL_SIZE}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: "center",
    paddingTop: IS_SMALL_SCREEN ? 40 : 60,
    paddingBottom: 30,
  },
});

export default HomeScreen;

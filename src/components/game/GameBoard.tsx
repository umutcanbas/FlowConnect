import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Svg, Line } from "react-native-svg";
import { GameBoardProps } from "../../types/game";

const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  paths,
  onGestureEvent,
  onHandlerStateChange,
  gridSize,
  cellSize,
}) => {
  const renderSvgPaths = () => {
    const lines: React.JSX.Element[] = [];

    Object.entries(paths).forEach(([color, path]) => {
      if (path.length > 1) {
        for (let i = 0; i < path.length - 1; i++) {
          const start = path[i];
          const end = path[i + 1];

          const x1 = start.col * cellSize + cellSize / 2;
          const y1 = start.row * cellSize + cellSize / 2;
          const x2 = end.col * cellSize + cellSize / 2;
          const y2 = end.row * cellSize + cellSize / 2;

          const isCurrentPath = color === "current";
          const isIncomplete = color.includes("incomplete");

          let strokeWidth = "6";
          let strokeOpacity = "0.7";
          let strokeColor = color;
          let strokeDasharray = undefined;

          if (isCurrentPath) {
            strokeWidth = "5";
            strokeOpacity = "1.0";
            strokeColor = "#ffffff";
          } else if (isIncomplete) {
            strokeWidth = "4";
            strokeOpacity = "0.5";
            strokeColor = color.replace("incomplete-", "");
            strokeDasharray = "6,3";
          }

          lines.push(
            <Line
              key={`${color}-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={strokeOpacity}
              strokeDasharray={strokeDasharray}
            />
          );
        }
      }
    });

    return lines;
  };

  const renderGrid = () => {
    const gridElements = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellValue = grid[row] && grid[row][col];
        const isColoredDot = cellValue !== 0;

        gridElements.push(
          <View
            key={`${row}-${col}`}
            style={[
              styles.cell,
              {
                left: col * cellSize,
                top: row * cellSize,
                width: cellSize - 2,
                height: cellSize - 2,
              },
            ]}
          >
            {isColoredDot ? (
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: cellValue as string,
                  },
                ]}
              />
            ) : (
              <Text style={styles.cellText}>
                {row},{col}
              </Text>
            )}
          </View>
        );
      }
    }

    return gridElements;
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <View style={styles.gameBoard}>
        <View
          style={[
            styles.grid,
            { width: gridSize * cellSize, height: gridSize * cellSize },
          ]}
        >
          {renderGrid()}
        </View>

        <Svg
          style={[
            styles.svgOverlay,
            {
              width: gridSize * cellSize,
              height: gridSize * cellSize,
            },
          ]}
        >
          {renderSvgPaths()}
        </Svg>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  gameBoard: {
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    position: "relative",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
  },
  cell: {
    position: "absolute",
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
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  svgOverlay: {
    position: "absolute",
  },
});

export default GameBoard;

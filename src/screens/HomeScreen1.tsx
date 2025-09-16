import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  // Sabitler
  const GRID_SIZE = 4;
  const CELL_SIZE = 80;

  // Fonksiyonlar
  const createEmptyGrid = () => {
    return Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));
  };
  const renderCell = (rowIndex: number, colIndex: number) => {
    const cellValue = grid[rowIndex][colIndex];

    return (
      <View
        key={`${rowIndex}-${colIndex}`}
        style={[
          styles.cell,
          {
            width: CELL_SIZE,
            height: CELL_SIZE,
          },
        ]}
      ></View>
    );
  };
  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <View key={rowIndex} style={{ flexDirection: "row" }}>
        {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
      </View>
    ));
  };

  // Component içinde
  const [grid, setGrid] = useState(createEmptyGrid);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameBoard}>{renderGrid()}</View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  gameBoard: {
    backgroundColor: "#2a2a2a",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
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
});

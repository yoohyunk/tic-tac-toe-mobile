import { router } from "expo-router";
import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

const createBoard = (rows: number, cols: number): string[][] => {
  return Array.from({ length: rows }, () => Array(cols).fill(""));
};

interface TicTacToeBoardProps {
  rows?: number;
  cols?: number;
}

const TicTacToeBoard = ({ rows = 4, cols = 4 }: TicTacToeBoardProps) => {
  const [board, setBoard] = useState<string[][]>(() => createBoard(rows, cols));
  const CELL_SIZE = 80;
  const THICKNESS = 10;

  const boardWidth = cols * CELL_SIZE;
  const boardHeight = rows * CELL_SIZE;

  const handleCellPress = (row: number, col: number) => {
    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? "X" : cell
      )
    );
    setBoard(newBoard);
  };

  const getCellColor = (rowIndex: number, colIndex: number) => {
    return (rowIndex + colIndex) % 2 === 0 ? "#e4e3f0" : "#FFFFFF";
  };

  return (
    <View
      style={[
        styles.boardContainer,
        { width: boardWidth + THICKNESS, height: boardHeight + THICKNESS },
      ]}
    >
      <View
        style={[
          styles.boardExtrude,
          { width: boardWidth, height: boardHeight },
        ]}
      />

      <View
        style={[
          styles.boardSurface,
          { width: boardWidth, height: boardHeight },
        ]}
      >
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.cell,
                  { backgroundColor: getCellColor(rowIndex, colIndex) },
                ]}
                onPress={() => handleCellPress(rowIndex, colIndex)}
              >
                <Text style={styles.cellText}>{cell}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default function GamePlay() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/")}
        >
          <Text style={styles.buttonText}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.level}>Level 0</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
      </View>

      <TicTacToeBoard rows={4} cols={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#40395b",

    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  level: {
    fontSize: 25,
    fontWeight: "600",
    borderRadius: 40,
    backgroundColor: "#4c436c",
    paddingVertical: 5,
    paddingHorizontal: 20,

    color: "#FFFFFF",
  },
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    padding: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
  },
  boardContainer: {
    position: "relative",

    transform: [{ perspective: 700 }, { rotateX: "35deg" }],
  },
  boardExtrude: {
    position: "absolute",
    top: 10,

    backgroundColor: "#81619b",
    borderRadius: 10,
    zIndex: 0,
  },
  boardSurface: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#FFF",
    borderRadius: 10,
    overflow: "hidden",
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    fontSize: 32,
  },
});

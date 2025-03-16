import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { handlePlayerMove } from "../firebase/roomManager";

interface TicTacToeBoardProps {
  board: { [key: string]: string };
  roomId: string;
  userId: string;
  rows?: number;
  cols?: number;
}

const TicTacToeBoard = ({
  board,
  roomId,
  userId,
  rows = 3,
  cols = 3,
}: TicTacToeBoardProps) => {
  const CELL_SIZE = 80;
  const THICKNESS = 10;

  const boardWidth = cols * CELL_SIZE;
  const boardHeight = rows * CELL_SIZE;

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
      {/* Extruded background for a 3D effect */}
      <View
        style={[
          styles.boardExtrude,
          { width: boardWidth, height: boardHeight },
        ]}
      />
      {/* Main game board surface */}
      <View
        style={[
          styles.boardSurface,
          { width: boardWidth, height: boardHeight },
        ]}
      >
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {Array.from({ length: cols }).map((_, colIndex) => {
              const cellKey = `${rowIndex}_${colIndex}`;
              return (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.cell,
                    { backgroundColor: getCellColor(rowIndex, colIndex) },
                  ]}
                  onPress={() =>
                    handlePlayerMove(roomId, userId, rowIndex, colIndex)
                  }
                >
                  <Text style={styles.cellText}>{board[cellKey]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

export default TicTacToeBoard;

const styles = StyleSheet.create({
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
    fontSize: 48,
    fontWeight: "900",
    color: "#e76679",
  },
});

import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { handlePlayerMove } from "../firebase/roomManager";

interface TicTacToeBoardProps {
  board: { [key: string]: string };
  roomId: string;
  userId: string;
}

const TicTacToeBoard = ({ board, roomId, userId }: TicTacToeBoardProps) => {
  return (
    <View style={styles.boardContainer}>
      {[0, 1, 2].map((row) => (
        <View key={row} style={styles.row}>
          {[0, 1, 2].map((col) => (
            <TouchableOpacity
              key={`${row}_${col}`}
              style={[
                styles.cell,
                { backgroundColor: board[`${row}_${col}`] ? "#ddd" : "#fff" },
              ]}
              onPress={() => handlePlayerMove(roomId, userId, row, col)}
            >
              <Text style={styles.cellText}>{board[`${row}_${col}`]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default TicTacToeBoard;

const styles = StyleSheet.create({
  boardContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: { flexDirection: "row" },
  cell: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000",
  },
  cellText: { fontSize: 48, fontWeight: "900", color: "#e76679" },
});

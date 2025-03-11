import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { assignToRoom, syncGameBoard } from "../firebase/roomManager";
import TicTacToeBoard from "../components/TicTacToeBoard";

export default function GamePlay() {
  const { user } = useAuth();
  const [board, setBoard] = useState<{ [key: string]: string }>({});
  const [roomId, setRoomId] = useState<string | null>(null);
  const [turn, setTurn] = useState<string | null>("X");
  const [loading, setLoading] = useState(true);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      (async () => {
        const assignedRoom = await assignToRoom(user.uid);
        setRoomId(assignedRoom);

        if (assignedRoom) {
          syncGameBoard(assignedRoom, setBoard, setTurn, setPlayers);
        }

        setLoading(false);
      })();
    }
  }, [user]);

  useEffect(() => {
    if (players.length === 2) {
      setOpponentJoined(true);
    }
  }, [players]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.level}>Multiplayer Game</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#56b0e5" />
      ) : !opponentJoined ? (
        <Text style={styles.waitingText}>Waiting for an opponent...</Text>
      ) : (
        <>
          <TicTacToeBoard board={board} roomId={roomId!} userId={user!.uid} />
          <Text style={styles.footerText}>
            {turn === "X" ? "Player 1's Turn" : "Player 2's Turn"}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b9badf",
  },
  header: {
    backgroundColor: "#40395b",
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  level: { fontSize: 25, fontWeight: "600", color: "#FFFFFF" },
  waitingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
  },
  footerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    color: "#FFFFFF",
  },
});

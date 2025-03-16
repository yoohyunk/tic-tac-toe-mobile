import { useEffect, useState } from "react";
import {
  AppState,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import {
  assignToRoom,
  checkGameOver,
  removeUserFromRoom,
  syncGameBoard,
} from "../firebase/roomManager";
import TicTacToeBoard from "../components/TicTacToeBoard";

export default function GamePlay() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const boardSize = params.row ? Number(params.row) : 3;

  // Firebase game state
  const [board, setBoard] = useState<{ [key: string]: string }>({});
  const [roomId, setRoomId] = useState<string | null>(null);
  const [turn, setTurn] = useState<string | null>("X");
  const [loading, setLoading] = useState(true);
  // We expect players to be stored as objects, e.g., { uid: string, displayName: string }
  const [players, setPlayers] = useState<
    Array<{ uid: string; displayName: string }>
  >([]);
  // Track room status and winner
  const [roomStatus, setRoomStatus] = useState<string>("waiting");
  const [winner, setWinner] = useState<string | null>(null);

  // Assign user to a room and sync the game board
  useEffect(() => {
    if (user) {
      (async () => {
        const assignedRoom = await assignToRoom(user.uid, boardSize);
        setRoomId(assignedRoom);
        if (assignedRoom) {
          syncGameBoard(
            assignedRoom,
            setBoard,
            setTurn,
            (playersArray: any, status: string) => {
              setPlayers(playersArray);
              setRoomStatus(status);
            }
          );
        }
        setLoading(false);
      })();
    }
  }, [user, boardSize]);

  // Check if opponent has joined
  useEffect(() => {
    if (players.length === 2) {
      // When two players are in the room, we're no longer loading (for game view)
      setLoading(false);
    }
  }, [players]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (roomId && user) {
        removeUserFromRoom(roomId, user.uid);
      }
    };
  }, [roomId, user]);

  // Remove user when app goes to background
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background" && roomId && user) {
        removeUserFromRoom(roomId, user.uid);
      }
    });
    return () => {
      subscription.remove();
    };
  }, [roomId, user]);

  // Monitor roomStatus changes. When roomStatus is "finished", check winner and navigate.
  useEffect(() => {
    (async () => {
      if (roomId && Object.keys(board).length > 0) {
        const gameOver = await checkGameOver(roomId);
        if (gameOver) {
          setWinner(gameOver);
          router.push({
            pathname: "/gameResult",
            params: { winner: gameOver },
          });
        }
      }
    })();
  }, [roomId, board]);

  // Determine current user nickname and opponent nickname (if joined)
  const currentNickname = user?.displayName || "You";
  const opponentNickname =
    players.length === 2
      ? players.find((p) => p.uid !== user?.uid)?.displayName || "Opponent"
      : "Waiting...";

  return (
    <View style={styles.container}>
      {/* Header */}
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
      {/* Body */}
      <View style={styles.body}>
        <View style={styles.profiles}>
          {/* Current User Profile */}
          <View style={styles.profile}>
            <Text>{currentNickname}</Text>
            <View style={styles.profileImageContainer}>
              <View style={styles.profilePic1}>
                <Text>profile {"\n"}picture</Text>
              </View>
              <View style={styles.cross}>
                <Text style={styles.crossText}>X</Text>
              </View>
            </View>
          </View>
          {/* Opponent Profile */}
          <View style={styles.profile}>
            <Text>{opponentNickname}</Text>
            <View style={styles.profileImageContainer}>
              <View style={styles.profilePic2}>
                <Text>profile {"\n"}picture</Text>
              </View>
              <View style={styles.circle}>
                <Text style={styles.circleText}>O</Text>
              </View>
            </View>
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#56b0e5" />
        ) : !opponentNickname || players.length < 2 ? (
          <Text style={styles.waitingText}>Waiting for an opponent...</Text>
        ) : (
          <>
            <TicTacToeBoard board={board} roomId={roomId!} userId={user!.uid} />
            <Text style={styles.footerText}>
              {turn === "X"
                ? `${currentNickname}'s Turn`
                : `${opponentNickname}'s Turn`}
            </Text>
          </>
        )}
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Points:3000</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b9badf",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    zIndex: -1,
  },
  header: {
    backgroundColor: "#40395b",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 10,
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
  level: {
    fontSize: 25,
    fontWeight: "600",
    borderRadius: 40,
    backgroundColor: "#4c436c",
    paddingVertical: 5,
    paddingHorizontal: 20,
    color: "#FFFFFF",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  profiles: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  profile: {
    alignItems: "center",
    gap: 10,
  },
  profileImageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic1: {
    borderWidth: 20,
    borderColor: "#e76679",
    backgroundColor: "#FFF",
    paddingHorizontal: 13,
    paddingVertical: 20,
    borderRadius: 100,
  },
  profilePic2: {
    borderWidth: 20,
    borderColor: "#53b2df",
    backgroundColor: "#FFF",
    paddingHorizontal: 13,
    paddingVertical: 20,
    borderRadius: 100,
  },
  cross: {
    position: "absolute",
    bottom: -10,
    right: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  crossText: {
    color: "#e76679",
    fontSize: 30,
    fontWeight: "900",
  },
  circle: {
    position: "absolute",
    bottom: -10,
    right: -10,
    borderRadius: 40,
    backgroundColor: "#fff",
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  circleText: {
    color: "#53b2df",
    fontSize: 30,
    fontWeight: "900",
  },
  waitingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
  },
  footer: {
    backgroundColor: "#f0857d",
    width: "40%",
    height: 70,
    padding: 10,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "600",
    textAlign: "center",
  },
});

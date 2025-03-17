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
  createInviteRoom,
  joinRoomWithCode,
  removeUserFromRoom,
  syncGameBoard,
} from "../firebase/roomManager";
import TicTacToeBoard from "../components/TicTacToeBoard";
import * as Clipboard from "expo-clipboard";

export default function GamePlay() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const boardSize = params.row ? Number(params.row) : 3;

  // Firebase game state
  const [board, setBoard] = useState<{ [key: string]: string }>({});
  const [roomId, setRoomId] = useState<string | null>(null);
  const [turn, setTurn] = useState<string | null>("X");
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<
    Array<{ uid: string; displayName: string }>
  >([]);
  const [roomStatus, setRoomStatus] = useState<string>("waiting");
  const [roomType, setRoomType] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      (async () => {
        let assignedRoom: string | null = null;
        if (params.continue) {
          // CONTINUING EXISTING GAME: Use the same room from params.continueRoom
          assignedRoom = params.continue as string;
          setRoomType("invite");
        } else {
          // NOT CONTINUING, HANDLE ROOM ASSIGNMENT
          if (params.room) {
            // JOIN EXISTING ROOM (invite mode)
            setRoomType("invite");
            assignedRoom = await joinRoomWithCode(
              user.uid,
              Array.isArray(params.room) ? params.room[0] : params.room
            );
          } else if (params.type === "invite") {
            // CREATE INVITE-ONLY ROOM
            setRoomType("invite");
            assignedRoom = await createInviteRoom(user.uid, boardSize);
          } else if (params.type === "random") {
            // MATCH RANDOMLY
            assignedRoom = await assignToRoom(user.uid, boardSize);
          }
        }

        if (assignedRoom) {
          setRoomId(assignedRoom);
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
  }, [user, boardSize, params.room, params.type, params.continueRoom]);

  // Check if opponent has joined
  useEffect(() => {
    if (players.length === 2) {
      setLoading(false);
    }
  }, [players]);

  // Cleanup on component unmount
  // useEffect(() => {
  //   return () => {
  //     if (roomId && user) {
  //       removeUserFromRoom(roomId, user.uid);
  //     }
  //   };
  // }, [roomId, user]);
  useEffect(() => {
    return () => {
      // If we're continuing the game in an invite-only room, don't remove the user.
      if (roomId && user) {
        if (!(roomType === "invite")) {
          removeUserFromRoom(roomId, user.uid);
        }
      }
    };
  }, [roomId, user, roomType, params.continue]);

  // Remove user when app goes to background (with grace period for invite rooms)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" && roomId && user) {
        if (params.type === "invite") {
          console.log("⏳ Invite room: giving 5 minutes grace period...");
          timeoutId = setTimeout(() => {
            removeUserFromRoom(roomId, user.uid);
            console.log("❌ User removed after 5-minute grace period.");
          }, 5 * 60 * 1000);
        } else if (params.type === "random") {
          console.log("⚡ Random match: removing immediately...");
          removeUserFromRoom(roomId, user.uid);
        }
      } else if (nextAppState === "active") {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
          console.log("✅ User returned before timeout; removal canceled.");
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [roomId, user, params.type]);

  // Monitor game over condition
  useEffect(() => {
    (async () => {
      if (roomId && Object.keys(board).length > 0) {
        const gameOver = await checkGameOver(roomId);
        if (gameOver) {
          router.push({
            pathname: "/gameResult",
            params: { winner: gameOver, type: roomType, room: roomId },
          });
        }
      }
    })();
  }, [roomId, board]);

  const copyToClipboard = async () => {
    if (roomId) {
      await Clipboard.setStringAsync(roomId);
      alert("Room code copied to clipboard!");
    }
  };

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
          roomType === "invite" && roomId ? (
            <View style={styles.inviteContainer}>
              <Text style={styles.inviteText}>Invite Code: {roomId}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={copyToClipboard}
              >
                <Text style={styles.copyButtonText}>Copy Code</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.waitingText}>Setting up the game...</Text>
          )
        ) : players.length < 2 ? (
          roomType === "invite" ? (
            <View>
              <View style={styles.inviteContainer}>
                <Text style={styles.inviteText}>Invite Code: {roomId}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={copyToClipboard}
                >
                  <Text style={styles.copyButtonText}>Copy Code</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.waitingText}>
                Waiting for your friend to join...
              </Text>
            </View>
          ) : (
            <Text style={styles.waitingText}>Waiting for an opponent...</Text>
          )
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
  inviteContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#40395b",
    padding: 10,
    borderRadius: 10,
  },
  inviteText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: "#ec647e",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  copyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

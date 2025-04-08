import { useEffect, useState } from "react";
import {
  AppState,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import {
  assignToAIBoard,
  assignToRoom,
  checkGameOver,
  createInviteRoom,
  handlePlayerMove,
  joinRoomWithCode,
  removeUserFromRoom,
  syncGameBoard,
} from "../firebase/roomManager";
import TicTacToeBoard from "../components/TicTacToeBoard";
import * as Clipboard from "expo-clipboard";
import { getEasyMove } from "../utils/easyBot";
import { getHardMove } from "../utils/hardBot";
import { convertBoardObjectToArray } from "../utils/helper";
import { playLaserSound } from "../utils/soundEffects";
import { avatarMap, randomAvatarKey } from "../utils/randomAvatar";
import { getUserProfile } from "../firebase/auth";

export default function GamePlay() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const initialBoardSize = params.row ? Number(params.row) : 3;
  const isAIMode = params.type === "easy" || params.type === "hard";
  const aiLevel = params.type === "hard" ? "hard" : "easy";

  const [board, setBoard] = useState<{ [key: string]: string }>({});
  const [roomId, setRoomId] = useState<string | null>(null);
  const [turn, setTurn] = useState<string | null>("X");
  const [loading, setLoading] = useState(true);
  const [boardSize, setBoardSize] = useState<number>(initialBoardSize);

  const [aiAvatar, setAiAvatar] = useState<ImageSourcePropType>(
    () => avatarMap[randomAvatarKey()]
  );

  const [players, setPlayers] = useState<
    Array<{ uid: string; displayName: string; avatar: ImageSourcePropType }>
  >([]);
  const playerSymbol = isAIMode
    ? "X"
    : players.length === 2 && players[0].uid === user?.uid
    ? "X"
    : "O";
  const [roomStatus, setRoomStatus] = useState<string>("waiting");
  const [roomType, setRoomType] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      (async () => {
        let assignedRoom: string | null = null;
        if (params.continue) {
          assignedRoom = params.continue as string;
          setRoomType("invite");
        } else {
          if (params.room) {
            setRoomType("invite");
            assignedRoom = await joinRoomWithCode(
              user.uid,
              Array.isArray(params.room) ? params.room[0] : params.room
            );
          } else if (params.type === "invite") {
            setRoomType("invite");
            assignedRoom = await createInviteRoom(user.uid, boardSize);
          } else if (params.type === "random") {
            assignedRoom = await assignToRoom(user.uid, boardSize);
          } else if (isAIMode) {
            assignedRoom = await assignToAIBoard(user.uid, boardSize, aiLevel);
            setRoomType("ai");
            const userProfile = await getUserProfile(user.uid);
            // setPlayers([
            //   {
            //     uid: user.uid,
            //     displayName: userProfile?.nickname || "Player",
            //     avatar: userProfile?.avatar || avatarMap[randomAvatarKey()],
            //   },
            //   {
            //     uid: "AI",
            //     displayName: "AI",
            //     avatar: avatarMap[randomAvatarKey()],
            //   },
            // ]);
            setRoomStatus("playing");
          }
        }

        if (assignedRoom) {
          setRoomId(assignedRoom);
          syncGameBoard(
            assignedRoom,
            setBoard,
            setTurn,
            async (playersArray: string[], status: string) => {
              // fetch every profile (or generate AI)
              const fullProfiles = await Promise.all(
                playersArray.map(async (uid) => {
                  if (uid === "AI") {
                    return {
                      uid: "AI",
                      displayName: "AI",
                      avatar: aiAvatar,
                    };
                  }
                  const profile = await getUserProfile(uid);
                  return {
                    uid,
                    displayName: profile?.nickname ?? "Player",
                    avatar: profile?.avatar || avatarMap[randomAvatarKey()],
                  };
                })
              );

              setPlayers(fullProfiles);
              setRoomStatus(status);
            },
            setBoardSize
          );
          setLoading(false);
        }
      })();
    }
  }, [user, boardSize, params.room, params.type, params.continueRoom]);

  useEffect(() => {
    if (!isAIMode && players.length === 2) {
      setLoading(false);
    }
  }, [players]);

  useEffect(() => {
    return () => {
      if (roomId && user) {
        if (!isAIMode && roomType !== "invite") {
          removeUserFromRoom(roomId, user.uid);
        }
      }
    };
  }, [roomId, user, roomType, params.continue]);

  useEffect(() => {
    if (!isAIMode) {
      let timeoutId: NodeJS.Timeout | null = null;

      const handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === "background" && roomId && user) {
          if (params.type === "invite") {
            timeoutId = setTimeout(() => {
              removeUserFromRoom(roomId, user.uid);
            }, 5 * 60 * 1000);
          } else if (params.type === "random") {
            removeUserFromRoom(roomId, user.uid);
          }
        } else if (nextAppState === "active" && timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
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
    }
  }, [roomId, user, params.type]);

  useEffect(() => {
    (async () => {
      if (roomId && Object.keys(board).length > 0) {
        const gameOver = await checkGameOver(roomId);
        if (gameOver) {
          router.push({
            pathname: "/gameResult",
            params: {
              winner: gameOver,
              type: roomType,
              room: roomId,
              row: boardSize,
            },
          });
        }
      }
    })();
  }, [roomId, board]);

  useEffect(() => {
    if (
      isAIMode &&
      turn === "O" &&
      board &&
      Object.keys(board).length > 0 &&
      user &&
      roomId
    ) {
      const runAIMove = async () => {
        const flatBoard = convertBoardObjectToArray(board, boardSize);
        const aiMoveIndex =
          aiLevel === "easy"
            ? getEasyMove(flatBoard)
            : getHardMove(flatBoard, boardSize, "O");

        const row = Math.floor(aiMoveIndex / boardSize);
        const col = aiMoveIndex % boardSize;

        await handlePlayerMove(roomId, "AI", row, col);
        // playLaserSound();
      };

      const timer = setTimeout(runAIMove, 500);
      return () => clearTimeout(timer);
    }
  }, [turn, board, user, roomId]);

  const copyToClipboard = async () => {
    if (roomId) {
      await Clipboard.setStringAsync(roomId);
      alert("Room code copied to clipboard!");
    }
  };

  // const handleMove = async (row: number, col: number) => {
  //   const cellKey = `${row}_${col}`;
  //   if (turn === playerSymbol && board[cellKey] === "") {
  //     // 사람 플레이어인 경우 실제 user.uid를 전달합니다.
  //     await handlePlayerMove(roomId!, user.uid, row, col);
  //   }
  // };
  const currentUser = players.find((p) => p.uid === user?.uid);

  const opponent = players.find((p) => p.uid !== user?.uid);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            if (roomId && user) {
              await removeUserFromRoom(roomId, user.uid);
            }
            router.push("/");
          }}
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
            <Text>{currentUser ? currentUser.displayName : "you"}</Text>
            <View style={styles.profileImageContainer}>
              <View style={styles.profilePic1}>
                {currentUser?.avatar ? (
                  <Image
                    source={currentUser.avatar}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text>profile{"\n"}picture</Text>
                )}
              </View>
              <View style={styles.cross}>
                <Text style={styles.crossText}>X</Text>
              </View>
            </View>
          </View>
          <View style={styles.profile}>
            <Text>{opponent ? opponent.displayName : "opponent"}</Text>
            <View style={styles.profileImageContainer}>
              <View style={styles.profilePic2}>
                {opponent?.avatar ? (
                  <Image
                    source={opponent.avatar}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text>profile{"\n"}picture</Text>
                )}
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
            <TicTacToeBoard
              board={board}
              roomId={roomId!}
              userId={user!.uid}
              rows={boardSize}
              cols={boardSize}
              // onCellPress={handleMove}
            />
            <Text style={styles.footerText}>
              {turn === "X"
                ? `${currentUser?.displayName}'s Turn`
                : `${opponent?.displayName}'s Turn`}
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
    width: 100, // fixed size
    height: 100,
    borderWidth: 20,
    borderColor: "#e76679",
    backgroundColor: "#FFF",
    // paddingHorizontal: 13,
    // paddingVertical: 20,
    borderRadius: 100,
    overflow: "hidden",
  },
  profilePic2: {
    width: 100, // fixed size
    height: 100,
    borderWidth: 20,
    borderColor: "#53b2df",
    backgroundColor: "#FFF",
    // paddingHorizontal: 13,
    // paddingVertical: 20,
    borderRadius: 100,
    overflow: "hidden",
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
  avatarImage: {
    width: "100%", // fill the parent
    height: "100%",
    borderRadius: 0,
  },
});

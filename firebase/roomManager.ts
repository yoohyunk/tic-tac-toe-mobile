import { firestore } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";

// ✅ Function to create an empty board (Object format)
const createEmptyBoard = (rows: number, cols: number) => {
  let boardObject: { [key: string]: string } = {};
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      boardObject[`${r}_${c}`] = "";
    }
  }
  return boardObject;
};

// ✅ Assign user to a game room
export const assignToRoom = async (userId: string) => {
  try {
    const roomsRef = collection(firestore, "rooms");
    const roomQuery = query(roomsRef, where("status", "==", "waiting"));
    const roomSnapshot = await getDocs(roomQuery);

    let assignedRoomId: string;

    if (!roomSnapshot.empty) {
      const availableRoom = roomSnapshot.docs.find((roomDoc) => {
        const roomData = roomDoc.data();
        return (
          Array.isArray(roomData.players) && !roomData.players.includes(userId)
        );
      });

      if (availableRoom) {
        assignedRoomId = availableRoom.id;
        const roomData = availableRoom.data();

        // ✅ Add the second player
        await updateDoc(doc(firestore, "rooms", assignedRoomId), {
          players: [...roomData.players, userId],
          status: "full",
        });

        console.log(`✅ User ${userId} joined room: ${assignedRoomId}`);
        return assignedRoomId;
      }
    }

    // ✅ Create a new room if no available room was found
    const newRoomRef = doc(collection(firestore, "rooms"));
    assignedRoomId = newRoomRef.id;

    await setDoc(newRoomRef, {
      players: [userId], // ✅ Ensuring it's an array
      board: createEmptyBoard(3, 3), // ✅ Object format board
      turn: "X",
      status: "waiting",
    });

    console.log(`✅ New room created by ${userId}: ${assignedRoomId}`);
    return assignedRoomId;
  } catch (error) {
    console.error("❌ Error assigning room:", error);
    return null;
  }
};

// ✅ Function to Sync Game Board in Real-Time
export const syncGameBoard = (
  roomId: string,
  setBoard: Function,
  setTurn: Function,
  setPlayers: Function
) => {
  const roomRef = doc(firestore, "rooms", roomId);

  return onSnapshot(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();

      setBoard(data.board || {}); // ✅ Ensure board exists
      setTurn(data.turn || "X"); // ✅ Default turn

      // ✅ Ensure players is always an array
      setPlayers(Array.isArray(data.players) ? data.players : []);
    }
  });
};

// ✅ Function to Handle Player Moves
export const handlePlayerMove = async (
  roomId: string,
  userId: string,
  rowIndex: number,
  colIndex: number
) => {
  if (!roomId) return;

  const roomRef = doc(firestore, "rooms", roomId);
  const roomSnap = await getDoc(roomRef);

  if (roomSnap.exists()) {
    const data = roomSnap.data();

    // ✅ Ensure `players` exists and is an array
    if (!Array.isArray(data.players) || data.players.length < 2) {
      console.warn("❌ Cannot play: Opponent has not joined yet!");
      return;
    }

    // ✅ Ensure `board` exists
    if (!data.board) return;

    // Check if it's the user's turn
    const playerSymbol = data.players[0] === userId ? "X" : "O";
    if (data.turn !== playerSymbol) {
      console.warn("❌ Not your turn!");
      return;
    }

    // Check if the cell is already occupied
    const cellKey = `${rowIndex}_${colIndex}`;
    if (data.board[cellKey] !== "") {
      console.warn("❌ Cell already occupied!");
      return;
    }

    // ✅ Update board (object format)
    await updateDoc(roomRef, {
      [`board.${cellKey}`]: playerSymbol, // ✅ No nested arrays
      turn: playerSymbol === "X" ? "O" : "X",
    });

    console.log(`✅ Move made by ${userId}: (${rowIndex}, ${colIndex})`);
  }
};

// ✅ Function to Check If Game is Over
export const checkGameOver = async (roomId: string) => {
  const roomRef = doc(firestore, "rooms", roomId);
  const roomSnap = await getDoc(roomRef);

  if (roomSnap.exists()) {
    const data = roomSnap.data();
    if (!data.board) return false;

    const board = data.board;
    const winningCombinations = [
      ["0_0", "0_1", "0_2"],
      ["1_0", "1_1", "1_2"],
      ["2_0", "2_1", "2_2"],
      ["0_0", "1_0", "2_0"],
      ["0_1", "1_1", "2_1"],
      ["0_2", "1_2", "2_2"],
      ["0_0", "1_1", "2_2"],
      ["0_2", "1_1", "2_0"],
    ];

    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        console.log(`✅ Game Over! Winner: ${board[a]}`);
        return board[a];
      }
    }

    // Check if board is full (tie)
    if (Object.values(board).every((cell) => cell !== "")) {
      console.log("✅ Game Over! It's a tie!");
      return "Tie";
    }
  }

  return false;
};

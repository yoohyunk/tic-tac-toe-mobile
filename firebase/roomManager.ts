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
  deleteDoc,
} from "firebase/firestore";

/**
 * Creates an empty board as an object.
 * The board size is clamped between 3 and 5.
 */
const createEmptyBoard = (size: number) => {
  const boardSize = Math.max(3, Math.min(size, 5)); // Clamp the size
  let boardObject: { [key: string]: string } = {};
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      boardObject[`${r}_${c}`] = "";
    }
  }
  return boardObject;
};

/**
 * Assigns a user to a game room with a given board size.
 * If a waiting room with the matching board size exists, joins it.
 * Otherwise, creates a new room.
 */
export const assignToRoom = async (userId: string, boardSize: number = 3) => {
  try {
    // Clamp boardSize to valid range
    const validBoardSize = Math.max(3, Math.min(boardSize, 5));

    const roomsRef = collection(firestore, "rooms");
    const roomQuery = query(roomsRef, where("status", "==", "waiting"));
    const roomSnapshot = await getDocs(roomQuery);

    let assignedRoomId: string;

    if (!roomSnapshot.empty) {
      // Find a waiting room with the same board size
      const availableRoom = roomSnapshot.docs.find((roomDoc) => {
        const roomData = roomDoc.data();
        return (
          Array.isArray(roomData.players) &&
          !roomData.players.includes(userId) &&
          roomData.boardSize === validBoardSize
        );
      });

      if (availableRoom) {
        assignedRoomId = availableRoom.id;
        const roomData = availableRoom.data();

        // Add the second player and update room status to full
        await updateDoc(doc(firestore, "rooms", assignedRoomId), {
          players: [...roomData.players, userId],
          status: "full",
        });

        console.log(`✅ User ${userId} joined room: ${assignedRoomId}`);
        return assignedRoomId;
      }
    }

    // Create a new room if no available room was found
    const newRoomRef = doc(collection(firestore, "rooms"));
    assignedRoomId = newRoomRef.id;

    await setDoc(newRoomRef, {
      players: [userId],
      board: createEmptyBoard(validBoardSize),
      boardSize: validBoardSize, // Store board size for later reference (e.g. win-check)
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

/**
 * Syncs the game board in real time.
 */
export const syncGameBoard = (
  roomId: string,
  setBoard: Function,
  setTurn: Function,
  setPlayersAndStatus: Function
) => {
  const roomRef = doc(firestore, "rooms", roomId);
  return onSnapshot(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      setBoard(data.board || {});
      setTurn(data.turn || "X");
      // Pass both players and status
      setPlayersAndStatus(data.players || [], data.status || "waiting");
    }
  });
};

/**
 * Handles a player's move.
 */
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

    // Ensure opponent has joined
    if (!Array.isArray(data.players) || data.players.length < 2) {
      console.warn("❌ Cannot play: Opponent has not joined yet!");
      return;
    }

    if (!data.board) return;

    // Determine player's symbol
    const playerSymbol = data.players[0] === userId ? "X" : "O";
    if (data.turn !== playerSymbol) {
      console.warn("❌ Not your turn!");
      return;
    }

    const cellKey = `${rowIndex}_${colIndex}`;
    if (data.board[cellKey] !== "") {
      console.warn("❌ Cell already occupied!");
      return;
    }

    // Update board and toggle turn
    await updateDoc(roomRef, {
      [`board.${cellKey}`]: playerSymbol,
      turn: playerSymbol === "X" ? "O" : "X",
    });

    console.log(`✅ Move made by ${userId}: (${rowIndex}, ${colIndex})`);
  }
};

/**
 * Finds the winner of the game given the current board state.
 * Returns:
 *  - "X" or "O" if a player wins,
 *  - "Tie" if the board is full with no winner,
 *  - false if the game is still ongoing.
 */
export const findWinner = (
  board: { [key: string]: string },
  boardSize: number
): string | false => {
  // Check rows
  for (let i = 0; i < boardSize; i++) {
    const row: string[] = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(board[`${i}_${j}`]);
    }
    if (row[0] && row.every((cell) => cell === row[0])) {
      return row[0];
    }
  }

  // Check columns
  for (let j = 0; j < boardSize; j++) {
    const column: string[] = [];
    for (let i = 0; i < boardSize; i++) {
      column.push(board[`${i}_${j}`]);
    }
    if (column[0] && column.every((cell) => cell === column[0])) {
      return column[0];
    }
  }

  // Check main diagonal
  const mainDiagonal: string[] = [];
  for (let i = 0; i < boardSize; i++) {
    mainDiagonal.push(board[`${i}_${i}`]);
  }
  if (
    mainDiagonal[0] &&
    mainDiagonal.every((cell) => cell === mainDiagonal[0])
  ) {
    return mainDiagonal[0];
  }

  // Check anti-diagonal
  const antiDiagonal: string[] = [];
  for (let i = 0; i < boardSize; i++) {
    antiDiagonal.push(board[`${i}_${boardSize - 1 - i}`]);
  }
  if (
    antiDiagonal[0] &&
    antiDiagonal.every((cell) => cell === antiDiagonal[0])
  ) {
    return antiDiagonal[0];
  }

  // Check for tie (if all cells are filled)
  if (Object.values(board).every((cell) => cell !== "")) {
    return "Tie";
  }

  return false;
};

/**
 * Checks if the game is over by evaluating rows, columns, and diagonals.
 * The logic adapts dynamically to boards sized from 3×3 up to 5×5.
 */
// export const checkGameOver = async (roomId: string) => {
//   const roomRef = doc(firestore, "rooms", roomId);
//   const roomSnap = await getDoc(roomRef);

//   if (!roomSnap.exists()) return false;
//   const data = roomSnap.data();
//   if (!data.board || !data.boardSize) return false;

//   const winner = findWinner(data.board, data.boardSize);
//   if (winner) {
//     console.log(`✅ Game Over! Winner: ${winner}`);
//   }
//   return winner;
// };

export const checkGameOver = async (roomId: string) => {
  const roomRef = doc(firestore, "rooms", roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) return false;
  const data = roomSnap.data();
  if (!data.board || !data.boardSize) return false;

  const winner = findWinner(data.board, data.boardSize);
  if (winner) {
    // Update the room status to "finished" in Firestore.
    await updateDoc(roomRef, { status: "finished" });
    console.log(`✅ Game Over! Winner: ${winner}`);
    await deleteDoc(roomRef);
    return winner;
  }

  return false;
};

/**
 * Removes a user from a room.
 * - If after removal there are no players left, the room document is deleted.
 * - Otherwise, the user is removed from the players array and the room status is reset to "waiting".
 */
export const removeUserFromRoom = async (roomId: string, userId: string) => {
  try {
    const roomRef = doc(firestore, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      console.warn(`Room ${roomId} does not exist.`);
      return;
    }

    const data = roomSnap.data();
    if (!Array.isArray(data.players)) return;

    // Remove the user from the players array
    const updatedPlayers = data.players.filter(
      (player: string) => player !== userId
    );

    // If no players remain, delete the room; otherwise update the room
    if (updatedPlayers.length === 0) {
      await deleteDoc(roomRef);
      console.log(`Room ${roomId} deleted because no players remain.`);
    } else {
      await updateDoc(roomRef, {
        players: updatedPlayers,
        status: "waiting", // Reset status to waiting so that a new opponent can join
        board: createEmptyBoard(data.boardSize),
      });
      console.log(`User ${userId} removed from room ${roomId}.`);
    }
  } catch (error) {
    console.error("Error removing user from room:", error);
  }
};

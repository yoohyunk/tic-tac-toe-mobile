export const convertBoardObjectToArray = (
  boardObject: { [key: string]: string },
  boardSize: number
): (null | "X" | "O")[] => {
  const arr: (null | "X" | "O")[] = [];
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const cell = boardObject[`${r}_${c}`];
      arr.push(cell === "" ? null : (cell as "X" | "O"));
    }
  }
  return arr;
};

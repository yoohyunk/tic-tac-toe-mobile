export type Board = (null | "X" | "O")[];

export const getHardMove = (
  board: Board,
  size: number,
  player: "X" | "O"
): number => {
  const opponent: "X" | "O" = player === "X" ? "O" : "X";

  const lines: number[][] = [];

  for (let r = 0; r < size; r++) {
    lines.push([...Array(size)].map((_, c) => r * size + c));
  }
  for (let c = 0; c < size; c++) {
    lines.push([...Array(size)].map((_, r) => r * size + c));
  }

  lines.push([...Array(size)].map((_, i) => i * size + i));
  lines.push([...Array(size)].map((_, i) => i * size + (size - 1 - i)));

  const findWinningMove = (target: "X" | "O"): number | null => {
    for (const line of lines) {
      const values = line.map((i) => board[i]);
      const countTarget = values.filter((v) => v === target).length;
      const countEmpty = values.filter((v) => v === null).length;

      if (countTarget === size - 1 && countEmpty === 1) {
        const emptyIndex = values.findIndex((v) => v === null);
        return line[emptyIndex];
      }
    }
    return null;
  };

  const winMove = findWinningMove(player);
  if (winMove !== null) return winMove;

  // block
  const blockMove = findWinningMove(opponent);
  if (blockMove !== null) return blockMove;

  const centerIndex = Math.floor((size * size) / 2);
  if (board[centerIndex] === null) return centerIndex;

  const empty: number[] = board
    .map((v, i) => (v === null ? i : null))
    .filter((v): v is number => v !== null);

  return empty[Math.floor(Math.random() * empty.length)];
};

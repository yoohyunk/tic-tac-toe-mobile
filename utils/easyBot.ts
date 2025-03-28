export type Board = (null | "X" | "O")[];

export const getEasyMove = (board: Board): number => {
  const empty: number[] = board
    .map((v, i) => (v === null ? i : null))
    .filter((v) => v !== null) as number[];
  return empty[Math.floor(Math.random() * empty.length)];
};

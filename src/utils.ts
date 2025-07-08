import type { Pair } from "./types";

export const generateSecret = (): Pair[] => {
  return Array.from({ length: 3 }, () => ({
    amount: Math.floor(Math.random() * 9) + 1,
    direction: Math.random() < 0.5 ? "clockwise" : "counterclockwise",
  }));
};

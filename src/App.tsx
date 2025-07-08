import { useEffect, useMemo, useState } from "react";
import { Sprite } from "pixi.js";
import { Application, extend } from "@pixi/react";
import { Background } from "./Background";
import { generateSecret } from "./utils";

import type { Direction, Pair } from "./types";

extend({
  Sprite,
});

export default function App() {
  const [input, setInput] = useState<Direction[]>([]);
  const [moves, setMoves] = useState(0);
  const [secret, setSecret] = useState<Pair[]>([]);

  const sequence = useMemo(() => {
    const result: Direction[] = [];

    for (const pair of secret) {
      for (let i = 0; i < pair.amount; i++) {
        result.push(pair.direction);
      }
    }

    return result;
  }, [secret]);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (moves >= 1) {
      const i = moves - 1;

      if (input[i] !== sequence[i]) {
        console.info("mistake");
      } else if (input.length === sequence.length) {
        console.info("unlock");
      }
    }
  }, [input, moves, sequence]);

  const handleInput = (direction: Direction) => {
    setInput([...input, direction]);
    setMoves((prev) => prev + 1);
  };

  const startGame = () => {
    const newSecret = generateSecret();

    console.info(
      "Secret:",
      newSecret.map((p) => `${p.amount} ${p.direction}`).join(", ")
    );

    setSecret(newSecret);
  };

  return (
    <Application background={"#1099bb"} resizeTo={window}>
      <Background />
    </Application>
  );
}

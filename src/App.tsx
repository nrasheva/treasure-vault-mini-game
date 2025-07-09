import { useEffect, useMemo, useState } from "react";
import { Sprite } from "pixi.js";
import { Application, extend } from "@pixi/react";
import { Background } from "./Background";
import { Door } from "./Door";
import { Handle } from "./Handle";
import { generateSecret } from "./utils";

import type { Direction, Pair } from "./types";

extend({ Sprite });

export default function App() {
  const [input, setInput] = useState<Direction[]>([]);
  const [moves, setMoves] = useState(0);
  const [secret, setSecret] = useState<Pair[]>([]);
  const [unlocked, setUnlocked] = useState(false);

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
        startGame();
      } else if (input.length === sequence.length) {
        console.info("unlock");
        setUnlocked(true);
        // setTimeout(() => startGame(), 5000);
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

    setInput([]);
    setMoves(0);
    setSecret(newSecret);
    setUnlocked(false);
  };

  return (
    <Application background={"#1099bb"} resizeTo={window}>
      <Background />
      <Door open={unlocked} />
      {!unlocked && <Handle onChange={handleInput} />}
    </Application>
  );
}

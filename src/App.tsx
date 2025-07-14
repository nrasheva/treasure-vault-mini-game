import { useEffect, useMemo, useState } from "react";
import { Sprite } from "pixi.js";
import { Application, extend } from "@pixi/react";
import { Background } from "./Background";
import { Door } from "./Door";
import { Handle } from "./Handle";
import { Timer } from "./Timer";
import { generateSecret } from "./utils";

import type { Direction, Pair } from "./types";
import { Blinks } from "./Blinks";

extend({ Sprite });

export default function App() {
  const [input, setInput] = useState<Direction[]>([]);
  const [moves, setMoves] = useState(0);
  const [secret, setSecret] = useState<Pair[]>([]);
  const [state, setState] = useState("locked");

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
    (async () => {
      if (moves >= 1) {
        const i = moves - 1;

        if (input[i] !== sequence[i]) {
          setState("mistake");

          await new Promise((resolve) => setTimeout(resolve, 3000));
          startGame();
        } else if (input.length === sequence.length) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setState("unlocked");

          await new Promise((resolve) => setTimeout(resolve, 5000));
          startGame();
        }
      }
    })();
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
    setState("locked");
  };

  return (
    <Application background={"transparent"} resizeTo={window}>
      <Background />
      {state === "unlocked" && <Blinks state={state} />}
      <Door state={state} />
      <Handle key={state} onChange={handleInput} state={state} />
      <Timer state={state} />
    </Application>
  );
}

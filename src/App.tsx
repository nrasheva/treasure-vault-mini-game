import { Application, extend } from "@pixi/react";
import { Container, Sprite, Text } from "pixi.js";
import { useEffect, useMemo, useState } from "react";
import { Handle } from "./Handle";
import { generateSecret } from "./utils";
import type { Direction, Pair } from "./types";

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Sprite,
  Text,
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
    const newSecret = generateSecret();

    console.info(
      "Secret:",
      newSecret.map((p) => `${p.amount} ${p.direction}`).join(", ")
    );

    setSecret(newSecret);
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

  return (
    // We'll wrap our components with an <Application> component to provide
    // the Pixi.js Application context
    <Application background={"#1099bb"} resizeTo={window}>
      <Handle onChange={(direction) => handleInput(direction)} />
    </Application>
  );
}

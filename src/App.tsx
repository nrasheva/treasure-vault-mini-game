import { useEffect, useMemo, useState } from "react";
import { Assets, Sprite } from "pixi.js";
import { Application, extend } from "@pixi/react";
import { Background } from "./Background";
import { Door } from "./Door";
import { Handle } from "./Handle";
import { Timer } from "./Timer";
import { generateSecret } from "./utils";

import type { Direction, Pair } from "./types";
import { Blinks } from "./Blinks";
import { LoadingScreen } from "./Loader";

extend({ Sprite });

export default function App() {
  const [input, setInput] = useState<Direction[]>([]);
  const [moves, setMoves] = useState(0);
  const [secret, setSecret] = useState<Pair[]>([]);
  const [state, setState] = useState("locked");
  const [loaded, setLoaded] = useState(false);

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
    const loadAssets = async () => {
      await Assets.load([
        "/assets/bg.png",
        "/assets/door.png",
        "/assets/handle.png",
        "/assets/doorOpen.png",
      ]);
      setLoaded(true);
      startGame();
    };

    loadAssets();
  }, []);

  // useEffect(() => {
  //   startGame();
  // }, []);

  useEffect(() => {
    if (!loaded) return;

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
  }, [input, moves, sequence, loaded]);

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
    <Application backgroundAlpha={0} resizeTo={window}>
      {!loaded ? (
        <LoadingScreen />
      ) : (
        <>
          <Background />
          <Blinks state={state} />
          <Door state={state} />
          <Handle key={state} onChange={handleInput} state={state} />
          <Timer state={state} />
        </>
      )}
    </Application>
  );
}

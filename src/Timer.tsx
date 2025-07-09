import { useEffect, useRef, useState } from "react";
import { Text, TextStyle } from "pixi.js";
import { extend } from "@pixi/react";
import { useResponsiveText } from "./hooks";

extend({ Text });

type TimerProps = {
  state: string;
};

export const Timer = (props: TimerProps) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const textRef = useRef<Text | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    if (props.state === "locked") {
      setSecondsElapsed(0);
    } else if (props.state === "mistake" || props.state === "unlocked") {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [props.state]);

  const minutes = Math.floor(secondsElapsed / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (secondsElapsed % 60).toString().padStart(2, "0");

  useResponsiveText(textRef, -295, -45);

  return (
    <pixiText
      ref={textRef}
      style={
        new TextStyle({
          fill: "white",
          fontFamily: "Arial",
          fontSize: 12,
        })
      }
      text={`${minutes}:${seconds}`}
      x={350}
      y={350}
    />
  );
};

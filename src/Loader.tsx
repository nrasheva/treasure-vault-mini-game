// LoadingScreen.tsx
import { TextStyle, Text } from "pixi.js";
import { extend } from "@pixi/react";

extend({ Text });

export function LoadingScreen() {
  return (
    <pixiText
      text="Loading..."
      anchor={0.5}
      x={window.innerWidth / 2}
      y={window.innerHeight / 2}
      style={
        new TextStyle({
          fill: "white",
          fontSize: 36,
          fontWeight: "bold",
        })
      }
    />
  );
}

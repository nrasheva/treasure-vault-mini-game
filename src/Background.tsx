import { useMemo, useRef } from "react";
import { Sprite, Texture } from "pixi.js";
import { useResponsiveSprite } from "./hooks";

export const Background = () => {
  const spriteRef = useRef<Sprite | null>(null);

  const texture = useMemo(() => Texture.from("/assets/bg.png"), []);

  useResponsiveSprite("fixed", 1, spriteRef, texture, 0, 0);

  return <pixiSprite anchor={0.5} ref={spriteRef} texture={texture} />;
};

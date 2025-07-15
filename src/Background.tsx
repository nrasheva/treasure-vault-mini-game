import { useMemo, useRef } from "react";
import { Sprite, Texture } from "pixi.js";
import { useResponsiveSprite } from "./hooks";
import { UIConfig } from "./uiConfig";

export const Background = () => {
  const spriteRef = useRef<Sprite | null>(null);

  const texture = useMemo(() => Texture.from("/assets/bg.png"), []);

  useResponsiveSprite(
    "fixed",
    UIConfig.background.scale,
    spriteRef,
    texture,
    UIConfig.background.offsetX,
    UIConfig.background.offsetY
  );

  return <pixiSprite anchor={0.5} ref={spriteRef} texture={texture} />;
};

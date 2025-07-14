import { useEffect, useRef, useState } from "react";
import { Assets, Sprite, Texture } from "pixi.js";
import { useResponsiveSprite } from "./hooks";

export const Background = () => {
  const spriteRef = useRef<Sprite | null>(null);

  const [texture, setTexture] = useState(Texture.EMPTY);

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load("/assets/bg.png").then((result) => {
        setTexture(result);
      });
    }
  }, [texture]);

  useResponsiveSprite("fixed", 1, spriteRef, texture, 0, 0);

  return <pixiSprite anchor={0.5} ref={spriteRef} texture={texture} />;
};

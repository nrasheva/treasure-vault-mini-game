import { useEffect, useRef, useState } from "react";
import { Assets, Sprite, Texture } from "pixi.js";
import { useResponsiveSprite } from "./hooks";

export const Door = () => {
  const spriteRef = useRef<Sprite | null>(null);

  const [texture, setTexture] = useState(Texture.EMPTY);

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load("/assets/door.png").then((result) => {
        setTexture(result);
      });
    }
  }, [texture]);

  useResponsiveSprite("fixed", 0.225, spriteRef, texture, 20, -10);

  return <pixiSprite anchor={0.5} ref={spriteRef} texture={texture} />;
};

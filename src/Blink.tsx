import { useEffect, useRef, useState } from "react";
import { useResponsiveSprite } from "./hooks";
import { Assets, Sprite, Texture } from "pixi.js";
import gsap from "gsap";

type BlinkProps = {
  state: string;
  x: number;
  y: number;
  scale?: number;
};

export const Blink = ({ state, x, y, scale = 0.1 }: BlinkProps) => {
  const blinkRef = useRef<Sprite | null>(null);
  const [blinkTexture, setBlinkTexture] = useState(Texture.EMPTY);

  useEffect(() => {
    Assets.load("/assets/blink.png").then((result) => {
      setBlinkTexture(result);
    });
  }, []);

  useEffect(() => {
    if (blinkRef.current) {
      gsap.to(blinkRef.current.scale, {
        duration: 0.5,
        ease: "sine.inOut",
        repeat: -1,
        x: "+=0.2",
        y: "+=0.2",
        yoyo: true,
        delay: Math.random() * 0.5,
      });
    }
  }, [state]);

  useResponsiveSprite("fixed", scale, blinkRef, blinkTexture, x, y);

  return (
    <>
      {blinkTexture.width > 0 && (
        <pixiSprite anchor={0.5} ref={blinkRef} texture={blinkTexture} />
      )}
    </>
  );
};

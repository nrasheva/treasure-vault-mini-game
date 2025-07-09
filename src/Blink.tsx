import { useEffect, useRef, useState } from "react";
import { Assets, Sprite, Texture } from "pixi.js";
import gsap from "gsap";
import { useResponsiveSprite } from "./hooks";

type BlinkProps = {
  state: string;
};

export const Blink = (props: BlinkProps) => {
  const blinkRef = useRef<Sprite | null>(null);

  const [blinkTexture, setBlinkTexture] = useState(Texture.EMPTY);

  useEffect(() => {
    Assets.load("/assets/blink.png").then((result) => {
      setBlinkTexture(result);
    });
  }, [blinkTexture]);

  useEffect(() => {
    if (blinkRef.current) {
      gsap.to(blinkRef.current.scale, {
        duration: 0.5,
        ease: "sine.inOut",
        repeat: -1,
        x: 1.2,
        y: 1.2,
        yoyo: true,
      });
    }
  }, [props.state]);

  useResponsiveSprite("fixed", 0.225, blinkRef, blinkTexture, -20, 40);

  return (
    <>
      <pixiSprite anchor={0.5} ref={blinkRef} texture={blinkTexture} />
    </>
  );
};

import { useEffect, useRef, useState } from "react";
import { Assets, Sprite, Texture } from "pixi.js";
import { useResponsiveSprite } from "./hooks";

type DoorProps = {
  state: string;
};

export const Door = (props: DoorProps) => {
  const doorRef = useRef<Sprite | null>(null);

  const [doorTexture, setDoorTexture] = useState(Texture.EMPTY);

  useEffect(() => {
    Assets.load(
      props.state === "unlocked" ? "/assets/doorOpen.png" : "/assets/door.png"
    ).then((result) => {
      setDoorTexture(result);
    });
  }, [doorTexture, props.state]);

  useResponsiveSprite(
    "fixed",
    0.225,
    doorRef,
    doorTexture,
    props.state === "unlocked" ? 300 : 20,
    -10
  );

  return (
    <>
      <pixiSprite anchor={0.5} ref={doorRef} texture={doorTexture} />
    </>
  );
};

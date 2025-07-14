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
  }, [props.state]);

  useResponsiveSprite(
    "fixed",
    props.state === "unlocked" ? 0.225 : 0.35,
    doorRef,
    doorTexture,
    props.state === "unlocked" ? 280 : 10,
    -10
  );

  return (
    <>
      <pixiSprite anchor={0.5} ref={doorRef} texture={doorTexture} />
    </>
  );
};

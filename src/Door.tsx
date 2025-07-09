import { useEffect, useRef, useState } from "react";
import { Assets, Sprite, Texture } from "pixi.js";
import { useResponsiveSprite } from "./hooks";

type DoorProps = {
  open: boolean;
};

export const Door = (props: DoorProps) => {
  const doorRef = useRef<Sprite | null>(null);

  const [doorTexture, setDoorTexture] = useState(Texture.EMPTY);

  useEffect(() => {
    Assets.load(props.open ? "/assets/doorOpen.png" : "/assets/door.png").then(
      (result) => {
        setDoorTexture(result);
      }
    );
  }, [doorTexture, props.open]);

  useResponsiveSprite(
    "fixed",
    0.225,
    doorRef,
    doorTexture,
    props.open ? 300 : 20,
    -10
  );

  return (
    <>
      <pixiSprite anchor={0.5} ref={doorRef} texture={doorTexture} />
    </>
  );
};

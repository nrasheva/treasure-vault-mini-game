import { useEffect, useRef, useState } from "react";
import { Assets, Sprite, Texture } from "pixi.js";
import { useResponsiveSprite } from "./hooks";
import { UIConfig } from "./uiConfig";

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
    props.state === "unlocked"
      ? UIConfig.door.scale.unlocked
      : UIConfig.door.scale.locked,
    doorRef,
    doorTexture,
    props.state === "unlocked"
      ? UIConfig.door.offsetX.unlocked
      : UIConfig.door.offsetX.locked,
    UIConfig.door.offsetY
  );

  return (
    <>
      <pixiSprite anchor={0.5} ref={doorRef} texture={doorTexture} />
    </>
  );
};

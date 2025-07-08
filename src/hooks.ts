import { useEffect } from "react";
import { Sprite, Texture } from "pixi.js";
import { useApplication } from "@pixi/react";

export const useResponsiveSprite = (
  mode: "fixed" | "cover",
  multiplier: number,
  sprite: React.RefObject<Sprite | null>,
  texture: Texture
) => {
  const { app } = useApplication();

  useEffect(() => {
    const updateTransform = () => {
      if (sprite.current && texture !== Texture.EMPTY) {
        const baseScale = Math.max(
          app.screen.width / texture.width,
          app.screen.height / texture.height
        );

        const scale = mode === "fixed" ? multiplier : baseScale * multiplier;

        sprite.current.scale.set(scale);

        sprite.current.position.set(
          app.screen.width / 2,
          app.screen.height / 2
        );
      }
    };

    updateTransform();

    app.renderer.on("resize", updateTransform);

    return () => {
      app.renderer.off("resize", updateTransform);
    };
  }, [app, mode, multiplier, sprite, texture]);
};

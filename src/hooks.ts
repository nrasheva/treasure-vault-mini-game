import { useEffect } from "react";
import { Sprite, Text, Texture } from "pixi.js";
import { useApplication } from "@pixi/react";

export const useResponsiveSprite = (
  mode: "fixed" | "cover",
  multiplier: number, 
  sprite: React.RefObject<Sprite | null>,
  texture: Texture,
  x: number,
  y: number
) => {
  const { app } = useApplication();

  useEffect(() => {
    const updateTransform = () => {
      const s = sprite.current;
      if (!s || texture.width === 0 || texture.height === 0) return;

      let scale = 1;

      if (mode === "fixed") {
        const targetSize = app.screen.width * multiplier;
        scale = targetSize / texture.width;
      } else {
        const baseScale = Math.max(
          app.screen.width / texture.width,
          app.screen.height / texture.height
        );
        scale = baseScale * multiplier;
      }

      s.scale.set(scale);
      s.position.set(app.screen.width / 2 + x, app.screen.height / 2 + y);
    };

    updateTransform();

    window.addEventListener("resize", updateTransform);
    return () => {
      window.removeEventListener("resize", updateTransform);
    };
  }, [app, mode, multiplier, sprite, texture]);
};

export const useResponsiveText = (
  text: React.RefObject<Text | null>,
  x: number,
  y: number,
) => {
  const { app } = useApplication();

  useEffect(() => {
    const updateTransform = () => {
      if (text.current) {
        text.current.position.set(
          app.screen.width / 2 + x,
          app.screen.height / 2 + y
        );
      }
    };

    updateTransform();

    app.renderer.on("resize", updateTransform);

    return () => {
      app.renderer.off("resize", updateTransform);
    };
  }, [app, text, x, y]);
};

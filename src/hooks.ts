import { useEffect, useRef } from "react";
import { Sprite, Text, Texture } from "pixi.js";
import { useApplication, useTick } from "@pixi/react";

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
  textRef: React.RefObject<Text | null>,
  offsetX: number,
  offsetY: number
) => {
  const { app } = useApplication();
  const prevSize = useRef({ width: 0, height: 0 });

  useTick(() => {
    const { width, height } = app.screen;

    if (
      width !== prevSize.current.width ||
      height !== prevSize.current.height
    ) {
      if (textRef.current) {
        textRef.current.position.set(width / 2 + offsetX, height / 2 + offsetY);
      }

      prevSize.current = { width, height };
    }
  });
};
import { useEffect, useRef, useState } from "react";
import {
  Assets,
  Container,
  Sprite,
  Texture,
  FederatedPointerEvent,
} from "pixi.js";
import { extend, useApplication, useTick } from "@pixi/react";
import { useResponsiveSprite } from "./hooks";

import type { Direction } from "./types";

extend({ Container, Sprite });

const ROTATION_THRESHOLD = Math.PI / 6;
const SNAP_ROTATION = Math.PI / 3;

type HandleProps = {
  onChange: (direction: Direction) => void;
};

export const Handle = (props: HandleProps) => {
  const { app } = useApplication();

  const spriteRef = useRef<Sprite>(null);

  const [accumulatedAngle, setAccumulatedAngle] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [dragStartAngle, setDragStartAngle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [targetRotation, setTargetRotation] = useState(0);
  const [texture, setTexture] = useState(Texture.EMPTY);

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load("/assets/handle.png").then((result) => {
        setTexture(result);
      });
    }
  }, [texture]);

  useTick((ticker) => {
    if (spriteRef.current) {
      if (isAnimating) {
        const rotationDiff = targetRotation - currentRotation;

        if (Math.abs(rotationDiff) < 0.01) {
          // Animation complete
          spriteRef.current.rotation = targetRotation;

          setIsAnimating(false);
          setCurrentRotation(targetRotation);
        } else {
          const newRotation =
            currentRotation + rotationDiff * 0.15 * ticker.deltaTime;

          spriteRef.current.rotation = newRotation;

          setCurrentRotation(newRotation);
        }
      } else {
        spriteRef.current.rotation = currentRotation;
      }
    }
  });

  const getAngleFromCenter = (x: number, y: number) => {
    if (spriteRef.current) {
      const centerX = spriteRef.current.x;
      const centerY = spriteRef.current.y;

      return Math.atan2(y - centerY, x - centerX);
    } else {
      return 0;
    }
  };

  const handlePointerDown = (event: FederatedPointerEvent) => {
    if (isAnimating === false) {
      setAccumulatedAngle(0);
      setDragStartAngle(getAngleFromCenter(event.globalX, event.globalY));
      setIsDragging(true);
    }
  };

  const handlePointerMove = (event: FederatedPointerEvent) => {
    if (isAnimating || isDragging === false) return;

    const currentAngle = getAngleFromCenter(event.globalX, event.globalY);
    const angleDiff = normalizeAngle(currentAngle - dragStartAngle);
    const newAccumulatedAngle = accumulatedAngle + angleDiff;

    // Separate checks preserve exact original behavior
    if (newAccumulatedAngle >= ROTATION_THRESHOLD) {
      triggerRotation(SNAP_ROTATION);
      return;
    }

    if (newAccumulatedAngle <= -ROTATION_THRESHOLD) {
      triggerRotation(-SNAP_ROTATION);
      return;
    }

    setAccumulatedAngle(newAccumulatedAngle);
    setDragStartAngle(currentAngle);
  };

  const handlePointerUp = () => {
    setAccumulatedAngle(0);
    setIsDragging(false);
  };

  const normalizeAngle = (angle: number) => {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;

    return angle;
  };

  const triggerRotation = (rotationAmount: number) => {
    setAccumulatedAngle(0);
    setIsAnimating(true);
    setTargetRotation((prev) => prev + rotationAmount);

    props.onChange(rotationAmount > 0 ? "clockwise" : "counterclockwise");

    // Reset drag start angle for continuous rotation
    if (isDragging) {
      setTimeout(() => {
        if (isDragging) {
          setDragStartAngle(
            getAngleFromCenter(
              app.renderer.events.pointer?.global.x || 0,
              app.renderer.events.pointer?.global.y || 0
            )
          );
        }
      }, 100);
    }
  };

  useResponsiveSprite("fixed", 0.225, spriteRef, texture, 0, -10);

  return (
    <pixiSprite
      anchor={0.5}
      cursor="grab"
      interactive={true}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerUpOutside={handlePointerUp}
      ref={spriteRef}
      texture={texture}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
    />
  );
};

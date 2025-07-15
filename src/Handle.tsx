import { useEffect, useRef, useState } from "react";
import {
  Assets,
  Container,
  Sprite,
  Texture,
  FederatedPointerEvent,
} from "pixi.js";
import { extend, useApplication } from "@pixi/react";
import gsap from "gsap";
import { useResponsiveSprite } from "./hooks";

import type { Direction } from "./types";
import { UIConfig } from "./uiConfig";
import { wait } from "./utils";

extend({ Container, Sprite });

const ROTATION_THRESHOLD = Math.PI / 6;
const SNAP_ROTATION = Math.PI / 3;

type HandleProps = {
  onChange: (direction: Direction) => void;
  state: string;
};

export const Handle = (props: HandleProps) => {
  const { app } = useApplication();

  const handleRef = useRef<Sprite>(null);

  const [accumulatedAngle, setAccumulatedAngle] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [dragStartAngle, setDragStartAngle] = useState(0);
  const [handleTexture, setHandleTexture] = useState(Texture.EMPTY);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (handleTexture === Texture.EMPTY) {
      Assets.load("/assets/handle.png").then((result) => {
        setHandleTexture(result);
      });
    }
  }, [handleTexture]);

  useEffect(() => {
    if (handleRef.current && props.state === "mistake") {
      gsap.to(handleRef.current, {
        duration: 3,
        ease: "power2.out",
        rotation: Math.PI * 2 * 5,
      });
    }

    return () => {
      if (handleRef.current) {
        gsap.killTweensOf(handleRef.current);
      }
    };
  }, [props.state]);

  const triggerRotation = async (rotationAmount: number) => {
    if (!handleRef.current) return;

    setAccumulatedAngle(0);
    setIsAnimating(true);

    const newTargetRotation = currentRotation + rotationAmount;

    // Animate with GSAP
    gsap.to(handleRef.current, {
      duration: 0.5,
      rotation: newTargetRotation,
      ease: "power2.out",
      onUpdate: () => {
        if (handleRef.current) {
          setCurrentRotation(handleRef.current.rotation);
        }
      },
      onComplete: () => {
        setCurrentRotation(newTargetRotation);
        setIsAnimating(false);
      },
    });

    props.onChange(rotationAmount > 0 ? "clockwise" : "counterclockwise");

    // Reset drag start angle for continuous rotation
    if (isDragging) {
      await wait(100);

      if (isDragging) {
        setDragStartAngle(
          getAngleFromCenter(
            app.renderer.events.pointer?.global.x || 0,
            app.renderer.events.pointer?.global.y || 0
          )
        );
      }
    }
  };

  const getAngleFromCenter = (x: number, y: number) => {
    if (handleRef.current) {
      const centerX = handleRef.current.x;
      const centerY = handleRef.current.y;

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

  useResponsiveSprite(
    "fixed",
    UIConfig.handle.scale,
    handleRef,
    handleTexture,
    UIConfig.handle.offsetX,
    UIConfig.handle.offsetY
  );

  const centerX = app.screen.width / 2;
  const centerY = app.screen.height / 2;

  return (
    <>
      {props.state !== "unlocked" && (
        <pixiSprite
          anchor={0.5}
          cursor="grab"
          interactive={true}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerUpOutside={handlePointerUp}
          ref={handleRef}
          texture={handleTexture}
          x={centerX}
          y={centerY}
        />
      )}
    </>
  );
};

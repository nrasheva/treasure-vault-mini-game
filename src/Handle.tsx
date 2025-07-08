import type { Direction } from "./types";

type HandleProps = {
  onChange: (direction: Direction) => void;
};

export const Handle = (props: HandleProps) => {
  return (
    <>
      <pixiContainer>
        <pixiText
          eventMode="static"
          interactive
          onMouseDown={() => props.onChange("counterclockwise")}
          text="counterclockwise"
        />
      </pixiContainer>
      <pixiContainer x={250}>
        <pixiText
          eventMode="static"
          interactive
          onMouseDown={() => props.onChange("clockwise")}
          text="clockwise"
        />
      </pixiContainer>
    </>
  );
};

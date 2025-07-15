import { Blink } from "./Blink";
import { UIConfig } from "./uiConfig";

type BlinksProps = {
  state: string;
};

export const Blinks = ({ state }: BlinksProps) => {
  return (
    <>
      {UIConfig.blinks.map((b, index) => (
        <Blink
          key={index}
          state={state}
          x={b.x}
          y={b.y}
          scale={b.scale}
        />
      ))}
    </>
  );
};

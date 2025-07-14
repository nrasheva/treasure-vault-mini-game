import { Blink } from "./Blink";

type BlinksProps = {
  state: string;
};

export const Blinks = ({ state }: BlinksProps) => {
  return (
    <>
      <Blink state={state} x={-90} y={20} scale={0.03} />
      <Blink state={state} x={-50} y={10} scale={0.1} />
      <Blink state={state} x={70} y={60} scale={0.04} />
    </>
  );
};

import "./index.css";
import { Composition } from "remotion";
import { HighAndScary } from "./HighAndScary";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HighAndScary"
        component={HighAndScary}
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

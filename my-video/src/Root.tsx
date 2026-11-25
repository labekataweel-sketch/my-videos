import { MyComposition } from "./Composition";
import { LavekaAdComposition } from "./laveka/LavekaAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <LavekaAdComposition />
    </>
  );
};

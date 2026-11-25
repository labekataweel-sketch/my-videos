import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Composition } from "remotion";
import {
  BenefitsScene,
  IngredientsScene,
  IntroScene,
  OfferProps,
  OfferScene,
  ProductScene,
  SkinTypesScene,
  SpecialistScene,
} from "./Scenes";

const FPS = 30;
const T = 15; // transition length in frames

const scenes = {
  intro: 90,
  product: 150,
  benefits: 165,
  ingredients: 165,
  skinTypes: 120,
  specialist: 135,
  offer: 165,
};

const TOTAL =
  Object.values(scenes).reduce((a, b) => a + b, 0) -
  (Object.keys(scenes).length - 1) * T;

const timing = linearTiming({ durationInFrames: T });

export const LavekaAd: React.FC<OfferProps> = (props) => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Intro" durationInFrames={scenes.intro}>
      <IntroScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={timing} />
    <TransitionSeries.Sequence name="Product" durationInFrames={scenes.product}>
      <ProductScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={slide({ direction: "from-left" })}
      timing={timing}
    />
    <TransitionSeries.Sequence name="Benefits" durationInFrames={scenes.benefits}>
      <BenefitsScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={slide({ direction: "from-left" })}
      timing={timing}
    />
    <TransitionSeries.Sequence
      name="Ingredients"
      durationInFrames={scenes.ingredients}
    >
      <IngredientsScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={slide({ direction: "from-left" })}
      timing={timing}
    />
    <TransitionSeries.Sequence
      name="Skin types"
      durationInFrames={scenes.skinTypes}
    >
      <SkinTypesScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={timing} />
    <TransitionSeries.Sequence
      name="Specialist"
      durationInFrames={scenes.specialist}
    >
      <SpecialistScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={timing} />
    <TransitionSeries.Sequence name="Offer" durationInFrames={scenes.offer}>
      <OfferScene {...props} />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);

export const LavekaAdComposition = () => (
  <Composition
    id="LavekaCream"
    component={LavekaAd}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{
      price: "220.00",
      oldPrice: "259.00",
      cta: "اطلبي الآن",
      contact: "",
    }}
  />
);

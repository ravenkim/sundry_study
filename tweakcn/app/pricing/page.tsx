"use client";
import { useScramble } from "use-scramble";

export default function PricingPage() {
  const { ref: ราคาRef, replay: ราคาReplay } = useScramble({
    text: "$0",
    speed: 1,
    tick: 1,
    step: 1,
    scramble: 10,
    seed: 2,
    chance: 0.8,
  });

  const { ref: essentialsRef, replay: essentialsReplay } = useScramble({
    text: "The essentials, free forever.",
    speed: 1,
    tick: 1,
    step: 1,
    scramble: 8,
    seed: 1,
    chance: 0.8,
  });

  const { ref: bestYetRef, replay: bestYetReplay } = useScramble({
    text: "But the best is yet to come.",
    speed: 0.5,
    tick: 1,
    step: 1,
    scramble: 8,
    seed: 1,
    chance: 0.8,
  });

  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      <h1 className="text-9xl font-bold" ref={ราคาRef} onMouseOver={ราคาReplay} />
      <p
        className="text-muted-foreground mt-24 text-2xl font-semibold"
        ref={essentialsRef}
        onMouseOver={essentialsReplay}
      />
      <p
        className="text-muted-foreground mt-4 text-sm"
        ref={bestYetRef}
        onMouseOver={bestYetReplay}
      />
    </div>
  );
}

import eleven from "./eleven.png";
import demogorgon from "./demogorgon.png";
import lab from "./hawkins-lab.png";
import type { HawkinsSymbol } from "@its-me-mayday/hawkins-control";

export const ART: Record<HawkinsSymbol, { src: string; alt: string }> = {
  ELEVEN: { src: eleven, alt: "Eleven" },
  DEMOGORGON: { src: demogorgon, alt: "Demogorgon" },
  HAWKINS_LAB: { src: lab, alt: "Hawkins Lab" },
};

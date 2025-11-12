import eleven from "./eleven.png";
import demogorgon from "./demogorgon.png";
import lab from "./hawkins-lab.png";
import type { HawkinsSymbol } from "@its-me-mayday/hawkins-control";

export const ART: Record<
  HawkinsSymbol,
  { src: string; alt: string; fit?: "cover" | "contain"; pos?: string; aspect?: string }
> = {
  ELEVEN: { src: eleven, alt: "Eleven", fit: "contain", pos: "center 20%", aspect: "3/4" },
  DEMOGORGON: { src: demogorgon, alt: "Demogorgon", fit: "cover",  pos: "50% 40%", aspect: "4/3" },
  HAWKINS_LAB: { src: lab, alt: "Hawkins Lab", fit: "contain", pos: "center", aspect: "16/9" },
};
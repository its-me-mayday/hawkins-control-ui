import eleven from "./eleven.png";
import demogorgon from "./demogorgon.png";
import lab from "./hawkins-lab.png";
import elevenwin from "./eleven-win.png";
import demogorgonwin from "./demogorgon-win.png";
import labwin from "./hawkins-lab-win.png"
import type { HawkinsSymbol } from "@its-me-mayday/hawkins-control";

export const ART: Record<
  HawkinsSymbol,
  { src: string; win?: string; alt: string; fit?: "cover" | "contain"; pos?: string; aspect?: string }
> = {
  ELEVEN: { src: eleven, win: elevenwin; alt: "Eleven", fit: "contain", pos: "center 20%", aspect: "3/4" },
  DEMOGORGON: { src: demogorgon, win: demogorgonwin; alt: "Demogorgon", fit: "cover",  pos: "50% 40%", aspect: "4/3" },
  HAWKINS_LAB: { src: lab, win: labwin; alt: "Hawkins Lab", fit: "contain", pos: "center", aspect: "16/9" },
};
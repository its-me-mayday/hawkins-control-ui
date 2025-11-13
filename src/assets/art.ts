import eleven from "./eleven.png";
import demogorgon from "./demogorgon.png";
import lab from "./hawkins-lab.png";
import elevenwin from "./eleven-win.png";
import demogorgonwin from "./demogorgon-win.png";
import labwin from "./hawkins-lab-win.png";
import elevenlose from "./eleven-lose.png";
import demogorgonlose from "./demogorgon-lose.png";
import lablose from "./hawkins-lab-lose.png";
import type { HawkinsSymbol } from "@its-me-mayday/hawkins-control";
import gear from "./gear.png";
import icon from "./icon.png";
import stats from "./stats.png";

export const UI_ART = { 
  GEAR: { src: gear, alt: "Settings" },
  ICON: { src: icon, alt: "Icon" },
  STATS: { src: stats, alt: "Stats" } };

export const ART: Record<
  HawkinsSymbol,
  { src: string; win?: string; lose?: string; alt: string; fit?: "cover" | "contain"; pos?: string; aspect?: string }
> = {
  ELEVEN: { src: eleven, win: elevenwin, lose: elevenlose, alt: "Eleven", fit: "contain", pos: "center 20%", aspect: "3/4" },
  DEMOGORGON: { src: demogorgon, win: demogorgonwin, lose: demogorgonlose, alt: "Demogorgon", fit: "cover", pos: "50% 40%", aspect: "4/3" },
  HAWKINS_LAB: { src: lab, win: labwin, lose: lablose, alt: "Hawkins Lab", fit: "contain", pos: "center", aspect: "16/9" },
};

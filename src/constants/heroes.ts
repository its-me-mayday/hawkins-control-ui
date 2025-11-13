import { HEROES } from "../assets/art";

export type HeroKey = keyof typeof HEROES;

export const HERO_META: Record<HeroKey, { name: string; role: string }> = {
  DUSTIN: {
    name: "Dustin Henderson",
    role: "Brains of the Party",
  },
  HOPPER: {
    name: "Jim Hopper",
    role: "Hawkins Chief",
  },
  MIKE: {
    name: "Mike Wheeler",
    role: "Party Leader",
  },
  JOYCE: {
    name: "Joyce Byers",
    role: "Christmas Lights Oracle",
  },
};
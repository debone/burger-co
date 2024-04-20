import { meatPatty } from "./meat-patty/meat-patty";

export const INGREDIENTS = {
  MEAT_PATTY: meatPatty,
};

export type INGREDIENTS = keyof typeof INGREDIENTS;
export type INGREDIENTS_REPRESENTATION = (typeof INGREDIENTS)[INGREDIENTS];

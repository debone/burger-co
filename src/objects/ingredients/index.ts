import { bottomBun } from "./bun/bottom-bun";
import { hornBun } from "./bun/horn-bun";
import { soulBunBottom } from "./bun/soul-bottom-bun";
import { soulBunTop } from "./bun/soul-top-bun";
import { topBun } from "./bun/top-bun";
import { devilsCheddar } from "./cheeses/devils-cheddar";
import { dragonClaw } from "./cheeses/dragon-claw";
import { goatEyes } from "./cheeses/goat-eyes";
import { meatPatty } from "./meat-patty/meat-patty";

export interface Ingredients extends Phaser.GameObjects.Container {
  ingredientImage: Phaser.GameObjects.Image;
  ingredient: INGREDIENTS_REPRESENTATION;
}

export const INGREDIENTS = {
  MEAT_PATTY: meatPatty,
  TOP_BUN: topBun,
  BOTTOM_BUN: bottomBun,
  DRAGON_CLAW: dragonClaw,
  DEVILS_CHEDDAR: devilsCheddar,
  GOAT_EYES: goatEyes,
  SOUL_BUN_TOP: soulBunTop,
  SOUL_BUN_BOTTOM: soulBunBottom,
  HORN_BUN_TOP: hornBun,
};

export type INGREDIENTS = keyof typeof INGREDIENTS;
export type INGREDIENTS_REPRESENTATION = (typeof INGREDIENTS)[INGREDIENTS];
export type INGREDIENTS_OBJECTS = (typeof INGREDIENTS)[INGREDIENTS]["object"];

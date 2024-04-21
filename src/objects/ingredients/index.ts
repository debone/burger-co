import { meatPatty } from "./meat-patty/meat-patty";

export interface Ingredients extends Phaser.GameObjects.Container {
  ingredientImage: Phaser.GameObjects.Image;
  ingredient: INGREDIENTS_REPRESENTATION;
}

export const INGREDIENTS = {
  MEAT_PATTY: meatPatty,
};

export type INGREDIENTS = keyof typeof INGREDIENTS;
export type INGREDIENTS_REPRESENTATION = (typeof INGREDIENTS)[INGREDIENTS];
export type INGREDIENTS_OBJECTS = (typeof INGREDIENTS)[INGREDIENTS]["object"];

import Phaser from "phaser";

/**
 * Some wrapped functions from Phaser
 */

export const Vector2 = Phaser.Math.Vector2;
export type Vector2 = Phaser.Math.Vector2;

export const pickRandom = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

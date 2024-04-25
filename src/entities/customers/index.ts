export interface Customer extends Phaser.GameObjects.Container {
  yGoal: number;

  id: number;
  order: number;
  state: "moving" | "waiting" | "ordering" | "leaving" | "happy";

  maxPatience: number;
  patience: number;

  delivered(positiveOutcome: boolean): void;
}

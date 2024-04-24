import { Game } from "../scenes/Game";

export interface System {
  create(scene: Game): this;
  update(time: number, delta: number): void;
}

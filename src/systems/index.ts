import { MainGame } from "../scenes/main-game";

export interface System {
  create(scene: MainGame): this;
  update(time: number, delta: number): void;
}

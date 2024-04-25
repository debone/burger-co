import { Scene, GameObjects } from "phaser";
import { RESOURCES } from "../assets";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(0, 0, RESOURCES.INTRO).setOrigin(0, 0);

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}

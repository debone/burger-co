import { Scene } from "phaser";
import { RESOURCES } from "../assets";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;

    this.background = this.add.image(0, 0, RESOURCES.BURGER_SHOP);
    this.background.setOrigin(0, 0);

    this.matter.world.setBounds().disableGravity();

    new Patty(this, 720, 480, RESOURCES.BURGER_PATTY);
    new Patty(this, 720, 475, RESOURCES.BURGER_PATTY);
    new Patty(this, 770, 480, RESOURCES.BURGER_PATTY);
    new Patty(this, 770, 475, RESOURCES.BURGER_PATTY);

    new Stacked(this, 360, 750, RESOURCES.BURGER_BOTTOM);
    new Stacked(this, 420, 700, RESOURCES.BURGER_BOTTOM);
    new Stacked(this, 420, 752, RESOURCES.BURGER_BOTTOM);
    new Stacked(this, 420, 751, RESOURCES.BURGER_BOTTOM);
    new Stacked(this, 410, 750, RESOURCES.BURGER_BOTTOM);
    new Stacked(this, 400, 750, RESOURCES.BURGER_BOTTOM);
    new Stacked(this, 400, 750, RESOURCES.BURGER_BOTTOM);

    this.matter.add.mouseSpring({ stiffness: 0.1, damping: 1 });

    this.input.once("pointerdown", () => {
      //      this.scene.start("GameOver");
    });
  }
}

class Stacked extends Phaser.Physics.Matter.Image {
  stacked: Phaser.GameObjects.Image;
  stacked2: Phaser.GameObjects.Image;
  stacked3: Phaser.GameObjects.Image;

  worldWidth: number;
  worldHeight: number;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    options: Phaser.Types.Physics.Matter.MatterBodyConfig = {}
  ) {
    super(scene.matter.world, x, y, texture, 0, {
      ...options,
    });

    this.setBody({
      type: "polygon",
      sides: 8,
      width: 80,
      height: 64,
    });

    this.setFixedRotation();

    this.setFriction(0, 0.1, 1);

    this.setDisplaySize(48, 48);
    this.setDisplayOrigin(55, 82);

    this.stacked3 = this.scene.add.image(x, y, RESOURCES.BURGER_TOP);
    this.stacked3.setTint(0, 0, 0, 0);
    this.stacked3.setAlpha(0.2);

    scene.add.existing(this);

    this.stacked = this.scene.add.image(x, y, RESOURCES.BURGER_PATTY);

    this.stacked.setDisplaySize(48, 48);
    this.stacked.setDisplayOrigin(55, 105);

    this.stacked2 = this.scene.add.image(x, y, RESOURCES.BURGER_TOP);

    this.stacked2.setDisplaySize(48, 48);
    this.stacked2.setDisplayOrigin(55, 105);

    this.stacked3.setDisplaySize(48, 48);
    this.stacked3.setDisplayOrigin(55, 55);

    this.worldWidth = this.world.walls.right?.position.x!;
    this.worldHeight = this.world.walls.bottom?.position.y!;
  }

  preUpdate() {
    this.stacked.setX(this.x);
    this.stacked.setY(this.y);

    this.stacked.displayOriginY = 115 + (this.y / this.worldHeight) * -20;

    this.stacked2.setX(this.x);
    this.stacked2.setY(this.y);

    this.stacked2.displayOriginY = 145 + (this.y / this.worldHeight) * -20;

    this.stacked3.setX(this.x);
    this.stacked3.setY(this.y);

    this.stacked3.displayOriginX = 50 + (this.x / this.worldWidth - 0.3) * -200;
  }
}

class Patty extends Phaser.Physics.Matter.Image {
  stacked: Phaser.GameObjects.Image;
  stacked2: Phaser.GameObjects.Image;

  worldWidth: number;
  worldHeight: number;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    options: Phaser.Types.Physics.Matter.MatterBodyConfig = {}
  ) {
    super(scene.matter.world, x, y, texture, 0, {
      ...options,
    });

    this.setBody({
      type: "polygon",
      sides: 8,
      width: 40,
      height: 20,
    });

    this.setFixedRotation();

    this.setFriction(0, 0.1, 1);

    this.setDisplaySize(48, 48);
    this.setDisplayOrigin(55, 100);

    scene.add.existing(this);
  }

  preUpdate() {}
}

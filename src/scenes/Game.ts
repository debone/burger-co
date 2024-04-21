import { Scene } from "phaser";

import RexUIPlugin from "../lib/rexui";
import PhaserGamebus from "../lib/gamebus";

import { RESOURCES } from "../assets";

import { Dispenser } from "../objects/burgerShop/dispensers/dispenser";
import { SmallWorkspace } from "../objects/burgerShop/workspaces/smallWorkspace";
import {
  IngredientsStack,
  InteractiveIngredientsStack,
} from "../objects/ingredientsStack/ingredientsStack";
import { StackableBurgerPatty } from "../objects/ingredients/meat-patty/meat-patty";
import { QUALITY } from "../objects/ui/quality-indicator/quality-indicator";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  declare bus: Phaser.Events.EventEmitter;
  declare gamebus: PhaserGamebus;
  declare rexUI: RexUIPlugin;

  constructor() {
    super("Game");
  }

  create() {
    this.bus = this.gamebus.getBus();

    this.camera = this.cameras.main;

    this.background = this.add.image(0, 0, RESOURCES.BURGER_SHOP_EMPTY);
    this.background.setOrigin(0, 0);

    new SmallWorkspace(this);

    new Dispenser(this, 0, "MEAT_PATTY");
    new Dispenser(this, 1, "MEAT_PATTY");
    new Dispenser(this, 2, "MEAT_PATTY");
    new Dispenser(this, 3, "MEAT_PATTY");

    this.matter.world.setBounds().disableGravity();

    /*
    new Patty(this, 720, 480, RESOURCES.BURGER_PATTY);
    new Patty(this, 720, 475, RESOURCES.BURGER_PATTY);
    new Patty(this, 770, 480, RESOURCES.BURGER_PATTY);
    new Patty(this, 770, 475, RESOURCES.BURGER_PATTY);

    this.matter.world.nextCategory();
    let a = this.matter.world.nextCategory();

    new Stacked(this, 360, 820, RESOURCES.BURGER_BOTTOM).setCollisionCategory(
      a
    );

    new Indicator(this, 360, 280);

    new BurgerPatty(this, 370, 480, RESOURCES.BURGER_PATTY);
    new Patty(this, 370, 380, RESOURCES.BURGER_PATTY);*/

    const ing = new IngredientsStack(this, 620, 600);

    ing.addIngredient("MEAT_PATTY", Math.floor(Math.random() * 5));
    ing.addIngredient("MEAT_PATTY", Math.floor(Math.random() * 5));
    ing.addIngredient("MEAT_PATTY", Math.floor(Math.random() * 5));
    ing.addIngredient("MEAT_PATTY", Math.floor(Math.random() * 5));
    ing.addIngredient("MEAT_PATTY", Math.floor(Math.random() * 5));

    const ing2 = new IngredientsStack(this, 720, 600);
    ing2.addIngredient("MEAT_PATTY", Math.floor(Math.random() * 5));
    ing2.addIngredient("MEAT_PATTY", Math.floor(Math.random() * 5));
    ing2.addIngredient("MEAT_PATTY", Math.floor(Math.random() * 5));

    const ing3 = new InteractiveIngredientsStack(this, 820, 600);
    ing3.addIngredient(new StackableBurgerPatty(this, 0, 0));
    ing3.addIngredient(new StackableBurgerPatty(this, 0, 0));

    const ing4 = new InteractiveIngredientsStack(this, 860, 600);
    ing4.addIngredient(new StackableBurgerPatty(this, 0, 0, QUALITY.BURNT));

    new Stacked(this, 420, 600, RESOURCES.BURGER_BOTTOM);
    new Stacked(this, 420, 622, RESOURCES.BURGER_BOTTOM);
    new Stacked(this, 420, 621, RESOURCES.BURGER_BOTTOM);
    new Stacked(this, 410, 620, RESOURCES.BURGER_BOTTOM);
    new Stacked(this, 400, 620, RESOURCES.BURGER_BOTTOM);
    new Stacked(this, 400, 620, RESOURCES.BURGER_BOTTOM);

    this.matter.add.mouseSpring({
      stiffness: 0.2,
      damping: 1,
      collisionFilter: {
        category: 0x0002,
        mask: 3,
        group: 0,
      },
    });

    this.input.on("pointerup", () => {
      this.bus.emit("activePointer:up");
    });

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

/**
 */

export class Patty extends Phaser.Physics.Matter.Image {
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

    this.setInteractive();

    this.on("pointermove", () => {
      if (this.scene.input.manager.canvas.style.cursor !== "grabbing") {
        this.scene.input.manager.canvas.style.cursor = "grab";
      }
    });

    this.on("pointerdown", () => {
      this.scene.input.manager.canvas.style.cursor = "grabbing";
    });

    this.on("pointerup", () => {
      this.scene.input.manager.canvas.style.cursor = "auto";
    });

    this.on("pointerout", () => {
      if (!this.scene.input.activePointer.isDown) {
        this.scene.input.manager.canvas.style.cursor = "auto";
      }
    });
  }

  preUpdate() {}
}

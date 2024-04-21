import { BodyType } from "matter";
import { INGREDIENTS, INGREDIENTS_REPRESENTATION, Ingredients } from "..";
import { RESOURCES } from "../../../assets";
import { Game } from "../../../scenes/Game";
import {
  QUALITY,
  QualityIndicator,
} from "../../ui/quality-indicator/quality-indicator";

export class StackableBurgerPatty
  extends Phaser.GameObjects.Container
  implements Ingredients
{
  bus: Phaser.Events.EventEmitter;

  qualityIndicator: QualityIndicator;
  quality: QUALITY;
  cookedScore: number;
  ingredientImage: Phaser.GameObjects.Image;
  ingredient: INGREDIENTS_REPRESENTATION;

  constructor(
    scene: Game,
    x: number,
    y: number,
    quality: QUALITY = QUALITY.RAW
  ) {
    super(scene, x, y);

    this.ingredient = INGREDIENTS.MEAT_PATTY;
    this.quality = quality;

    this.bus = scene.gamebus.getBus();

    const patty = scene.make.image({ key: meatPatty.sprite });
    patty.setDisplaySize(55, 65);
    patty.setDisplayOrigin(55, 100);
    patty.setTint(meatPatty.tint[this.quality]);
    this.add(patty);
    this.ingredientImage = patty;
    this.cookedScore = 0;

    const qualityIndicator = new QualityIndicator(scene, 0, 18, this.quality);
    qualityIndicator.setVisible(false);
    this.add(qualityIndicator);
    this.qualityIndicator = qualityIndicator;
  }

  setQuality(quality: QUALITY) {
    this.quality = quality;
    this.ingredientImage.setTint(meatPatty.tint[quality]);
  }

  cookTick() {
    this.cookedScore += 1;
    if (this.cookedScore > meatPatty.cookStepTime) {
      this.cook();
    }
  }
  cook() {
    const nextStatus = this.qualityIndicator.increment();
    this.cookedScore = 0;
    console.log("Cooked", nextStatus);
    this.setQuality(nextStatus);
  }
}

export class BurgerPatty extends Phaser.GameObjects.Container {
  bus: Phaser.Events.EventEmitter;

  cookedScore: number;
  dragState: "down" | "dragging";
  physics:
    | Phaser.Physics.Matter.Sprite
    | Phaser.Physics.Matter.Image
    | Phaser.GameObjects.GameObject;

  status: QualityIndicator;
  patty: Phaser.GameObjects.Image;

  constructor(
    scene: Game,
    x: number,
    y: number,
    texture: string,
    options: Phaser.Types.Physics.Matter.MatterBodyConfig = {}
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.bus = scene.gamebus.getBus();

    const patty = scene.make.image({ key: texture });
    patty.setDisplaySize(55, 65);
    patty.setDisplayOrigin(55, 100);
    patty.setTint(meatPatty.tint[QUALITY.RAW]);
    this.add(patty);
    this.patty = patty;
    this.cookedScore = 0;

    const status = new QualityIndicator(scene, 0, 18);
    this.add(status);
    this.status = status;

    this.physics = scene.matter.add.gameObject(this, options, true);

    if (!("setBody" in this.physics)) {
      // TS sighs...
      return;
    }

    this.physics.setBody({
      type: "polygon",
      sides: 8,
      width: 20,
      height: 20,
    });
    this.physics.setFixedRotation();
    this.physics.setFriction(0, 0.1, 1);
    this.physics.setCollisionCategory(2);

    patty.setInteractive();

    this.dragState = "down";

    let grill = scene.matter
      .getMatterBodies()
      .find((body) => body.label === "grill") as BodyType;

    this.physics.setOnCollideActive((collision) => {
      if (collision.bodyA !== grill) {
        return;
      }

      this.cookedScore += 1;
      if (this.cookedScore > meatPatty.cookStepTime) {
        this.cook();
      }
    });

    this.physics.setOnCollide((...a) => {
      console.log(a);
    });

    patty.on("pointermove", () => {
      if (this.dragState === "down") {
        this.scene.input.manager.canvas.style.cursor = "grab";
      }
    });

    patty.on("pointerdown", () => {
      if (this.dragState === "down") {
        this.dragStart();
      }
    });

    patty.on("pointerup", () => {
      console.log("up");
      if (this.dragState === "dragging") {
        this.dragEnd();
      }
    });

    patty.on("pointerout", () => {
      console.log("out");

      if (this.dragState === "down") {
        this.scene.input.manager.canvas.style.cursor = "auto";
      }
    });

    this.bus.on("activePointer:up", () => {
      if (this.dragState === "dragging") {
        this.dragEnd();
      }
    });
  }

  cook() {
    const nextStatus = this.status.increment();
    this.cookedScore = 0;
    console.log("Cooked", nextStatus);
    this.patty.setTint(meatPatty.tint[nextStatus]);
  }

  dragStart() {
    if (!("setBody" in this.physics)) {
      // TS sighs...
      return;
    }

    console.log("dragstart");
    this.scene.input.manager.canvas.style.cursor = "grabbing";
    this.physics.setCollisionCategory(2);
    this.physics.setCollidesWith([2]);
    this.dragState = "dragging";
  }

  dragEnd() {
    if (!("setBody" in this.physics)) {
      // TS sighs...
      return;
    }

    console.log("dragend");
    this.scene.input.manager.canvas.style.cursor = "auto";
    this.physics.setCollisionCategory(1);
    this.physics.setCollidesWith([1]);
    this.dragState = "down";
  }
}

export const meatPatty = {
  name: "Meat Patty",
  sprite: RESOURCES.BURGER_PATTY,
  dispenserOffset: { x: -35, y: 160 },
  cookStepTime: 250,
  object: StackableBurgerPatty,
  tint: {
    [QUALITY.RAW]: 0xff33aa,
    [QUALITY.LUKEWARM]: 0xff99dd,
    [QUALITY.COOKED]: 0xfbb954,
    [QUALITY.OVERCOOKED]: 0x9e3344,
    [QUALITY.BURNT]: 0x333333,
  },
};

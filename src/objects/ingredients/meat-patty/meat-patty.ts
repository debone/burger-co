import { BodyType } from "matter";
import { RESOURCES } from "../../../assets";
import { Game } from "../../../scenes/Game";
import { assert } from "../../../common/assert";
import { Indicator } from "../../indicator/indicator";

export class BurgerPatty extends Phaser.GameObjects.Container {
  declare bus: Phaser.Events.EventEmitter;

  cookedScore: number;
  dragState: "down" | "dragging";
  physics:
    | Phaser.Physics.Matter.Sprite
    | Phaser.Physics.Matter.Image
    | Phaser.GameObjects.GameObject;

  status: Indicator;
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
    this.add(patty);
    this.patty = patty;
    this.cookedScore = 0;

    const status = new Indicator(scene, 0, 18);
    this.add(status);
    this.status = status;

    patty.setTint(0xffaaaa);

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

    switch (nextStatus) {
      case 1:
        this.patty.setTint(0xff8888);
        break;
      case 2:
        this.patty.setTint(0xffccaa);
        break;
      case 3:
        this.patty.setTint(0xffeeaa);
        break;
      case 4:
        this.patty.setTint(0x333333);
        break;
      default:
        assert(false, "Invalid status");
    }
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

export const meatPatty: {
  name: string;
  sprite: string;
  dispenserOffset: { x: number; y: number };
  cookStepTime: number;
  object: typeof BurgerPatty;
} = {
  name: "Meat Patty",
  sprite: RESOURCES.BURGER_PATTY,
  dispenserOffset: { x: -35, y: 160 },
  cookStepTime: 250,
  object: BurgerPatty,
};

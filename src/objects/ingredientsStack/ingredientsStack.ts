import { BodyType } from "matter";
import { GameObjects } from "phaser";
import { assert } from "../../common/assert";
import { Game } from "../../scenes/Game";
import {
  INGREDIENTS,
  INGREDIENTS_OBJECTS,
  INGREDIENTS_REPRESENTATION,
} from "../ingredients";
import { QUALITY } from "../ui/quality-indicator/quality-indicator";

export class IngredientsStack extends Phaser.GameObjects.Container {
  bus: Phaser.Events.EventEmitter;
  physics:
    | Phaser.Physics.Matter.Sprite
    | Phaser.Physics.Matter.Image
    | Phaser.GameObjects.GameObject;

  dragState: "down" | "dragging";
  stack: { ingredient: INGREDIENTS_REPRESENTATION; quality: QUALITY }[] = [];
  worldWidth: number;

  shadow: Phaser.GameObjects.Graphics;

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.bus = scene.gamebus.getBus();

    this.physics = scene.matter.add.gameObject(this, {}, true);

    if (!("setBody" in this.physics)) {
      // TS sighs...
      return;
    }

    this.physics.setBody({
      type: "polygon",
      sides: 8,
      width: 32,
      height: 32,
    });

    this.physics.setFixedRotation();
    this.physics.setFriction(0, 0.1, 1);
    this.physics.setCollisionCategory(2);

    this.setSize(32, 32);
    this.setInteractive();

    //scene.add.circle(x, y, 32, 0xff0000, 0.5).setOrigin(0.5, 0.5);

    this.shadow = scene.make
      .graphics({ fillStyle: { color: 0x000000, alpha: 0.25 } })
      .fillEllipse(0, 5, 48, 24);
    this.add(this.shadow);

    /*    let patty2 = this.scene.make.image({ x, y, key: RESOURCES.BURGER_PATTY });

    patty2.setDisplaySize(48, 48);
    patty2.setDisplayOrigin(55, 105);
  this.add(patty2);*/

    this.worldWidth = scene.matter.world.walls.right?.position.x!;
  }

  addIngredient(
    ingredientKey: INGREDIENTS,
    quality: QUALITY,
    gameObject?: Phaser.GameObjects.GameObject
  ) {
    const ingredient = INGREDIENTS[ingredientKey];
    this.stack.push({ ingredient, quality });
    if (gameObject) {
      assert(false, "Not implemented");
      //this.add(gameObject);
    } else {
      const ingredientImage = this.scene.make.image({ key: ingredient.sprite });
      this.add(ingredientImage);

      ingredientImage.setDisplaySize(55, 65);
      ingredientImage.setDisplayOrigin(55, 80 + 20 * this.stack.length);

      if (ingredient?.tint?.[quality])
        ingredientImage.setTint(ingredient.tint[quality]);
    }
  }

  preUpdate() {
    this.shadow.x = (this.x / this.worldWidth - 0.3) * 40;
    this.depth = this.y;
  }
}

export class InteractiveIngredientsStack extends Phaser.GameObjects.Container {
  bus: Phaser.Events.EventEmitter;
  physics:
    | Phaser.Physics.Matter.Sprite
    | Phaser.Physics.Matter.Image
    | Phaser.GameObjects.GameObject;

  dragState: "down" | "dragging";
  worldWidth: number;

  shadow: Phaser.GameObjects.Graphics;

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.bus = scene.gamebus.getBus();

    this.setupPhysics(scene);

    this.setSize(32, 32);
    this.setInteractive();

    this.shadow = scene.make
      .graphics({ fillStyle: { color: 0x000000, alpha: 0.25 } })
      .fillEllipse(0, 5, 48, 24);

    this.add(this.shadow);

    this.worldWidth = scene.matter.world.walls.right?.position.x!;
  }

  //next-step Make the burger patty come from the non-physics one
  //next-step Make stacks stackable or destackable with double click
  //             I wonder how the destruction of the stack, but not of the game objects on it will go about.

  setupPhysics(scene: Game) {
    this.dragState = "down";

    this.physics = this.scene.matter.add.gameObject(this, {}, true);

    if (!("setBody" in this.physics)) {
      // TS sighs...
      return;
    }

    this.physics.setBody({
      type: "polygon",
      sides: 8,
      width: 32,
      height: 32,
    });

    this.physics.body!.label = "stack";

    this.physics.setFixedRotation();
    this.physics.setFriction(0, 0.05, 0.5);

    let grill = this.scene.matter
      .getMatterBodies()
      .find((body) => body.label === "grill") as BodyType;

    this.physics.setOnCollideActive((collision) => {
      if (collision.bodyA !== grill) {
        return;
      }

      // Emit event for first child
      const ingredient = this.getFirst("ingredient");
      if (ingredient && "cookTick" in ingredient) {
        ingredient.cookTick();
      }
    });

    this.physics.setOnCollide((collision) => {
      console.log(collision.bodyA.label, collision.bodyB.label);
      if (
        collision.bodyA.label !== "stack" ||
        collision.bodyB.label !== "stack"
      ) {
        return;
      }

      let faster =
        collision.bodyA.speed > collision.bodyB.speed ? "bodyA" : "bodyB";
      let slower = faster === "bodyA" ? "bodyB" : "bodyA";
      // log collision speeds
      console.log("merge collision", collision);

      if (this.physics.body && collision[slower].id === this.physics.body.id) {
        console.log("bodyA list", collision.bodyA.gameObject.list);
        console.log("bodyB list", collision.bodyB.gameObject.list);

        (collision[faster].gameObject as GameObjects.Container)
          .getAll("ingredient")
          .forEach((ingredient) => {
            this.addIngredient(ingredient);
          });

        setTimeout(() => collision[faster].gameObject.destroy(), 0);

        this.setVelocity(0, 0);
        //this.dragEnd();
      }
    });

    this.physics.on("pointermove", () => {
      if (this.dragState === "down") {
        this.scene.input.manager.canvas.style.cursor = "grab";
      }
    });
    let lastTime = 0;
    this.physics.on("pointerdown", (pointer) => {
      let clickDelay = pointer.downTime - lastTime;
      lastTime = pointer.downTime;

      if (clickDelay < 350) {
        if (this.list.length > 2) {
          const stack = new InteractiveIngredientsStack(
            scene,
            this.x + Math.random() * 10 - 5,
            this.y + Math.random() * 10 - 5
          );
          console.log("splitting", this.list);
          this.getAll("ingredient").forEach((ingredient, i) => {
            console.log("kicked", i, ingredient);
            if (i > 0) {
              stack.addIngredient(ingredient);
            }
          });
        }
      }

      if (this.dragState === "down") {
        this.dragStart();
      }
    });

    this.physics.on("pointerup", () => {
      if (this.dragState === "dragging") {
        this.dragEnd();
      }
    });

    this.physics.on("pointerout", () => {
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

  dragStart() {
    if (!("setBody" in this.physics)) {
      // TS sighs...
      return;
    }

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

  addIngredient(ingredient: InstanceType<INGREDIENTS_OBJECTS>) {
    ingredient.ingredientImage.setDisplayOrigin(55, 80 + 20 * this.list.length);

    if (this.list.length === 1) {
      ingredient.qualityIndicator.setVisible(true);
    } else {
      ingredient.qualityIndicator.setVisible(false);
    }

    this.add(ingredient);
  }

  preUpdate() {
    this.shadow.x = (this.x / this.worldWidth - 0.3) * 40;
    this.depth = this.y;
  }
}

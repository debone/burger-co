import { BodyType } from "matter";
import { GameObjects } from "phaser";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { MainGame } from "../../scenes/main-game";
import { IngredientsStackDisplay } from "../../ui/ingredients-stack-display/ingredients-stack-display";
import { INGREDIENTS_OBJECTS } from "../ingredients";

export class IngredientsStack extends Phaser.GameObjects.Container {
  declare scene: MainGame;
  bus: Phaser.Events.EventEmitter;
  physics:
    | Phaser.Physics.Matter.Sprite
    | Phaser.Physics.Matter.Image
    | Phaser.GameObjects.GameObject;

  dragState: "down" | "dragging";
  worldWidth: number;

  shadow: Phaser.GameObjects.Graphics;

  ingredientsStackDisplay: UIPlugin.Menu | null;

  constructor(scene: MainGame, x: number, y: number) {
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

  setupPhysics(scene: MainGame) {
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

    let lowerCounter = this.scene.matter
      .getMatterBodies()
      .find((body) => body.label === "lowerCounter") as BodyType;

    this.physics.setOnCollideActive((collision) => {
      if (collision.bodyA === grill) {
        const ingredient = this.getFirst("ingredient");
        if (ingredient && "cookTick" in ingredient) {
          ingredient.cookTick();
        }
      }

      if (collision.bodyA === lowerCounter) {
        const deliver = this.getAll("ingredient")
          .reverse()
          .map((ingredient) => ({
            ingredient: ingredient.ingredient,
            quality: ingredient.quality,
          })) as { ingredient: INGREDIENTS_OBJECTS; quality: number }[];
        console.log("Delivered!", deliver);

        scene.orders.deliverMainOrder(deliver);

        this.destroy();
        if (this.ingredientsStackDisplay) {
          this.ingredientsStackDisplay.collapse();
          this.ingredientsStackDisplay.destroy();
          this.ingredientsStackDisplay = null;
        }
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
        this.hoverStart();
      }
    });

    let lastTime = 0;
    this.physics.on("pointerdown", (pointer) => {
      this.hoverEnd();

      let clickDelay = pointer.downTime - lastTime;
      lastTime = pointer.downTime;

      if (clickDelay < 350) {
        if (this.list.length > 2) {
          const stack = new IngredientsStack(
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
        this.hoverEnd();
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

  hoverStart() {
    console.log("hoverStart");
    if (this.list.length > 2 && !this.ingredientsStackDisplay) {
      this.ingredientsStackDisplay = IngredientsStackDisplay.create(
        this.scene,
        this.x - 260,
        this.y - 30 * this.list.length,
        this.getAll("ingredient")
          .reverse()
          .map((ingredient) => ({
            name: ingredient.ingredient.name,
            status: ingredient.quality,
          }))
      );
    }
  }

  hoverEnd() {
    console.log("hoverEnd");
    if (this.ingredientsStackDisplay) {
      this.ingredientsStackDisplay.collapse();
      this.ingredientsStackDisplay.destroy();
      this.ingredientsStackDisplay = null;
    }
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

import { getNextDispenserPosition } from ".";
import { RESOURCES } from "../../../assets";
import { Vector2 } from "../../../common/helpers";
import { INGREDIENTS } from "../../ingredients";
import { IngredientsStack } from "../../ingredients-stack/ingredients-stack";
import { QUALITY } from "../../../ui/quality-indicator/quality-indicator";

export class Dispenser extends Phaser.GameObjects.Sprite {
  open: boolean;
  index: number;
  ingredientName: Phaser.GameObjects.Text;
  ingredientSprite: Phaser.GameObjects.Image;
  ingredientObject: Phaser.Physics.Matter.Image;

  constructor(scene: Phaser.Scene, index: number, ingredientKey: INGREDIENTS) {
    const pos = getNextDispenserPosition(index);
    super(scene, pos.x, pos.y, RESOURCES.BURGER_SHOP_DRAWER_CLOSED);

    this.setOrigin(0.5, 0);
    this.index = index;

    scene.add.existing(this);

    const ingredient = INGREDIENTS[ingredientKey];

    this.ingredientName = this.scene.add.text(
      pos.x - 10,
      pos.y + 158,
      ingredient.name,
      {
        fontSize: "10px",
      }
    );

    this.ingredientSprite = this.scene.add
      .image(
        pos.x + ingredient.dispenserOffset.x,
        pos.y + ingredient.dispenserOffset.y,
        ingredient.sprite
      )
      .setScale(0.3);

    this.open = false;

    this.setInteractive();

    let ingredientNamePosY = this.ingredientName.y;
    let ingredientImagePosY = this.ingredientSprite.y;

    this.on("pointerover", () => {
      this.open = true;
      this.setTexture(RESOURCES.BURGER_SHOP_DRAWER_OPEN);
      this.ingredientSprite.y = ingredientImagePosY + 27;
      this.ingredientName.y = ingredientNamePosY + 26;
    });

    this.on("pointermove", ({ position }: { position: Vector2 }) => {
      if (
        position.y > pos.y + 130 &&
        this.scene.input.manager.canvas.style.cursor !== "grabbing"
      ) {
        this.scene.input.manager.canvas.style.cursor = "grab";
      }
    });

    this.on("pointerout", () => {
      this.open = false;
      this.setTexture(RESOURCES.BURGER_SHOP_DRAWER_CLOSED);
      this.ingredientSprite.y = ingredientImagePosY;
      this.ingredientName.y = ingredientNamePosY;
      this.scene.input.manager.canvas.style.cursor = "auto";
    });

    this.on(
      "pointerdown",
      ({ downX, downY }: { downX: number; downY: number }) => {
        if (downY < pos.y + 130) return;
        //okay.. this.scene.events.emit("dispenserClicked", ingredientKey);
        this.ingredientObject = new IngredientsStack(this.scene, downX, downY);

        this.ingredientObject.dragStart();
        this.ingredientObject.dragEnd();
        this.ingredientObject.dragStart();

        this.ingredientObject.addIngredient(
          new INGREDIENTS[ingredientKey].object(this.scene, 0, 0, QUALITY.RAW)
        );
      }
    );
  }

  destroy(): void {
    this.ingredientName.destroy();
    this.ingredientSprite.destroy();
    super.destroy();
  }
}

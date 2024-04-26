import { RESOURCES } from "../../assets";
import { INGREDIENTS } from "../../objects/ingredients";
import { MainGame } from "../../scenes/main-game";
import { Order } from "../../systems/orders/orders";
import { QualityIndicator } from "../quality-indicator/quality-indicator";

export class OrderUI extends Phaser.GameObjects.Container {
  declare scene: MainGame;

  id: number;
  constructor(id: number, scene: MainGame, x: number, y: number, order: Order) {
    super(scene, x, y);
    this.scene.add.existing(this);

    this.id = id;

    this.add(
      scene.add.image(0, 0, RESOURCES.ORDER).setOrigin(0, 0).setScale(1.25)
    );
    this.add(
      scene.add.text(20, 20, `Order ${id}`, {
        fontFamily: "DotGothic16",
        fontSize: "24px",
        color: "#0a202f",
      })
    );

    const gridSizer = scene.rexUI.add
      .gridSizer({
        x: 0,
        y: 0,
        width: 215,
        column: 2,
        row: 15,
        space: {
          column: -32,
          row: -24,
          left: 30,
          right: 10,
          top: 20,
          bottom: 10,
        },
      })
      .setOrigin(0, 0);

    order.main.forEach((item) => {
      const ingredient = scene.add
        .image(0, 0, INGREDIENTS[item.ingredient].sprite)
        .setTint(INGREDIENTS[item.ingredient].tint[item.status])
        .setDisplaySize(55, 65)
        .setOrigin(0, 0);
      const quality = new QualityIndicator(scene, 0, 0, item.status, true);

      gridSizer.add(ingredient, { expand: false, align: "center" });
      gridSizer.add(quality, { expand: false, align: "bottom" });
    });

    gridSizer.layout();

    this.add(gridSizer);

    this.depth = 10000;
  }

  deliveredMain(positiveOutcome: boolean) {
    if (positiveOutcome) {
      this.getFirst().setTint(0xaffaa);
    } else {
      this.getFirst().setTint(0xffaaaa);
    }
  }
}

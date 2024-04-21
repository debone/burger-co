import RexUIPlugin from "../../../lib/rexui";
import { Game } from "../../../scenes/Game";
import {
  QUALITY,
  QualityIndicator,
} from "../quality-indicator/quality-indicator";

export class IngredientsStackDisplay {
  static create(
    scene: Game,
    x: number,
    y: number,
    items: { name: string; status: QUALITY }[]
  ): RexUIPlugin.Menu {
    const menu = scene.rexUI.add.menu({
      x,
      y,

      items,

      createButtonCallback: (item, index, items) => {
        const label = {
          background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 2, 0x123456),
          text: scene.add.text(0, 0, item.name),
          icon: scene.add.circle(0, 0, 10, 0x888888),
          action: new QualityIndicator(scene, 0, 0, item.status, true),
          space: {
            left: 10,
            right: 10,
          },
        };

        console.log(item);
        if (item.status) {
          //label.action = new Indicator(this, 0, 0, item.status);
          //this.add.existing(label.action);
        }

        return scene.rexUI.add.label(label).layout();
      },

      createBackgroundCallback: (items) =>
        scene.rexUI.add.roundRectangle(0, 0, 0, 0, 5, 0x445332),

      space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
        item: 10,
      },
    });

    menu
      .on("button.over", (button: RexUIPlugin.Buttons) => {
        (
          button.getElement("background")! as RexUIPlugin.CustomShapes
        ).setStrokeStyle(1, 0xffffff, 1);
      })
      .on("button.out", (button: RexUIPlugin.Buttons) => {
        (
          button.getElement("background")! as RexUIPlugin.CustomShapes
        ).setStrokeStyle(1, 0x003303, 1);
      })
      .on("button.click", (button: RexUIPlugin.Buttons) => {
        console.log(button);
      });

    menu.depth = -1000;

    return menu;
  }
}

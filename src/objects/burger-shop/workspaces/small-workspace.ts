import { RESOURCES } from "../../../assets";
import { makeMatterShape } from "./workspaces-geometry";

export class SmallWorkspace extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene) {
    super(scene, 268, 500, RESOURCES.BURGER_SHOP_WORKSPACE_SMALL);
    this.setOrigin(0, 0);

    this.scene.add.existing(this);

    const lowerCounter = makeMatterShape("lowerCounter", this.scene, {
      isStatic: true,
      isSensor: true,
      ignorePointer: true,
    });

    const ramp = makeMatterShape("ramp", this.scene, {
      isStatic: true,
      isSensor: true,
      ignorePointer: true,
    });

    const higherCounter = makeMatterShape("higherCounter", this.scene, {
      isStatic: true,
      isSensor: true,
      ignorePointer: true,
    });

    const grill = makeMatterShape("grill", this.scene, {
      isStatic: true,
      isSensor: true,
      ignorePointer: true,
    });

    // counter-clockwise from the left of the soda machine
    const sides = [
      makeMatterShape("topLowerCounter", this.scene, {
        isStatic: true,
        ignorePointer: true,
      }),
      makeMatterShape("leftLowerCounter", this.scene, {
        isStatic: true,
        ignorePointer: true,
      }),
      makeMatterShape("bottomLowerCounter", this.scene, {
        isStatic: true,
        ignorePointer: true,
      }),
      makeMatterShape("topRamp", this.scene, {
        isStatic: true,
        ignorePointer: true,
      }),
      makeMatterShape("bottomRamp", this.scene, {
        isStatic: true,
        ignorePointer: true,
      }),
      makeMatterShape("topHigherCounter", this.scene, {
        isStatic: true,
        ignorePointer: true,
      }),
      makeMatterShape("rightHigherCounter", this.scene, {
        isStatic: true,
        ignorePointer: true,
      }),
      makeMatterShape("bottomHigherCounter", this.scene, {
        isStatic: true,
        ignorePointer: true,
      }),
    ];

    console.log("he", this.scene.matter.world.nextCategory());

    /*
    const workspaceSmallDetector = this.scene.matter.add.rectangle(
      368,
      //268,
      500,
      100,
      100,
      {
        isSensor: true,
        isStatic: true,
      }
    );

    const r = this.scene.matter.add.rectangle(360, 620, 150, 24, {
      isStatic: true,
    });

    const d = this.scene.matter.add.rectangle(1260, 620, 50, 24, {
      isStatic: true,
    });*/
  }
}

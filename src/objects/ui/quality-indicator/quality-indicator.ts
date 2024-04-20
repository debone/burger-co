import { RESOURCES } from "../../../assets";

export enum QUALITY {
  RAW = 0,
  LUKEWARM = 1,
  COOKED = 2,
  OVERCOOKED = 3,
  BURNT = 4,
}

export class QualityIndicator extends Phaser.GameObjects.Container {
  status: QUALITY;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    status: QUALITY = QUALITY.RAW,
    addToScene: boolean = false
  ) {
    super(scene, x, y);

    const indicator = scene.make.sprite({ key: RESOURCES.STATUS_ICONS });
    indicator.setFrame(status);
    this.status = status;

    this.add(indicator);

    this.setSize(indicator.width, 32);

    if (addToScene) {
      this.scene.add.existing(this);
    }

    return this;
  }

  increment() {
    if (this.status < QUALITY.BURNT) {
      this.status++;
    }
    (this.first! as Phaser.GameObjects.Sprite).setFrame(this.status);
    return this.status;
  }
}

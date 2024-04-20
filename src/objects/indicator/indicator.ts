import { RESOURCES } from "../../assets";

export enum STATUS {
  START = 0,
  RARE = 1,
  MEDIUM_RARE = 2,
  DONE = 3,
  BURNT = 4,
}

export class Indicator extends Phaser.GameObjects.Container {
  status: STATUS;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    status: STATUS = STATUS.START
  ) {
    super(scene, x, y);

    const indicator = scene.make.sprite({ key: RESOURCES.STATUS_ICONS });
    indicator.setFrame(status);
    this.status = status;

    this.add(indicator);
  }

  increment() {
    if (this.status < STATUS.BURNT) {
      this.status++;
    }
    (this.first! as Phaser.GameObjects.Sprite).setFrame(this.status);
    return this.status;
  }
}

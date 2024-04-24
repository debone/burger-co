import { Customer } from "..";
import { RESOURCES } from "../../../assets";
import { Game } from "../../../scenes/Game";

export class Bezelbub extends Phaser.GameObjects.Container implements Customer {
  declare scene: Game;

  bezelbub: Phaser.GameObjects.Image;

  yGoal: number = 0;

  id: number;
  order: number;
  state: "moving" | "waiting" | "ordering" | "leaving" = "moving";

  constructor(
    id: number,
    scene: Phaser.Scene,
    x: number,
    y: number,
    goal: number
  ) {
    super(scene, x, y);

    this.id = id;
    this.bezelbub = scene.make.image({ key: RESOURCES.CUSTOMER_BEZELBUB });

    // add rex progress pie

    this.add(this.bezelbub);

    scene.add.existing(this);

    scene.time.addEvent({
      delay: 1000,
      callback: () => this.setGoal(),
    });

    this.yGoal = goal;
  }

  setGoal() {
    console.log("Setting goal");
  }

  protected preUpdate(): void {
    switch (this.state) {
      case "moving": {
        if (this.y < this.yGoal) {
          this.y += 1;
        }
        if (this.y == this.yGoal) {
          if (this.order) {
            this.state = "waiting";
          } else {
            this.tryMakeOrder();
          }
        }
        break;
      }
      case "waiting": {
        this.wait();
        break;
      }
      case "leaving": {
        this.leave();
        break;
      }
    }

    this.depth = this.y;
  }

  tryMakeOrder() {
    const order = this.scene.orders.requestOrder();
    if (order) {
      this.order = order;
      this.state = "waiting";
    }
  }

  patience: number = 100;

  wait() {
    this.patience -= 1;

    if (this.patience <= 0) {
      this.scene.orders.cancelOrder(this.order);
      this.scene.customerQueue.dropCustomer(this.id);

      this.state = "leaving";
    }
  }

  leave() {
    this.x -= 1;

    if (this.x < 0) {
      this.destroy();
    }
  }
}

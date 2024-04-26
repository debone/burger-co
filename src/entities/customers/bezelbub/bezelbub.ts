import CircularProgress from "phaser3-rex-plugins/plugins/circularprogress";
import { Customer } from "..";
import { RESOURCES } from "../../../assets";
import { RexCircularProgressPlugin } from "../../../lib/rexui";
import { MainGame } from "../../../scenes/main-game";

export class Bezelbub extends Phaser.GameObjects.Container implements Customer {
  declare scene: MainGame;

  bezelbub: Phaser.GameObjects.Image;

  yGoal: number = 0;

  id: number;
  order: number;
  state: "moving" | "waiting" | "ordering" | "leaving" | "happy" = "moving";

  progressBar: CircularProgress;

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

    this.add(this.bezelbub);

    this.progressBar = new RexCircularProgressPlugin(
      scene,
      0,
      -100,
      32,
      0xff00ff,
      1,
      {
        thickness: 1,
        anticlockwise: false,
        valuechangeCallback: function (newValue, oldValue, circularProgress) {},
      }
    );

    this.add(this.progressBar);

    scene.add.existing(this);

    scene.time.addEvent({
      delay: 1000,
      callback: () => this.setGoal(),
    });

    this.yGoal = goal;
  }

  setGoal() {}

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
      case "happy": {
      }
    }

    this.depth = this.y;
  }

  tryMakeOrder() {
    const order = this.scene.orders.requestOrder(this.id);
    if (order) {
      this.order = order;
      this.state = "waiting";
    }
  }

  delivered(positiveOutcome: boolean): void {
    this.state = "happy";
    if (positiveOutcome) {
      this.progressBar.setBarColor(0x00ff00);
    } else {
      this.progressBar.setBarColor(0xff0000);
    }

    this.progressBar.setValue(1);

    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.scene.orders.cancelOrder(this.order);
        this.scene.customerQueue.dropCustomer(this.id);

        this.state = "leaving";
      },
    });
  }

  maxPatience: number = 5000;
  patience: number = this.maxPatience;

  wait() {
    this.patience -= 1;

    this.progressBar.setValue(this.patience / this.maxPatience);

    if (this.patience <= 0) {
      this.scene.orders.cancelOrder(this.order);
      this.scene.customerQueue.dropCustomer(this.id);
      this.scene.addDayOrders(false);

      this.getFirst().setTint(0xff7777);

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

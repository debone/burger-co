import { RESOURCES } from "../assets";
import { INGREDIENTS } from "../objects/ingredients";
import { Game } from "../scenes/Game";
import { QUALITY } from "../ui/quality-indicator/quality-indicator";

export const MAX_ORDERS = 3;

export interface Order {
  id: number;
  main: { ingredient: INGREDIENTS; status: QUALITY }[];
  drink: boolean;
  side: boolean;
  container: Phaser.GameObjects.Container;
}

export class Orders {
  orderId = 1;
  orders: Map<number, Order> = new Map();

  scene: Game;

  constructor(scene: Game) {
    this.scene = scene;
  }

  newOrder(): Order {
    const order: Order = {
      id: this.orderId++,
      main: [{ ingredient: "MEAT_PATTY", status: QUALITY.LUKEWARM }],
      drink: false,
      side: false,
      container: this.scene.add.container(200 + this.orders.size * 200, 0),
    };

    order.container.add(
      this.scene.add.image(0, 0, RESOURCES.ORDER).setOrigin(0, 0)
    );

    this.orders.set(order.id, order);

    return order;
  }

  requestOrder(): number | false {
    if (this.orders.size < MAX_ORDERS) {
      return this.newOrder().id;
    }
    console.log("max orders reached");

    return false;
  }

  cancelOrder(id: number) {
    this.orders.get(id)?.container.destroy();
    this.orders.delete(id);
  }
}

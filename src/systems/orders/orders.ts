import { INGREDIENTS, INGREDIENTS_OBJECTS } from "../../objects/ingredients";
import { MainGame } from "../../scenes/main-game";
import { OrderUI } from "../../ui/orders/order-ui";
import { QUALITY } from "../../ui/quality-indicator/quality-indicator";
import { RECIPES } from "./recipes";

export const MAX_ORDERS = 4;

export interface Order {
  main: { ingredient: INGREDIENTS; status: QUALITY }[];
  drink: boolean;
  side: boolean;
}

export interface OrderStruct {
  id: number;
  customerId: number;
  order: Order;
  container: OrderUI;
}

export const ORDER_START_POS_X = 300;
export const ORDER_START_POS_Y = 32;
export const ORDER_SPACING = 230;

export class Orders {
  nextOrderId = 1;
  orders: Map<number, OrderStruct> = new Map();

  scene: MainGame;

  constructor(scene: MainGame) {
    this.scene = scene;
  }

  newOrder(customerId: number): OrderStruct {
    const order: Order = {
      main: RECIPES["basic-burger"](),
      drink: false,
      side: false,
    };
    const orderStruct: OrderStruct = {
      id: this.nextOrderId,
      customerId,
      order,
      container: new OrderUI(
        this.nextOrderId,
        this.scene,
        ORDER_START_POS_X + this.orders.size * ORDER_SPACING,
        ORDER_START_POS_Y,
        order
      ),
    };

    this.orders.set(orderStruct.id, orderStruct);

    this.nextOrderId++;

    return orderStruct;
  }

  requestOrder(customerId: number): number | false {
    if (this.orders.size < MAX_ORDERS) {
      return this.newOrder(customerId).id;
    }

    return false;
  }

  cancelOrder(id: number) {
    this.orders.get(id)?.container.destroy();
    this.orders.forEach((order, key) => {
      if (key > id) {
        order.container.x -= ORDER_SPACING;
      }
    });
    this.orders.delete(id);
  }

  deliverMainOrder(
    ingredients: { ingredient: INGREDIENTS_OBJECTS; quality: QUALITY }[]
  ) {
    for (let order of this.orders.values()) {
      if (
        order.order.main.every((main) =>
          ingredients.some(
            (ingredient) =>
              ingredient.ingredient.name ===
                INGREDIENTS[main.ingredient].name &&
              ingredient.quality === main.status
          )
        )
      ) {
        order.container.deliveredMain();
        this.scene.customerQueue.deliveredOrder(order.customerId);

        break;
      }
    }
  }
}

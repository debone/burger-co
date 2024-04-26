import { pickRandom } from "../../common/helpers";
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
  fulfilled: boolean;
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

  getRecipe() {
    const availableRecipes = [];
    if (this.scene.day > 2) {
      if (this.scene.clockTime < this.scene.dayDuration / 2) {
        availableRecipes.push(RECIPES["devils-burger"]());
        availableRecipes.push(RECIPES["devils-burger"]());
        availableRecipes.push(RECIPES["devils-burger"]());
        availableRecipes.push(RECIPES["devils-burger"]());
        availableRecipes.push(RECIPES["devils-burger"]());
        availableRecipes.push(RECIPES["devils-burger"]());
      }
      availableRecipes.push(RECIPES["soul-burger"]());
      availableRecipes.push(RECIPES["soul-burger"]());
      availableRecipes.push(RECIPES["soul-burger"]());
      availableRecipes.push(RECIPES["soul-burger"]());
    }
    if (this.scene.day > 1) {
      if (this.scene.clockTime < this.scene.dayDuration / 2) {
        availableRecipes.push(RECIPES["cheese-black-burger"]());
        availableRecipes.push(RECIPES["cheese-black-burger"]());
        availableRecipes.push(RECIPES["cheese-black-burger"]());
      }
      availableRecipes.push(RECIPES["cheese-burger"]());
      availableRecipes.push(RECIPES["cheese-burger"]());
    }

    if (this.scene.clockTime < this.scene.dayDuration / 2) {
      availableRecipes.push(RECIPES["double-burger"]());
      availableRecipes.push(RECIPES["double-burger"]());
    }
    availableRecipes.push(RECIPES["basic-burger"]());

    return pickRandom(availableRecipes);
  }

  newOrder(customerId: number): OrderStruct {
    const order: Order = {
      main: this.getRecipe(),
      drink: false,
      side: false,
    };
    const orderStruct: OrderStruct = {
      id: this.nextOrderId,
      customerId,
      order,
      fulfilled: false,
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
  ): boolean {
    if (this.orders.size === 0) return false;

    let someOrderFullfilled = false;

    for (let order of this.orders.values()) {
      if (order.fulfilled) continue;

      // Check if all ingredients are in the order
      let inPrecision =
        order.order.main.length === ingredients.length &&
        order.order.main.every(
          (main, i) =>
            ingredients[i].ingredient.name === INGREDIENTS[main.ingredient].name
        );

      this.scene.addScore("precision", inPrecision ? 1 : -0.5);

      let inQuality =
        order.order.main.length === ingredients.length &&
        order.order.main.every(
          (main, i) => ingredients[i].quality === main.status
        );

      this.scene.addScore("quality", inQuality ? 1 : -0.5);

      let inTime =
        this.scene.customerQueue.customers.get(order.customerId)!.patience >
        this.scene.customerQueue.customers.get(order.customerId)!.maxPatience /
          2;

      this.scene.addScore("timing", inTime ? 1 : -0.5);

      order.fulfilled = true;
      someOrderFullfilled = true;

      if (inPrecision && inQuality && inTime) {
        this.scene.addDayOrders(true);
      } else {
        this.scene.addDayOrders(false);
      }

      order.container.deliveredMain(inPrecision && inQuality && inTime);
      this.scene.customerQueue.deliveredOrder(
        order.customerId,
        inPrecision && inQuality && inTime
      );
      break;
    }

    return someOrderFullfilled;
  }

  destroy() {
    this.orders.forEach((order) => {
      order.container.destroy();
    });
    this.orders.clear();
  }
}

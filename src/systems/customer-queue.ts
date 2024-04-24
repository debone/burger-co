import { Customer } from "../entities/customers";
import { Bezelbub } from "../entities/customers/bezelbub/bezelbub";
import { FINAL_CUSTOMER_GOAL } from "../main";

export class CustomerQueue extends Phaser.Time.Timeline {
  customerId = 1;
  customers: Map<number, Customer> = new Map();

  constructor(scene: Phaser.Scene) {
    super(scene);
  }

  create() {
    console.log("hello");
    this.tick();
    return this;
  }

  tick() {
    this.add({
      in: 5000,
      run: () => {
        this.spawnCustomer();
        this.tick();
      },
    });
  }

  spawnCustomer() {
    console.log("Trying creating customer");
    if (this.customers.size < 5) {
      console.log("Customer created");

      this.customers.set(
        this.customerId,
        new Bezelbub(
          this.customerId++,
          this.scene,
          80,
          100,
          FINAL_CUSTOMER_GOAL - 130 * this.customers.size
        )
      );
    }
  }

  checkCustomer() {}

  dropCustomer(id: number) {
    this.customers.delete(id);
    this.customers.forEach((customer, key) => {
      if (key > id) {
        customer.yGoal += 130;
        customer.state = "moving";
      }
    });
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    // if (Math.random() > 0.8) console.log(time);
  }
}

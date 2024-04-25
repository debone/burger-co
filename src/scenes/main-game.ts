import { Scene } from "phaser";

import PhaserGamebus from "../lib/gamebus";
import { UIPlugin } from "../lib/rexui";

import { RESOURCES } from "../assets";

import { Dispenser } from "../objects/burger-shop/dispensers/dispenser";
import { SmallWorkspace } from "../objects/burger-shop/workspaces/small-workspace";
import { IngredientsStack } from "../objects/ingredients-stack/ingredients-stack";
import { MeatPatty } from "../objects/ingredients/meat-patty/meat-patty";
import { CustomerQueue } from "../systems/customer-queue";
import { Orders } from "../systems/orders/orders";
import {
  QUALITY,
  QualityIndicator,
} from "../ui/quality-indicator/quality-indicator";
import { GAME_HEIGHT, GAME_WIDTH } from "../main";

export class MainGame extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  declare bus: Phaser.Events.EventEmitter;
  declare gamebus: PhaserGamebus;
  declare rexUI: UIPlugin;

  constructor() {
    super("Game");
  }

  create() {
    this.bus = this.gamebus.getBus();

    this.camera = this.cameras.main;

    this.background = this.add.image(0, 0, RESOURCES.BURGER_SHOP_EMPTY);
    this.background.setOrigin(0, 0);

    this.add
      .image(0, 0, RESOURCES.BURGER_SHOP_CEILING)
      .setOrigin(0, 0)
      .setDepth(9999);

    this.matter.world.setBounds().disableGravity();

    new SmallWorkspace(this);

    this.startDay();

    /*
    new Patty(this, 720, 480, RESOURCES.BURGER_PATTY);
    new Patty(this, 720, 475, RESOURCES.BURGER_PATTY);
    new Patty(this, 770, 480, RESOURCES.BURGER_PATTY);
    new Patty(this, 770, 475, RESOURCES.BURGER_PATTY);

    this.matter.world.nextCategory();
    let a = this.matter.world.nextCategory();

    new Stacked(this, 360, 820, RESOURCES.BURGER_BOTTOM).setCollisionCategory(
      a
    );

    new Indicator(this, 360, 280);

    new BurgerPatty(this, 370, 480, RESOURCES.BURGER_PATTY);
    new Patty(this, 370, 380, RESOURCES.BURGER_PATTY);*/

    if (import.meta.env.DEV) {
      const ing = new IngredientsStack(this, 620, 600);

      ing.addIngredient(
        new MeatPatty(this, 0, 0, Math.floor(Math.random() * 5))
      );
      ing.addIngredient(
        new MeatPatty(this, 0, 0, Math.floor(Math.random() * 5))
      );
      ing.addIngredient(
        new MeatPatty(this, 0, 0, Math.floor(Math.random() * 5))
      );
      ing.addIngredient(
        new MeatPatty(this, 0, 0, Math.floor(Math.random() * 5))
      );
      ing.addIngredient(
        new MeatPatty(this, 0, 0, Math.floor(Math.random() * 5))
      );

      const ing2 = new IngredientsStack(this, 720, 600);
      ing2.addIngredient(
        new MeatPatty(this, 0, 0, Math.floor(Math.random() * 5))
      );
      ing2.addIngredient(
        new MeatPatty(this, 0, 0, Math.floor(Math.random() * 5))
      );
      ing2.addIngredient(
        new MeatPatty(this, 0, 0, Math.floor(Math.random() * 5))
      );

      const ing3 = new IngredientsStack(this, 820, 600);
      ing3.addIngredient(new MeatPatty(this, 0, 0));
      ing3.addIngredient(new MeatPatty(this, 0, 0));

      const ing4 = new IngredientsStack(this, 860, 600);
      ing4.addIngredient(new MeatPatty(this, 0, 0, QUALITY.BURNT));
    }

    this.matter.add.mouseSpring({
      stiffness: 0.2,
      damping: 1,
      collisionFilter: {
        category: 0x0002,
        mask: 3,
        group: 0,
      },
    });

    this.input.on("pointerup", () => {
      this.bus.emit("activePointer:up");
    });

    this.input.once("pointerdown", () => {
      //      this.scene.start("GameOver");
    });
  }

  orders: Orders;
  customerQueue: CustomerQueue;

  registerSystems() {
    this.orders = new Orders(this);
    this.customerQueue = new CustomerQueue(this).create();
  }

  weekPrecision: number = 0;
  weekQuality: number = 0;
  weekTiming: number = 0;

  day: number = 0;

  dayPrecision: number = 0;
  dayQuality: number = 0;
  dayTiming: number = 0;

  dayDuration: number = 100;
  clockTime: number = this.dayDuration;
  clockTick: Phaser.Time.TimerEvent;
  clockText: Phaser.GameObjects.Text;

  dispensers: Dispenser[] = [];

  tickClock() {
    this.clockTime--;
    this.clockText.setText(
      `Day ${this.day}\n${Math.floor(this.clockTime / 60)
        .toString()
        .padStart(2, "0")}:${(this.clockTime % 60).toString().padStart(2, "0")}`
    );

    if (this.clockTime < 1) {
      this.clockTick.destroy();
      this.clockText.destroy();
      this.endDay();
      //this.startDay();
    }
  }

  mapScoreToQuality(score: number) {
    if (score < 2) {
      return QUALITY.BURNT;
    } else if (score < 3) {
      return QUALITY.LUKEWARM;
    } else if (score < 4) {
      return QUALITY.COOKED;
    } else {
      return QUALITY.OVERCOOKED;
    }
  }

  addScore(score: "precision" | "quality" | "timing", value: number) {
    switch (score) {
      case "precision":
        this.dayPrecision = Math.max(Math.min(this.dayPrecision + value, 4), 0);
        break;
      case "quality":
        this.dayQuality = Math.max(Math.min(this.dayQuality + value, 4), 0);
        break;
      case "timing":
        this.dayTiming = Math.max(Math.min(this.dayTiming + value, 4), 0);
        break;
    }
  }

  addTotalWeekScore(precision: number, quality: number, timing: number) {
    this.weekPrecision += precision / 3;
    this.weekQuality += quality / 3;
    this.weekTiming += timing / 3;
  }

  startDay() {
    this.day++;
    this.clockTime = this.dayDuration;

    const dayText = this.add
      .text(600, 325, `Day ${this.day}`, {
        fontFamily: "DotGothic16",
        fontSize: "72px",
        color: "#d32836",
      })
      .setShadow(0, 0, "#0a202f", 3, true, true);

    this.clockText = this.add
      .text(20, 20, "XX:XX", {
        fontFamily: "DotGothic16",
        fontSize: "48px",
        color: "#d32836",
      })
      .setDepth(9999);

    this.clockTick = this.time.addEvent({
      delay: 990,
      callback: this.tickClock,
      callbackScope: this,
      loop: true,
    });

    this.tweens.add({
      targets: dayText,
      duration: 2000,
      hold: 2000,
      ease: "quad.in",
      alpha: 0,
    });

    this.registerSystems();

    this.customerQueue.play();

    this.dispensers.push(new Dispenser(this, 3, "MEAT_PATTY"));
  }

  endDay() {
    this.customerQueue.wipeCustomers();
    this.customerQueue.destroy();
    this.orders.destroy();
    this.matter.world.getAllBodies().forEach((body) => {
      if (body.label === "stack") {
        body.gameObject?.destroy();
        this.matter.world.remove(body);
      }
    });
    this.dispensers.forEach((dispenser) => {
      dispenser.destroy();
    });
    this.dispensers = [];

    // Calculate score
    this.addTotalWeekScore(this.dayPrecision, this.dayQuality, this.dayTiming);

    if (this.day < 3) {
      this.displayDayResults();
    } else {
      this.displayWeekResults();
    }

    this.dayPrecision = 0;
    this.dayQuality = 0;
    this.dayTiming = 0;
  }

  displayDayResults() {
    // Display score
    const popup = this.rexUI.add.sizer({
      orientation: "y",
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      width: 400,
      height: 400,
      space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    });

    popup.addBackground(this.rexUI.add.roundRectangle(0, 0, 1, 1, 0, 0x302d6a));

    const gridSizer = this.rexUI.add
      .gridSizer({
        x: 0,
        y: 100,
        width: 400,
        column: 2,
        row: 15,
        space: {
          column: 0,
          row: 0,
          left: 30,
          right: 10,
          top: 20,
          bottom: 10,
        },
      })
      .addBackground(this.rexUI.add.roundRectangle(0, 0, 1, 1, 0, 0x0a202f))

      .setOrigin(0, 0);

    gridSizer.add(
      this.rexUI.add
        .sizer({
          orientation: "y",
        })
        .add(
          this.add.text(0, 0, "Precision", {
            fontFamily: "DotGothic16",
            fontSize: "48px",
            color: "#d32836",
          })
        )
        .add(
          this.add.text(0, 0, "The correct order of ingredients", {
            fontFamily: "DotGothic16",
            fontSize: "16px",
            color: "#d32836",
          })
        )
        .layout(),
      { column: 0, expand: false, align: "center" }
    );
    gridSizer.add(
      new QualityIndicator(
        this,
        0,
        0,
        this.mapScoreToQuality(this.dayPrecision),
        true
      ).setScale(1.25),
      {
        expand: false,
        align: "bottom",
      }
    );

    gridSizer.add(
      this.rexUI.add
        .sizer({
          orientation: "y",
        })
        .add(
          this.add.text(0, 0, "Quality", {
            fontFamily: "DotGothic16",
            fontSize: "48px",
            color: "#d32836",
          })
        )
        .add(
          this.add.text(0, 0, "The correct cooking of ingredients", {
            fontFamily: "DotGothic16",
            fontSize: "16px",
            color: "#d32836",
          })
        )
        .layout(),
      { expand: false, align: "center" }
    );
    gridSizer.add(
      new QualityIndicator(
        this,
        0,
        0,
        this.mapScoreToQuality(this.dayQuality),
        true
      ).setScale(1.25),
      {
        expand: false,
        align: "bottom",
      }
    );

    gridSizer.add(
      this.rexUI.add
        .sizer({
          orientation: "y",
        })
        .add(
          this.add.text(0, 0, "Timing", {
            fontFamily: "DotGothic16",
            fontSize: "48px",
            color: "#d32836",
          })
        )
        .add(
          this.add.text(0, 0, "Devils are impatient", {
            fontFamily: "DotGothic16",
            fontSize: "16px",
            color: "#d32836",
          })
        )
        .layout(),
      { expand: false, align: "center" }
    );
    gridSizer.add(
      new QualityIndicator(
        this,
        0,
        0,
        this.mapScoreToQuality(this.dayTiming),
        true
      ).setScale(1.25),
      {
        expand: false,
        align: "bottom",
      }
    );

    gridSizer.layout();

    popup.add(
      this.add.text(0, 0, `Results for day ${this.day}`, {
        fontFamily: "DotGothic16",
        fontSize: "48px",
        color: "#d32836",
      })
    );
    popup.addSpace(0.5);
    popup.add(gridSizer);
    popup.addSpace(0.3);
    popup.add(
      this.add.text(0, 0, "Click to start next day", {
        fontFamily: "DotGothic16",
        fontSize: "18px",
        color: "#d32836",
      })
    );

    popup.layout();

    this.add.existing(gridSizer);

    this.input.once("pointerup", () => {
      popup.destroy();
      this.startDay();
    });
  }

  displayWeekResults() {
    const rect = this.add
      .rectangle(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        GAME_WIDTH,
        GAME_HEIGHT,
        0x000000
      )
      .setAlpha(0);

    this.tweens.add({
      targets: rect,
      alpha: 0.15,
      duration: 1000,
    });

    // Display score
    const popup = this.rexUI.add.sizer({
      orientation: "y",
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      width: 400,
      height: 400,
      space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    });

    popup.addBackground(this.rexUI.add.roundRectangle(0, 0, 1, 1, 0, 0x302d6a));

    const gridSizer = this.rexUI.add
      .gridSizer({
        x: 0,
        y: 100,
        width: 400,
        column: 2,
        row: 15,
        space: {
          column: 0,
          row: 0,
          left: 30,
          right: 10,
          top: 20,
          bottom: 10,
        },
      })
      .addBackground(this.rexUI.add.roundRectangle(0, 0, 1, 1, 0, 0x0a202f))

      .setOrigin(0, 0);

    gridSizer.add(
      this.rexUI.add
        .sizer({
          orientation: "y",
        })
        .add(
          this.add.text(0, 0, "Precision", {
            fontFamily: "DotGothic16",
            fontSize: "48px",
            color: "#d32836",
          })
        )
        .add(
          this.add.text(0, 0, "The correct order of ingredients", {
            fontFamily: "DotGothic16",
            fontSize: "16px",
            color: "#d32836",
          })
        )
        .layout(),
      { column: 0, expand: false, align: "center" }
    );
    gridSizer.add(
      new QualityIndicator(
        this,
        0,
        0,
        this.mapScoreToQuality(this.dayPrecision),
        true
      ).setScale(1.25),
      {
        expand: false,
        align: "bottom",
      }
    );

    gridSizer.add(
      this.rexUI.add
        .sizer({
          orientation: "y",
        })
        .add(
          this.add.text(0, 0, "Quality", {
            fontFamily: "DotGothic16",
            fontSize: "48px",
            color: "#d32836",
          })
        )
        .add(
          this.add.text(0, 0, "The correct cooking of ingredients", {
            fontFamily: "DotGothic16",
            fontSize: "16px",
            color: "#d32836",
          })
        )
        .layout(),
      { expand: false, align: "center" }
    );
    gridSizer.add(
      new QualityIndicator(
        this,
        0,
        0,
        this.mapScoreToQuality(this.dayQuality),
        true
      ).setScale(1.25),
      {
        expand: false,
        align: "bottom",
      }
    );

    gridSizer.add(
      this.rexUI.add
        .sizer({
          orientation: "y",
        })
        .add(
          this.add.text(0, 0, "Timing", {
            fontFamily: "DotGothic16",
            fontSize: "48px",
            color: "#d32836",
          })
        )
        .add(
          this.add.text(0, 0, "Devils are impatient", {
            fontFamily: "DotGothic16",
            fontSize: "16px",
            color: "#d32836",
          })
        )
        .layout(),
      { expand: false, align: "center" }
    );
    gridSizer.add(
      new QualityIndicator(
        this,
        0,
        0,
        this.mapScoreToQuality(this.dayTiming),
        true
      ).setScale(1.25),
      {
        expand: false,
        align: "bottom",
      }
    );

    gridSizer.layout();

    popup.add(
      this.add.text(0, 0, `The 3rd day has to the end and...`, {
        fontFamily: "DotGothic16",
        fontSize: "48px",
        color: "#d32836",
      })
    );

    popup.addSpace(0.3);

    if (
      this.weekPrecision >= 4 &&
      this.weekQuality >= 4 &&
      this.weekTiming >= 4
    ) {
      popup.add(
        this.add.text(0, 0, `...and you saved the restaurant! Good job!`, {
          fontFamily: "DotGothic16",
          fontSize: "36px",
          color: "#d32836",
        })
      );
    } else {
      popup.add(
        this.add.text(
          0,
          0,
          `...your quality was not enough, you have been fired!`,
          {
            fontFamily: "DotGothic16",
            fontSize: "36px",
            color: "#d32836",
          }
        )
      );
    }

    popup.addSpace(0.3);
    popup.add(gridSizer);
    popup.addSpace(0.5);
    popup.add(
      this.add.text(0, 0, "Thank you for playing!", {
        fontFamily: "DotGothic16",
        fontSize: "18px",
        color: "#d32836",
      })
    );
    popup.addSpace(0.2);
    popup.add(
      this.add.text(0, 0, "Don't forget to vote!", {
        fontFamily: "DotGothic16",
        fontSize: "18px",
        color: "#d32836",
      })
    );
    popup.addSpace(0.5);
    popup.add(
      this.add.text(0, 0, "Game by @javascripl", {
        fontFamily: "DotGothic16",
        fontSize: "18px",
        color: "#d32836",
      })
    );

    popup.layout();

    this.add.existing(gridSizer);
  }
}

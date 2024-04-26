import { pickRandom } from "../../common/helpers";
import { QUALITY } from "../../ui/quality-indicator/quality-indicator";

export const RECIPES = {
  "basic-burger": () => {
    return [
      {
        ingredient: "TOP_BUN",
        status: pickRandom([QUALITY.RAW]),
      },
      {
        ingredient: "MEAT_PATTY",
        status: pickRandom([
          QUALITY.RAW,
          QUALITY.LUKEWARM,
          QUALITY.COOKED,
          QUALITY.BURNT,
          QUALITY.OVERCOOKED,
        ]),
      },
      {
        ingredient: "BOTTOM_BUN",
        status: pickRandom([QUALITY.RAW]),
      },
    ];
  },
  "double-burger": () => {
    return [
      {
        ingredient: "TOP_BUN",
        status: pickRandom([QUALITY.RAW]),
      },
      {
        ingredient: "MEAT_PATTY",
        status: pickRandom([
          QUALITY.RAW,
          QUALITY.LUKEWARM,
          QUALITY.COOKED,
          QUALITY.BURNT,
          QUALITY.OVERCOOKED,
        ]),
      },
      {
        ingredient: "MEAT_PATTY",
        status: pickRandom([
          QUALITY.RAW,
          QUALITY.LUKEWARM,
          QUALITY.COOKED,
          QUALITY.BURNT,
          QUALITY.OVERCOOKED,
        ]),
      },
      {
        ingredient: "BOTTOM_BUN",
        status: pickRandom([QUALITY.RAW]),
      },
    ];
  },
  "cheese-burger": () => {
    let fill = [];

    if (Math.random() > 0.5) {
      fill.push({
        ingredient: "DEVILS_CHEDDAR",
        status: pickRandom([QUALITY.RAW]),
      });
    }

    fill.push({
      ingredient: pickRandom(["DEVILS_CHEDDAR", "GOAT_EYES"]),
      status: pickRandom([QUALITY.COOKED, QUALITY.RAW]),
    });

    return [
      {
        ingredient: "TOP_BUN",
        status: pickRandom([QUALITY.RAW]),
      },
      ...fill,
      {
        ingredient: "MEAT_PATTY",
        status: pickRandom([
          QUALITY.RAW,
          QUALITY.LUKEWARM,
          QUALITY.COOKED,
          QUALITY.BURNT,
          QUALITY.OVERCOOKED,
        ]),
      },
      {
        ingredient: "BOTTOM_BUN",
        status: pickRandom([QUALITY.RAW]),
      },
    ];
  },
  "cheese-black-burger": () => {
    let fill = [];

    fill.push({
      ingredient: pickRandom(["DEVILS_CHEDDAR", "GOAT_EYES"]),
      status: pickRandom([QUALITY.COOKED, QUALITY.BURNT]),
    });

    return [
      {
        ingredient: "TOP_BUN",
        status: pickRandom([QUALITY.RAW, QUALITY.OVERCOOKED]),
      },
      ...fill,
      {
        ingredient: "DRAGON_CLAW",
        status: pickRandom([QUALITY.BURNT, QUALITY.OVERCOOKED]),
      },
      {
        ingredient: "BOTTOM_BUN",
        status: pickRandom([QUALITY.RAW, QUALITY.OVERCOOKED]),
      },
    ];
  },
  "soul-burger": () => {
    let fill = [];

    if (Math.random() > 0.5) {
      fill.push({
        ingredient: pickRandom(["DEVILS_CHEDDAR", "GOAT_EYES"]),
        status: pickRandom([QUALITY.COOKED, QUALITY.RAW]),
      });
    }

    fill.push({
      ingredient: pickRandom(["MEAT_PATTY", "DRAGON_CLAW"]),
      status: pickRandom([QUALITY.COOKED, QUALITY.BURNT, QUALITY.OVERCOOKED]),
    });

    return [
      {
        ingredient: "SOUL_BUN_TOP",
        status: pickRandom([QUALITY.RAW, QUALITY.OVERCOOKED]),
      },
      ...fill,
      {
        ingredient: "SOUL_BUN_BOTTOM",
        status: pickRandom([QUALITY.RAW, QUALITY.OVERCOOKED]),
      },
    ];
  },
  "devils-burger": () => {
    let fill = [];

    if (Math.random() > 0.5) {
      fill.push({
        ingredient: pickRandom(["DEVILS_CHEDDAR", "GOAT_EYES"]),
        status: pickRandom([QUALITY.COOKED, QUALITY.RAW]),
      });
    }

    fill.push({
      ingredient: pickRandom(["DEVILS_CHEDDAR", "GOAT_EYES"]),
      status: pickRandom([QUALITY.COOKED, QUALITY.RAW]),
    });

    fill.push({
      ingredient: pickRandom(["MEAT_PATTY", "DRAGON_CLAW"]),
      status: pickRandom([QUALITY.COOKED, QUALITY.BURNT, QUALITY.OVERCOOKED]),
    });

    return [
      {
        ingredient: "HORN_BUN_TOP",
        status: pickRandom([QUALITY.OVERCOOKED, QUALITY.BURNT]),
      },
      ...fill,
      {
        ingredient: "SOUL_BUN_BOTTOM",
        status: pickRandom([QUALITY.RAW, QUALITY.OVERCOOKED]),
      },
    ];
  },
};

/*
if (this.scene.day > 2) {
      this.dispensers.push(new Dispenser(this, 2, "DEVILS_CHEDDAR"));
      this.dispensers.push(new Dispenser(this, 6, "GOAT_EYES"));
      this.dispensers.push(new Dispenser(this, 10, "DRAGON_CLAW"));
    }
    if (this.scene.day > 1) {
      this.dispensers.push(new Dispenser(this, 1, "SOUL_BUN_BOTTOM"));
      this.dispensers.push(new Dispenser(this, 5, "SOUL_BUN_TOP"));
      this.dispensers.push(new Dispenser(this, 9, "HORN_BUN_TOP"));
    }
    */

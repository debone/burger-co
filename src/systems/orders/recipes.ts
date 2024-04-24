import { pickRandom } from "../../common/helpers";
import { QUALITY } from "../../ui/quality-indicator/quality-indicator";

export const RECIPES = {
  "basic-burger": () => {
    return [
      {
        ingredient: "MEAT_PATTY",
        status: pickRandom([QUALITY.BURNT, QUALITY.OVERCOOKED]),
      },
      {
        ingredient: "MEAT_PATTY",
        status: pickRandom([QUALITY.RAW, QUALITY.LUKEWARM, QUALITY.COOKED]),
      },
      {
        ingredient: "MEAT_PATTY",
        status: pickRandom([QUALITY.BURNT, QUALITY.OVERCOOKED]),
      },
    ];
  },
};

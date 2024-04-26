import { INGREDIENTS, INGREDIENTS_REPRESENTATION, Ingredients } from "..";
import { RESOURCES } from "../../../assets";
import { MainGame } from "../../../scenes/main-game";
import {
  QUALITY,
  QualityIndicator,
} from "../../../ui/quality-indicator/quality-indicator";

export class SoulBunBottom
  extends Phaser.GameObjects.Container
  implements Ingredients
{
  bus: Phaser.Events.EventEmitter;

  qualityIndicator: QualityIndicator;
  quality: QUALITY;
  cookedScore: number;
  ingredientImage: Phaser.GameObjects.Image;
  ingredient: INGREDIENTS_REPRESENTATION;

  constructor(
    scene: MainGame,
    x: number,
    y: number,
    quality: QUALITY = QUALITY.RAW
  ) {
    super(scene, x, y);

    this.ingredient = INGREDIENTS.SOUL_BUN_BOTTOM;
    this.quality = quality;

    this.bus = scene.gamebus.getBus();

    const patty = scene.make.image({ key: soulBunBottom.sprite });
    patty.setDisplaySize(55, 65);
    patty.setDisplayOrigin(55, 100);
    patty.setTint(soulBunBottom.tint[this.quality]);
    this.add(patty);
    this.ingredientImage = patty;
    this.cookedScore = 0;

    const qualityIndicator = new QualityIndicator(scene, 0, 18, this.quality);
    qualityIndicator.setVisible(false);
    this.add(qualityIndicator);
    this.qualityIndicator = qualityIndicator;
  }

  setQuality(quality: QUALITY) {
    this.quality = quality;
    this.ingredientImage.setTint(soulBunBottom.tint[quality]);
    this.qualityIndicator.setQuality(quality);
  }

  cookTick() {
    this.cookedScore += 1;
    if (this.cookedScore > soulBunBottom.cookStepTime) {
      this.cook();
    }
  }
  cook() {
    this.cookedScore = 0;
    if (this.quality === QUALITY.RAW) {
      this.setQuality(QUALITY.OVERCOOKED);
    } else if (this.quality === QUALITY.OVERCOOKED) {
      this.setQuality(QUALITY.BURNT);
    }
  }
}

export const soulBunBottom = {
  name: "Soul bottom",
  sprite: RESOURCES.SOUL_BUN_BOTTOM,
  dispenserOffset: { x: -35, y: 160 },
  cookStepTime: 50,
  object: SoulBunBottom,
  tint: {
    [QUALITY.RAW]: 0xfbb954,
    [QUALITY.LUKEWARM]: 0xff99dd,
    [QUALITY.COOKED]: 0xfbb954,
    [QUALITY.OVERCOOKED]: 0x9e3344,
    [QUALITY.BURNT]: 0x333333,
  },
};

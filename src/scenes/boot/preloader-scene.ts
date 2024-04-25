import { Scene } from "phaser";
import { RESOURCES } from "../../assets";

import statusIconsImg from "../../../public/assets/status-icons.png?url";
import { GAME_WIDTH } from "../../main";

export const imageIso = import.meta.glob<{ default: string }>(
  "../../../public/assets/*.png",
  { eager: true }
);

if (import.meta.env.DEV) {
  console.log(imageIso);
}

export const RESOURCES_INDEX = Object.keys(RESOURCES).reduce(
  (acc, key, index) => ({ ...acc, [key]: index }),
  {} as Record<keyof typeof RESOURCES, number>
);

export const RESOURCES_LIST = Object.values(RESOURCES);

declare var WebFont: any;

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    //this.add.image(512, 384, RESOURCES.BACKGROUND);

    //  A simple progress bar. This is the outline of the bar.
    this.add
      .rectangle(GAME_WIDTH / 2, 484, 468, 32)
      .setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(GAME_WIDTH / 2 - 230, 484, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );

    for (const sprite in imageIso) {
      this.load.image(
        sprite.replace("../../../public/assets/", ""),
        imageIso[sprite].default.replace("/public", "")
      );
    }

    this.load.spritesheet("status-icons", statusIconsImg, {
      frameWidth: 64,
    });
  }

  create() {
    WebFont.load({
      google: {
        families: ["DotGothic16"],
      },
      active: () => {
        if (import.meta.env.DEV) {
          this.scene.run("Debug");
          this.scene.start("Game");
        } else {
          this.add.image(0, 0, RESOURCES.MAIN_MENU).setOrigin(0, 0);

          this.input.once("pointerdown", () => {
            this.scene.start("MainMenu");
          });
        }
      },
    });
  }
}

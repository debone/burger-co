import { Boot } from "./scenes/boot/Boot";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/boot/Preloader";

import { Game, Types } from "phaser";
import PhaserGamebus from "./lib/gamebus";

import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { Debug } from "./scenes/Debug";

export const GAME_WIDTH = 1384;
export const GAME_HEIGHT = 850;

export const FINAL_CUSTOMER_GOAL = GAME_HEIGHT - 100;

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "game-container",
  backgroundColor: "#183f39",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "matter",
  },
  plugins: {
    global: [
      {
        key: "PhaserGamebus",
        plugin: PhaserGamebus,
        start: true,
        mapping: "gamebus",
      },
    ],
    scene: [
      {
        key: "rexUI",
        plugin: RexUIPlugin,
        mapping: "rexUI",
      },
    ],
  },
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver, Debug],
};

if (import.meta.env.DEV) {
  {
    config.physics!.matter = {};
    config.physics!.matter.debug = true;
  }
}

export default new Game(config);
